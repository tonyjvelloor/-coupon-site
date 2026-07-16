import { AffiliateConnector, ConnectorCapability, ConnectorConfig, ConnectorManifest, ConnectorHealth, NormalizedOffer, ValidationError } from "../../types";
import { CJClient } from "./client";
import { CJMapper } from "./mapper";

export class CJConnector implements AffiliateConnector {
  public readonly id = "cj";
  public readonly version = "1.0.0";
  
  public config: ConnectorConfig = {
    requestsPerMinute: 60,
    burst: 10,
    concurrency: 1,
    timeoutMs: 30000
  };

  public manifest: ConnectorManifest = {
    id: "cj",
    name: "CJ Affiliate",
    version: "1.0.0",
    capabilities: ["coupons"],
    supportsWebhooks: false,
    supportsPagination: true,
    supportsIncrementalSync: false, // CJ v2 API has limited timestamp filters, currently doing full fetch or limited pages
    rateLimit: 60,
    trustLevel: 90
  };

  private client: CJClient;
  private websiteId: string;

  // Health metrics
  private healthStats: ConnectorHealth = {
    rowsFetched: 0,
    rowsValidated: 0,
    rowsPublished: 0,
    duplicates: 0,
    candidates: 0,
    averageQuality: 0,
    averageResponseTimeMs: 0,
    failures: 0,
    retryCount: 0,
    successRate: 100
  };

  constructor(isDev?: boolean) {
    this.client = new CJClient();
    // In dev mode, we could potentially inject a mock client, but we will leave the client as-is.
    this.client = new CJClient();
    this.websiteId = process.env.CJ_WEBSITE_ID || "";
  }

  async authenticate(): Promise<void> {
    if (!this.websiteId) {
      throw new Error("CJ_WEBSITE_ID is missing from environment variables.");
    }
    // We can do a lightweight test fetch to ensure auth works
    // But to save rate limits, we'll assume it works and fail during fetch if needed.
    return Promise.resolve();
  }

  async *fetch(cursor?: string, since?: Date): AsyncGenerator<any, void, unknown> {
    let page = cursor ? parseInt(cursor, 10) : 1;
    let hasMore = true;
    const recordsPerPage = 100;

    while (hasMore) {
      const startTime = Date.now();
      try {
        const payload = await this.client.fetchLinks(this.websiteId, page, recordsPerPage);
        
        // CJ API often nests links deeply depending on JSON/XML representation
        // Handle both CJ API representations
        const linksContainer = payload?.["cj-api"]?.links || payload?.links;
        let records = linksContainer?.link || [];
        
        if (!Array.isArray(records)) {
          // Sometimes if there's only 1 record, it might be an object instead of array (XML parsing quirk)
          records = records ? [records] : [];
        }

        this.healthStats.rowsFetched += records.length;
        this.healthStats.averageResponseTimeMs = (this.healthStats.averageResponseTimeMs + (Date.now() - startTime)) / 2;

        for (const record of records) {
          // Append raw payload and metadata for provenance tracking
          yield {
            ...record,
            _metadata: {
              apiVersion: "REST v2",
              requestTimestamp: new Date(startTime).toISOString(),
              responseTimestamp: new Date().toISOString(),
              page,
            }
          };
        }

        // Determine pagination
        // Depending on XML or JSON, total-matched might be an attribute or property
        const totalMatched = parseInt(linksContainer?.["$"]?.["total-matched"] || linksContainer?.["total-matched"] || "0", 10);
        const recordsReturned = parseInt(linksContainer?.["$"]?.["records-returned"] || linksContainer?.["records-returned"] || records.length.toString(), 10);
        
        if (recordsReturned === 0 || (page * recordsPerPage) >= totalMatched) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (error) {
        this.healthStats.failures++;
        this.healthStats.successRate = ((this.healthStats.rowsFetched) / (this.healthStats.rowsFetched + this.healthStats.failures)) * 100;
        throw error; // Re-throw to let pipeline handle it
      }
    }
    
    this.healthStats.lastSuccessfulRun = new Date();
  }

  async normalize(rawData: any): Promise<NormalizedOffer> {
    return CJMapper.toCanonical(rawData);
  }

  validate(normalized: NormalizedOffer): { errors: ValidationError[], scores: any, overallScore: number } {
    const errors: ValidationError[] = [];
    if (!normalized.title) {
      errors.push({ field: "title", code: "MISSING_TITLE", message: "CJ offer missing title", severity: "error" });
    }
    if (!normalized.destinationUrl) {
      errors.push({ field: "destinationUrl", code: "MISSING_URL", message: "CJ offer missing destinationUrl", severity: "error" });
    }
    
    // In actual implementation, quality-engine handles extensive validation. 
    // This provides a base connector-level check.
    return {
      errors,
      scores: { merchant: 1, affiliateUrl: 1, destinationUrl: 1, expiry: 1, duplicate: 1, couponQuality: 1, title: 1, discount: 1, trackingParams: 1, https: 1, httpStatus: 1 },
      overallScore: errors.length === 0 ? 100 : 0
    };
  }

  async health(): Promise<ConnectorHealth> {
    return this.healthStats;
  }
}
