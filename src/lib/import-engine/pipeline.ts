import { prisma } from "@/lib/db";
import { AffiliateConnector } from "./types";
import { Validator } from "./validator";
import { Deduplicator } from "./deduplicator";
import { QualityEngine } from "./quality-engine";
import { MerchantResolver } from "./merchant-resolver";
import { notificationEngine } from "@/lib/notifications";
import { logger } from "@/lib/logger";

export class ImportPipeline {
  private validator = new Validator();
  private deduplicator = new Deduplicator();
  private qualityEngine = new QualityEngine();
  private resolver = new MerchantResolver();

  /**
   * Executes an import run using the provided connector.
   */
  async run(connector: AffiliateConnector, connectorVersion: string = "v1.0"): Promise<string> {
    const startTime = Date.now();
    
    // 1. Create the ImportJob record
    const importJob = await prisma.importJob.create({
      data: {
        source: connector.sourceId,
        status: "PROCESSING",
        startedAt: new Date(),
        connectorVersion
      }
    });

    const childLogger = logger.child({ 
      connector: connector.sourceId, 
      jobId: importJob.id 
    });

    childLogger.info("Import Pipeline Started");

    let totalRows = 0;
    let validRows = 0;
    let duplicates = 0;
    let totalQuality = 0;
    
    let pagesFetched = 0;
    
    try {
      await connector.connect();

      // 2. Fetch & Stream Raw Data
      for await (const pageOrRow of connector.fetch()) {
        pagesFetched++;
        
        // Handle case where connector yields arrays (pages) or single rows
        const rows = Array.isArray(pageOrRow) ? pageOrRow : [pageOrRow];
        childLogger.info({ page: pagesFetched, count: rows.length }, "Fetched page");
        
        for (const rawData of rows) {
          totalRows++;
          
          try {
            // 3. Normalize
            const normalized = connector.normalize(rawData);
            
            // 4. Initial Connector Validation (e.g. malformed rows)
            let validationErrors = connector.validate(normalized);
            
            // 4.5 Merchant Resolution
            let storeId: string | undefined = undefined;
            let suggestedStoreId: string | null = null;
            let resolutionReason: string | null = null;
            let resolutionSource: string | null = null;
            let resolutionConfidence: any = null;

            const resolution = await this.resolver.resolve(normalized.merchantName, normalized.storeUrl);
            
            if (resolution.storeId) {
              storeId = resolution.storeId;
              
              // Auto-create alias for highly confident fuzzy matches
              if (resolution.confidence >= 98 && resolution.reason === 'High Confidence Fuzzy Match') {
                try {
                  await prisma.merchantAlias.upsert({
                    where: { merchantId_alias: { merchantId: storeId, alias: normalized.merchantName } },
                    update: { lastSeenAt: new Date() },
                    create: {
                      merchantId: storeId,
                      alias: normalized.merchantName,
                      normalizedAlias: MerchantResolver.normalize(normalized.merchantName),
                      source: connector.sourceId,
                      confidence: 98,
                    }
                  });
                } catch (e) {
                  // Ignore unique constraint errors
                }
              }
            } else if (resolution.suggestedStoreId) {
              suggestedStoreId = resolution.suggestedStoreId;
            }
            
            resolutionReason = resolution.reason;
            resolutionSource = resolution.resolutionSource || null;
            resolutionConfidence = resolution.signals;

            // Fetch the store for full pipeline validation
            const store = storeId ? await prisma.store.findUnique({ where: { id: storeId }}) : null;

            // 5. Full Pipeline Validation
            const engineErrors = await this.validator.validate(normalized, { existingStores: store ? [store] : [] });
            validationErrors = [...validationErrors, ...engineErrors];

            // 6. Deduplication
            const duplicateResult = await this.deduplicator.check(normalized, storeId);

            // 7. Quality Engine
            const qualityMetrics = this.qualityEngine.evaluate(normalized, validationErrors, duplicateResult, storeId);
            totalQuality += qualityMetrics.finalScore;

            // 8. Determine Status
            let status = "pending";
            if (duplicateResult.riskScore >= 90) {
              status = "duplicate";
              duplicates++;
            } else if (qualityMetrics.finalScore >= 90 && validationErrors.filter(e => e.severity === 'error').length === 0) {
              validRows++;
            } else if (validationErrors.some(e => e.severity === "error")) {
              status = "rejected";
            } else {
              validRows++;
            }

            // 9. Persistence
            await prisma.importedOffer.create({
              data: {
                importJobId: importJob.id,
                source: connector.sourceId,
                sourceId: normalized.externalId,
                rawData: rawData as any,
                normalizedData: normalized as any,
                
                completenessScore: qualityMetrics.completeness,
                validationScore: qualityMetrics.validation,
                confidenceScore: qualityMetrics.confidence,
                freshnessScore: qualityMetrics.freshness,
                merchantMatchScore: qualityMetrics.merchantMatch,
                duplicateRisk: qualityMetrics.duplicateRisk,
                finalQualityScore: qualityMetrics.finalScore,
                
                resolvedStoreId: storeId,
                suggestedStoreId,
                resolutionReason,
                resolutionSource,
                resolutionConfidence,
                
                validationErrors: validationErrors as any,
                status
              }
            });

          } catch (rowError) {
            childLogger.error({ err: rowError, row: totalRows }, "Row failed in pipeline");
          }
        }
      }

      const processingTimeMs = Date.now() - startTime;
      const avgQuality = totalRows > 0 ? (totalQuality / totalRows) : 0;

      // 10. Finalize Job
      await prisma.importJob.update({
        where: { id: importJob.id },
        data: {
          status: "COMPLETED",
          finishedAt: new Date(),
          totalRows,
          recordsFetched: totalRows,
          pagesFetched,
          validRows,
          duplicates,
          avgQuality,
          processingTimeMs,
          apiLatencyMs: processingTimeMs // We can approximate this for now if the whole run is API bound
        }
      });

      // 11. Notify
      await notificationEngine.notify({
        title: `Import Completed: ${connector.name || connector.sourceId}`,
        message: `Processed ${totalRows} rows. ${validRows} valid, ${duplicates} duplicates. Avg Quality: ${avgQuality.toFixed(1)}`,
        level: "SUCCESS",
        source: "import-engine",
        link: `/admin/import-jobs/${importJob.id}`
      });

    } catch (error) {
      childLogger.error({ err: error }, "Import Pipeline Failed");
      await prisma.importJob.update({
        where: { id: importJob.id },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
          totalRows,
          recordsFetched: totalRows,
          pagesFetched,
          validRows,
          processingTimeMs: Date.now() - startTime
        }
      });

      await notificationEngine.notify({
        title: `Import Failed: ${connector.name || connector.sourceId}`,
        message: error instanceof Error ? error.message : "Unknown error",
        level: "ERROR",
        source: "import-engine",
        link: `/admin/import-jobs/${importJob.id}`
      });
    } finally {
      await connector.disconnect();
    }

    return importJob.id;
  }
}
