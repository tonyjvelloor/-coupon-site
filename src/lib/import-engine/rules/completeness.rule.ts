import { QualityRule, NormalizedOffer, QualityMetrics } from "../types";

export class CompletenessRule implements QualityRule {
    id = "completeness-rule";
    name = "Completeness Scorer";
    description = "Calculates completeness based on missing essential fields";

    evaluate(offer: NormalizedOffer): Partial<QualityMetrics> {
        let score = 0;
        let total = 6;
        
        if (offer.merchantName) score++;
        if (offer.title) score++;
        if (offer.description || offer.cleanDescription) score++;
        if (offer.discountValue || offer.discountType === "freebie") score++;
        if (offer.category) score++;
        if (offer.code) score++; 

        return {
            completeness: Math.round((score / total) * 100)
        };
    }
}
