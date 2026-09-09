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
        let freshness = 50;
        if (daysToExpiry < 3) freshness = 100;
        else if (daysToExpiry < 14) freshness = 90;
        else if (daysToExpiry < 60) freshness = 80;
        else if (daysToExpiry < 180) freshness = 70;
        
        return { freshness };
    }
}
