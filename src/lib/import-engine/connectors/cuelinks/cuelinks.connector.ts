import { AffiliateConnector, ConnectorConfig, ConnectorManifest, ConnectorHealth, NormalizedOffer, RawOffer, ValidationResult, ValidationError } from "../../types";
import { CuelinksService } from "../../../affiliate/cuelinks.service";

export class CuelinksConnector implements AffiliateConnector {
    readonly id = "cuelinks";
    readonly version = "1.0.0";
    readonly config: ConnectorConfig = {
        requestsPerMinute: 60,
        burst: 10,
        concurrency: 2,
        timeoutMs: 10000
    };
    readonly manifest: ConnectorManifest = {
        id: "cuelinks",
        name: "Cuelinks Network",
        version: "1.0.0",
        capabilities: ["coupons", "deals"],
        supportsWebhooks: false,
        supportsPagination: true,
        supportsIncrementalSync: false,
        rateLimit: 60,
        trustLevel: 95
    };

    private service: CuelinksService;
    private rowsFetched = 0;
    private failures = 0;
    private startTime = 0;

    constructor() {
        this.service = new CuelinksService();
    }

    async authenticate(): Promise<void> {
        await this.service.ping();
        this.startTime = Date.now();
    }

    async *fetch(cursor?: string, since?: Date): AsyncGenerator<RawOffer> {
        const limit = 50;
        try {
            const offers = await this.service.getOffers(limit);
            for (const offer of offers) {
                this.rowsFetched++;
                yield offer;
            }
        } catch (err) {
            this.failures++;
            throw err;
        }
    }

    async normalize(raw: RawOffer): Promise<NormalizedOffer> {
        let discountType: "percentage" | "flat" | "freebie" = "flat";
        let discountValue = raw.discount_price ? String(raw.discount_price) : undefined;
        
        if (raw.percent_off) {
            discountType = "percentage";
            discountValue = String(raw.percent_off);
        } else if (raw.offer_type === "freebie" || raw.title?.toLowerCase().includes("free")) {
            discountType = "freebie";
        }

        const category = raw.categories && raw.categories.length > 0 
            ? raw.categories[0].name 
            : undefined;

        return {
            merchantName: raw.campaign_name || "Unknown",
            title: raw.title,
            description: raw.description,
            code: raw.coupon_code || undefined,
            destinationUrl: raw.tracking_url || "", 
            affiliateUrl: raw.tracking_url || "",
            discountType,
            discountValue,
            expiry: raw.end_date ? new Date(raw.end_date) : undefined,
            category,
            provenance: {
                connector: this.id,
                connectorVersion: this.version,
                normalizerVersion: "1.0.0",
                connectorOfferId: String(raw.id || ""),
                connectorMerchantId: String(raw.campaign_id || ""),
                connectorFetchedAt: new Date(),
                connectorPayload: raw
            }
        };
    }

    validate(offer: NormalizedOffer): ValidationResult {
        const errors: ValidationError[] = [];
        const scores = {
            merchant: 100, affiliateUrl: 100, destinationUrl: 100, expiry: 100,
            duplicate: 100, couponQuality: 100, title: 100, discount: 100,
            trackingParams: 100, https: 100, httpStatus: 100
        };

        if (!offer.merchantName || offer.merchantName === "Unknown") {
            errors.push({ field: "merchantName", severity: "error", code: "CUELINKS_MISSING_MERCHANT", message: "Missing campaign/merchant name" });
            scores.merchant = 0;
        }
        
        if (!offer.affiliateUrl) {
            errors.push({ field: "affiliateUrl", severity: "error", code: "CUELINKS_MISSING_URL", message: "Missing tracking URL" });
            scores.affiliateUrl = 0;
        }

        if (!offer.title) {
            scores.title = 0;
        }

        const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

        return { errors, scores, overallScore };
    }

    async health(): Promise<ConnectorHealth> {
        const duration = Date.now() - this.startTime;
        return {
            rowsFetched: this.rowsFetched,
            rowsValidated: 0,
            rowsPublished: 0,
            duplicates: 0,
            candidates: 0,
            averageQuality: 0,
            averageResponseTimeMs: this.rowsFetched > 0 ? duration / this.rowsFetched : 0,
            failures: this.failures,
            retryCount: 0,
            lastSuccessfulRun: new Date(),
            successRate: 100
        };
    }
}
