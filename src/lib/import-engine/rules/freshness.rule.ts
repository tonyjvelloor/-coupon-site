import { QualityRule, NormalizedOffer, QualityMetrics } from "../types";

export class FreshnessRule implements QualityRule {
    id = "freshness-rule";
    name = "Freshness Scorer";
    description = "Calculates freshness based on expiry date proximity";

    evaluate(offer: NormalizedOffer): Partial<QualityMetrics> {
        if (!offer.expiry) return { freshness: 50 };
        
        const now = new Date();
        const expiry = new Date(offer.expiry);
        
        if (expiry < now) return { freshness: 0 }; 
        
        const daysToExpiry = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
        let freshness = 40;
        if (daysToExpiry < 3) freshness = 100;
        else if (daysToExpiry < 14) freshness = 80;
        else if (daysToExpiry < 30) freshness = 60;
        
        return { freshness };
    }
}
