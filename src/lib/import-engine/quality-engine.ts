import { NormalizedOffer, QualityMetrics, QualityRule } from "./types";
import { CompletenessRule } from "./rules/completeness.rule";
import { FreshnessRule } from "./rules/freshness.rule";

export class QualityEngine {
    private rules: QualityRule[] = [];

    constructor() {
        // Register default rule packs
        this.registerRule(new CompletenessRule());
        this.registerRule(new FreshnessRule());
    }

    registerRule(rule: QualityRule) {
        this.rules.push(rule);
    }

    /**
     * Calculates a 0-100 quality score for a normalized offer by running all registered rules.
     */
    evaluate(offer: NormalizedOffer): QualityMetrics {
        const metrics: QualityMetrics = {
            completeness: 0,
            validation: 100,
            confidence: 100,
            freshness: 0,
            merchantMatch: 100,
            duplicateRisk: 0,
            finalScore: 0
        };

        // Execute all rules
        for (const rule of this.rules) {
            const result = rule.evaluate(offer);
            Object.assign(metrics, result);
        }
        
        // Base weights calculation
        let finalScore = (metrics.completeness * 0.4) + (metrics.freshness * 0.6);
        metrics.finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

        return metrics;
    }
}
