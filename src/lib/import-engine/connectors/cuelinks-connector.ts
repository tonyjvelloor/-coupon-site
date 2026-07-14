import { AffiliateConnector, ConnectorCapability, NormalizedOffer, ValidationError } from "../types";
import { CuelinksService } from "../../affiliate/cuelinks.service";

export class CuelinksConnector implements AffiliateConnector {
    readonly sourceId = "cuelinks";
    readonly name = "Cuelinks Network";
    readonly capabilities: ConnectorCapability[] = ["coupons", "deals"];
    readonly connectorVersion = "1.0.0";
    readonly apiVersion = "v3";

    private service: CuelinksService;

    constructor() {
        this.service = new CuelinksService();
    }

    async connect(): Promise<void> {
        // Just verify connection by pinging
        await this.service.ping();
    }

    async *fetch(): AsyncGenerator<any, void, unknown> {
        const limit = 50;
        // In a full implementation, this might handle pagination.
        // For now, we fetch the top recent offers.
        const offers = await this.service.getOffers(limit);
        for (const offer of offers) {
            yield offer;
        }
    }

    normalize(rawData: any): NormalizedOffer {
        let discountType: "percentage" | "flat" | "freebie" = "flat";
        let discountValue = rawData.discount_price ? String(rawData.discount_price) : undefined;
        
        if (rawData.percent_off) {
            discountType = "percentage";
            discountValue = String(rawData.percent_off);
        } else if (rawData.offer_type === "freebie" || rawData.title?.toLowerCase().includes("free")) {
            discountType = "freebie";
        }

        const category = rawData.categories && rawData.categories.length > 0 
            ? rawData.categories[0].name 
            : undefined;

        return {
            merchantName: rawData.campaign_name || "Unknown",
            title: rawData.title,
            description: rawData.description,
            code: rawData.coupon_code || undefined,
            // Assuming the tracking URL eventually redirects to the merchant
            destinationUrl: rawData.tracking_url || "", 
            affiliateUrl: rawData.tracking_url,
            discountType,
            discountValue,
            expiry: rawData.end_date ? new Date(rawData.end_date) : undefined,
            category,
            source: this.sourceId,
            externalId: String(rawData.id)
        };
    }

    validate(normalized: NormalizedOffer): ValidationError[] {
        const errors: ValidationError[] = [];

        if (!normalized.merchantName || normalized.merchantName === "Unknown") {
            errors.push({
                field: "merchantName",
                severity: "error",
                code: "CUELINKS_MISSING_MERCHANT",
                message: "Missing campaign/merchant name"
            });
        }
        
        if (!normalized.affiliateUrl) {
            errors.push({
                field: "affiliateUrl",
                severity: "error",
                code: "CUELINKS_MISSING_URL",
                message: "Missing tracking URL"
            });
        }

        return errors;
    }

    async disconnect(): Promise<void> {
        // Nothing to disconnect
    }
}
