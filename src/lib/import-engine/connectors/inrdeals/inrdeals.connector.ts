import { AffiliateConnector, ConnectorConfig, ConnectorManifest, ConnectorHealth, NormalizedOffer, RawOffer, ValidationResult, ValidationError } from "../../types";
import { InrdealsService } from "./inrdeals.service";
import * as cheerio from "cheerio";

export class InrdealsConnector implements AffiliateConnector {
    readonly id = "inrdeals";
    readonly version = "1.0.0";
    readonly config: ConnectorConfig = {
        requestsPerMinute: 60,
        burst: 10,
        concurrency: 2,
        timeoutMs: 15000
    };
    readonly manifest: ConnectorManifest = {
        id: "inrdeals",
        name: "INRDeals",
        version: "1.0.0",
        capabilities: ["coupons", "stores", "tracking"],
        supportsWebhooks: false,
        supportsPagination: true,
        supportsIncrementalSync: false,
        rateLimit: 60,
        trustLevel: 94
    };

    private service: InrdealsService;

    // Health metrics
    private rowsFetched = 0;
    private failures = 0;
    private startTime: number = 0;

    constructor() {
        this.service = new InrdealsService();
    }

    async authenticate(): Promise<void> {
        await this.service.ping();
        this.startTime = Date.now();
    }

    async *fetch(cursor?: string, since?: Date): AsyncGenerator<RawOffer> {
        let currentPage = cursor ? parseInt(cursor, 10) : 1;
        let lastPage = currentPage;

        do {
            try {
                const result = await this.service.getCouponsFeed(currentPage);
                const data = result.data || [];
                lastPage = result.last_page || currentPage;

                for (const item of data) {
                    this.rowsFetched++;
                    yield item;
                }
                currentPage++;
            } catch (err) {
                this.failures++;
                throw err;
            }
        } while (currentPage <= lastPage);
    }

    private cleanDescription(html: string): string {
        if (!html || html === "0") return "";
        const $ = cheerio.load(html);
        return $.text().trim();
    }

    private parseDiscount(label: string, title: string): { type: "percentage" | "flat" | "freebie", value?: string } {
        const text = (label + " " + title).toLowerCase();
        
        const percentMatch = text.match(/(\d+)%/);
        if (percentMatch) {
            return { type: "percentage", value: percentMatch[1] };
        }

        const flatMatch = text.match(/(?:rs\.?|₹)\s*(\d+)/);
        if (flatMatch) {
            return { type: "flat", value: flatMatch[1] };
        }

        if (text.includes("free")) {
            return { type: "freebie" };
        }

        return { type: "flat" };
    }

    async normalize(raw: RawOffer): Promise<NormalizedOffer> {
        const rawDesc = raw.description === "0" ? undefined : raw.description;
        const cleanDesc = rawDesc ? this.cleanDescription(rawDesc) : undefined;
        const merchantName = raw.logo?.store_name || "Unknown";
        
        let code = raw.coupon_code;
        if (!code || code === "0" || code.trim() === "") {
            code = undefined;
        }

        const discount = this.parseDiscount(raw.label || "", raw.offer || "");

        return {
            merchantName,
            title: raw.offer || raw.label,
            
            description: cleanDesc,
            rawDescription: rawDesc,
            cleanDescription: cleanDesc,
            markdownDescription: cleanDesc, // Naive map, ideally convert HTML to Markdown
            
            code,
            destinationUrl: raw.url || "",
            affiliateUrl: raw.url || "",
            discountType: discount.type,
            discountValue: discount.value,
            expiry: raw.expire_date ? new Date(raw.expire_date) : undefined,
            category: raw.categories,
            
            provenance: {
                connector: this.id,
                connectorVersion: this.version,
                normalizerVersion: "1.0.0",
                connectorOfferId: String(raw.id || ""),
                connectorMerchantId: String(raw.storelogo_id || ""),
                connectorFetchedAt: new Date(),
                connectorPayload: raw
            }
        };
    }

    validate(offer: NormalizedOffer): ValidationResult {
        const errors: ValidationError[] = [];
        const scores = {
            merchant: 100,
            affiliateUrl: 100,
            destinationUrl: 100,
            expiry: 100,
            duplicate: 100,
            couponQuality: 100,
            title: 100,
            discount: 100,
            trackingParams: 100,
            https: 100,
            httpStatus: 100
        };

        if (!offer.merchantName || offer.merchantName === "Unknown") {
            errors.push({ field: "merchantName", severity: "error", code: "MISSING_MERCHANT", message: "Missing merchant name" });
            scores.merchant = 0;
        }

        if (!offer.affiliateUrl) {
            errors.push({ field: "affiliateUrl", severity: "error", code: "MISSING_URL", message: "Missing URL" });
            scores.affiliateUrl = 0;
        }

        if (!offer.title) {
            errors.push({ field: "title", severity: "error", code: "MISSING_TITLE", message: "Missing title" });
            scores.title = 0;
        }

        if (!offer.expiry) {
            scores.expiry = 0; // Warning, not necessarily error
        }

        if (!offer.discountValue && offer.discountType !== "freebie") {
            scores.discount = 0;
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
