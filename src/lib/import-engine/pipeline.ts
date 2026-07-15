import { prisma } from "@/lib/db";
import { AffiliateConnector } from "./types";
import { OfferValidator } from "./validator";
import { Deduplicator } from "./deduplicator";
import { QualityEngine } from "./quality-engine";
import { MerchantResolver } from "./merchant-resolver";
import { notificationEngine } from "@/lib/notifications";
import { logger } from "@/lib/logger";
import { evaluateAutoPublish } from "./publish-policy";
import { PublishService } from "./publish-service";
import { EnrichmentHook } from "./types";
import { DomainNormalizerHook } from "./hooks/domain-normalizer.hook";

export class ImportPipeline {
  private validator = new OfferValidator();
  private deduplicator = new Deduplicator();
  private qualityEngine = new QualityEngine();
  private resolver = new MerchantResolver();
  private publishService = new PublishService();
  private hooks: EnrichmentHook[] = [new DomainNormalizerHook()];

  /**
   * Executes an import run using the provided connector.
   * @param publish - If false, runs in dry-run mode and doesn't auto-publish
   */
  async run(connector: AffiliateConnector, connectorVersion: string = "v1.0", publish: boolean = true): Promise<string> {
    const startTime = Date.now();
    
    // 1. Create the ImportJob & ConnectorRun records
    const importJob = await prisma.importJob.create({
      data: {
        source: connector.id,
        status: "PROCESSING",
        startedAt: new Date(),
        connectorVersion
      }
    });

    const connectorRun = await prisma.connectorRun.create({
      data: {
        connector: connector.id,
        startedAt: new Date(),
        status: "RUNNING"
      }
    });

    const childLogger = logger.child({ 
      connector: connector.id, 
      jobId: importJob.id 
    });

    childLogger.info("Import Pipeline Started");

    let totalRows = 0;
    let validRows = 0;
    let duplicates = 0;
    let totalQuality = 0;
    let autoPublishedCount = 0;
    let pagesFetched = 0;
    
    try {
      if (connector.authenticate) {
        await connector.authenticate();
      }

      // 1.5 Determine Incremental Sync
      let since: Date | undefined = undefined;
      if (connector.manifest?.supportsIncrementalSync) {
        const lastRun = await prisma.connectorRun.findFirst({
            where: { connector: connector.id, status: "COMPLETED" },
            orderBy: { finishedAt: "desc" }
        });
        if (lastRun?.finishedAt) {
            since = lastRun.finishedAt;
            childLogger.info({ since }, "Using incremental sync");
        }
      }

      const seenOfferIds = new Set<string>();

      // 2. Fetch & Stream Raw Data
      for await (const pageOrRow of connector.fetch(undefined, since)) {
        pagesFetched++;
        
        const rows = Array.isArray(pageOrRow) ? pageOrRow : [pageOrRow];
        childLogger.info({ page: pagesFetched, count: rows.length }, "Fetched page");
        
        for (const rawData of rows) {
          totalRows++;
          
          try {
            // 3. Normalize
            let normalized = await connector.normalize(rawData);
            
            // 3.5 Enrichment Hooks
            for (const hook of this.hooks) {
                normalized = await hook.execute(normalized);
            }

            if (normalized.provenance.connectorOfferId) {
                seenOfferIds.add(normalized.provenance.connectorOfferId);
            }
            
            // 4. Initial Connector Validation
            let validationResult = connector.validate(normalized);
            let validationErrors = validationResult.errors;
            
            // 4.5 Merchant Resolution
            let identityId: string | undefined = undefined;
            let suggestedIdentityId: string | null = null;
            
            const resolution = await this.resolver.resolve(normalized.merchantName, normalized.storeUrl);
            
            if (resolution.identityId) {
              identityId = resolution.identityId;
              
              // If it's highly confident fuzzy, we can automatically learn the alias
              if (resolution.confidence >= 98 && resolution.reason === 'High Confidence Fuzzy Match') {
                try {
                  const identity = await prisma.merchantIdentity.findUnique({ where: { id: identityId } });
                  if (identity?.canonicalStoreId) {
                    await prisma.merchantAlias.upsert({
                      where: { merchantId_alias: { merchantId: identity.canonicalStoreId, alias: normalized.merchantName } },
                      update: { lastSeenAt: new Date() },
                      create: {
                        merchantId: identity.canonicalStoreId,
                        alias: normalized.merchantName,
                        normalizedAlias: MerchantResolver.normalize(normalized.merchantName),
                        source: connector.id,
                        confidence: 98,
                      }
                    });
                  }
                } catch (e) {
                  // Ignore unique constraint
                }
              }
            } else if (resolution.suggestedIdentityId) {
              suggestedIdentityId = resolution.suggestedIdentityId;
            }
            
            // Fetch the store for full pipeline validation
            const identity = identityId ? await prisma.merchantIdentity.findUnique({ where: { id: identityId }, include: { store: true }}) : null;
            const store = identity?.store || null;

            // 5. Full Pipeline Validation
            const engineResult = await this.validator.validate(normalized); // Simplified since Validator returns ValidationResult
            validationErrors = [...validationErrors, ...engineResult.errors];

            // 6. Deduplication
            const duplicateResult = await this.deduplicator.check(normalized, store?.id || undefined);

            // 7. Quality Engine
            const qualityMetrics = this.qualityEngine.evaluate(normalized);
            totalQuality += qualityMetrics.finalScore;

            // 8. Determine Status
            let status = "pending";
            if (duplicateResult.riskScore >= 90) {
              status = "duplicate";
              duplicates++;
            } else if (validationErrors.some(e => e.severity === "error")) {
              status = "rejected";
            } else {
              validRows++;
            }

            // 9. Persistence
            const importedOffer = await prisma.importedOffer.create({
              data: {
                importJobId: importJob.id,
                source: connector.id,
                sourceId: String(normalized.provenance.connectorOfferId || ""),
                rawData: rawData as any,
                normalizedData: normalized as any,
                
                rawDescription: normalized.rawDescription,
                cleanDescription: normalized.cleanDescription,
                markdownDescription: normalized.markdownDescription,
                connectorOfferId: normalized.provenance.connectorOfferId,
                connectorMerchantId: normalized.provenance.connectorMerchantId,
                connectorFetchedAt: normalized.provenance.connectorFetchedAt,
                connectorPayload: normalized.provenance.connectorPayload,
                
                completenessScore: qualityMetrics.completeness,
                validationScore: qualityMetrics.validation,
                confidenceScore: qualityMetrics.confidence,
                freshnessScore: qualityMetrics.freshness,
                merchantMatchScore: qualityMetrics.merchantMatch,
                duplicateRisk: qualityMetrics.duplicateRisk,
                finalQualityScore: qualityMetrics.finalScore,
                
                resolvedStoreId: identityId, // Mapping to identityId for backward compat with ImportedOffer schema
                suggestedStoreId: suggestedIdentityId,
                resolutionReason: resolution.reason,
                resolutionSource: resolution.resolutionSource,
                resolutionConfidence: resolution.signals,
                
                validationErrors: validationErrors as any,
                status
              }
            });

            // 10. Auto Publish Policy Check
            if (publish && status === "pending" && identityId) {
              const shouldAutoPublish = evaluateAutoPublish(
                qualityMetrics.finalScore,
                connector.id,
                duplicateResult.riskScore
              );

              if (shouldAutoPublish) {
                await this.publishService.publish(importedOffer.id, {
                  actorType: "SYSTEM",
                  merchantIdentityId: identityId
                });
                autoPublishedCount++;
              }
            }

          } catch (rowError) {
            childLogger.error({ err: rowError, row: totalRows }, "Row failed in pipeline");
          }
        }
      }

      const processingTimeMs = Date.now() - startTime;
      const avgQuality = totalRows > 0 ? (totalQuality / totalRows) : 0;
      
      let expiredOffers = 0;
      // 10.5 Dead Offer Detection
      if (!connector.manifest?.supportsIncrementalSync && publish && seenOfferIds.size > 0) {
          const expiredResult = await prisma.importedOffer.updateMany({
              where: {
                  source: connector.id,
                  status: { notIn: ["EXPIRED", "REJECTED"] }, // Don't re-expire rejected
                  sourceId: { notIn: Array.from(seenOfferIds) }
              },
              data: { status: "EXPIRED" }
          });
          expiredOffers = expiredResult.count;
          childLogger.info({ expiredOffers }, "Dead Offer Detection completed");
      }

      // 11. Finalize Job
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
          apiLatencyMs: processingTimeMs
        }
      });

      await prisma.connectorRun.update({
        where: { id: connectorRun.id },
        data: {
          status: "COMPLETED",
          finishedAt: new Date(),
          rows: totalRows,
          published: autoPublishedCount,
          duplicates,
          latency: processingTimeMs
        }
      });

      // 12. Notify
      await notificationEngine.notify({
        title: `Import Completed: ${connector.name || connector.sourceId}`,
        message: `Processed ${totalRows} rows. ${autoPublishedCount} auto-published. Avg Quality: ${avgQuality.toFixed(1)}`,
        level: "SUCCESS",
        source: "import-engine",
        link: `/admin/import-jobs/${importJob.id}`
      });

    } catch (error) {
      childLogger.error({ err: error }, "Import Pipeline Failed");
      
      const updateData = {
        status: "FAILED",
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
        totalRows,
        recordsFetched: totalRows,
        pagesFetched,
        validRows,
        processingTimeMs: Date.now() - startTime
      };

      await prisma.importJob.update({
        where: { id: importJob.id },
        data: updateData
      });

      await prisma.connectorRun.update({
        where: { id: connectorRun.id },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          rows: totalRows,
          published: autoPublishedCount,
          duplicates,
          latency: Date.now() - startTime
        }
      });

      await notificationEngine.notify({
        title: `Import Failed: ${connector.id}`,
        message: error instanceof Error ? error.message : "Unknown error",
        level: "ERROR",
        source: "import-engine",
        link: `/admin/import-jobs/${importJob.id}`
      });
    }

    return importJob.id;
  }
}
