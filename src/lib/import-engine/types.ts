/**
 * Represents the structured validation error object.
 */
export interface ValidationError {
  field: string;
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
}

/**
 * Detailed components of the quality score.
 */
export interface QualityMetrics {
  completeness: number; // 0-100
  validation: number; // 0-100
  confidence: number; // 0-100
  freshness: number; // 0-100
  merchantMatch: number; // 0-100
  duplicateRisk: number; // 0-100
  finalScore: number; // 0-100
}

export interface QualityRule {
  id: string;
  name: string;
  description: string;
  evaluate(offer: NormalizedOffer): Partial<QualityMetrics>;
}

export interface EnrichmentHook {
  id: string;
  name: string;
  execute(offer: NormalizedOffer): Promise<NormalizedOffer>;
}

export interface ConnectorConfig {
  requestsPerMinute: number;
  burst: number;
  concurrency: number;
  timeoutMs: number;
}

export interface ConnectorManifest {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  supportsWebhooks: boolean;
  supportsPagination: boolean;
  supportsIncrementalSync: boolean;
  rateLimit: number;
  trustLevel: number; // 0-100
}

export interface ConnectorHealth {
  rowsFetched: number;
  rowsValidated: number;
  rowsPublished: number;
  duplicates: number;
  candidates: number;
  averageQuality: number;
  averageResponseTimeMs: number;
  failures: number;
  retryCount: number;
  lastSuccessfulRun?: Date;
  successRate: number; // 0-100
}

export type RawOffer = Record<string, any>;

export interface ValidationScoreDetails {
  merchant: number;
  affiliateUrl: number;
  destinationUrl: number;
  expiry: number;
  duplicate: number;
  couponQuality: number;
  title: number;
  discount: number;
  trackingParams: number;
  https: number;
  httpStatus: number;
}

export interface ValidationResult {
  errors: ValidationError[];
  scores: ValidationScoreDetails;
  overallScore: number;
}

export interface OfferProvenance {
  connector: string;
  connectorVersion: string;
  normalizerVersion?: string;
  connectorOfferId?: string;
  connectorMerchantId?: string;
  connectorFetchedAt: Date;
  connectorPayload: RawOffer;
}

/**
 * The canonical, minimalistic schema for all imported offers.
 */
export interface NormalizedOffer {
  merchantName: string;
  title: string;
  
  description?: string;
  rawDescription?: string;
  cleanDescription?: string;
  markdownDescription?: string;
  
  code?: string;
  destinationUrl: string;
  affiliateUrl: string;
  discountType: "percentage" | "flat" | "freebie";
  discountValue?: string;
  expiry?: Date;
  category?: string;
  
  qualityScore?: number;
  provenance: OfferProvenance;
}

/**
 * Interface for all affiliate connectors.
 */
export interface AffiliateConnector {
  id: string;
  version: string;
  config: ConnectorConfig;
  manifest: ConnectorManifest;

  authenticate(): Promise<void>;
  
  fetch(cursor?: string, since?: Date): AsyncGenerator<RawOffer>;
  
  normalize(raw: RawOffer): Promise<NormalizedOffer>;
  
  validate(offer: NormalizedOffer): ValidationResult;
  
  enrich?(offer: NormalizedOffer): Promise<NormalizedOffer>;
  
  health(): Promise<ConnectorHealth>;
}
