import { NormalizedOffer, ValidationResult, ValidationError } from "./types";

export class OfferValidator {
    /**
     * Maps specific structural errors into the new ValidationResult interface.
     */
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

        if (!offer.merchantName) {
            errors.push({ field: "merchantName", severity: "error", code: "MISSING_MERCHANT", message: "Merchant name is missing" });
            scores.merchant = 0;
        }

        if (!offer.title) {
            errors.push({ field: "title", severity: "error", code: "MISSING_TITLE", message: "Title is missing" });
            scores.title = 0;
        }

        if (!offer.affiliateUrl && !offer.destinationUrl) {
            errors.push({ field: "url", severity: "error", code: "MISSING_URL", message: "Both affiliateUrl and destinationUrl are missing" });
            scores.affiliateUrl = 0;
            scores.destinationUrl = 0;
        }

        const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

        return { errors, scores, overallScore };
    }
}
