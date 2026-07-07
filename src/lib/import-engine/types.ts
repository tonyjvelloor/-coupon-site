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

/**
 * The canonical, minimalistic schema for all imported offers.
 * This represents exactly what the core platform needs, entirely isolated from SEO fields.
 */
export interface NormalizedOffer {
  merchantName: string;
  title: string;
  description?: string;
  code?: string;
  destinationUrl: string;
  affiliateUrl: string;
  discountType: "percentage" | "flat" | "freebie";
  discountValue?: string;
  expiry?: Date;
  category?: string;
  source: string;
  externalId?: string; // External network ID to prevent duplicates
}

/**
 * Defines what a connector is capable of providing.
 */
export type ConnectorCapability = 
  | "coupons" 
  | "deals" 
  | "products" 
  | "merchantMetadata" 
  | "commissionData";

/**
 * Interface for all affiliate connectors.
 * Connectors strictly translate external sources into NormalizedOffers.
 */
export interface AffiliateConnector {
  /**
   * Identifies the connector internally (e.g., 'impact')
   */
  readonly sourceId: string;

  /**
   * Display name for the connector (e.g., "Impact Radius")
   */
  readonly name: string;

  /**
   * What this connector can provide to the pipeline
   */
  readonly capabilities: ConnectorCapability[];

  /**
   * Version of the connector plugin implementation (e.g. "1.0.0")
   */
  readonly connectorVersion: string;

  /**
   * Version of the external API this connector targets (e.g. "REST v1")
   */
  readonly apiVersion: string;

  /**
   * Hook to initialize connections (e.g., login, setup API clients)
   */
  connect(): Promise<void>;

  /**
   * Fetch raw data from the external network/file
   */
  fetch(): AsyncGenerator<any, void, unknown>;

  /**
   * Translate a single piece of raw data into the Canonical model
   */
  normalize(rawData: any): NormalizedOffer;

  /**
   * Validate the raw payload for basic sanity checks prior to full pipeline validation
   */
  validate(normalized: NormalizedOffer): ValidationError[];

  /**
   * Cleanup hook (e.g., close connections, destroy API clients)
   */
  disconnect(): Promise<void>;
}
