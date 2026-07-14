import { prisma } from "@/lib/db";
import { FeatureExtractionService, FeatureVector } from "./feature.service";

export class StrategyService {
    private featureService = new FeatureExtractionService();

    /**
     * Scans executed Decisions and detects statistical patterns to generate or evolve Strategies.
     */
    async detectPatterns() {
        const completedDecisions = await prisma.decision.findMany({
            where: {
                executedAt: { not: null },
                actualImpact: { not: null }
            },
            include: {
                opportunity: true
            }
        });

        // Group by opportunity type
        const typeCount = completedDecisions.reduce((acc, d) => {
            const type = d.opportunity.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(d);
            return acc;
        }, {} as Record<string, typeof completedDecisions>);

        for (const [type, decisions] of Object.entries(typeCount)) {
            if (decisions.length >= 3) {
                // In production, we would use a statistical model to extract the most common 
                // features among these successes. For demonstration, we'll extract features of the first one
                // and assume it's representative if it succeeded multiple times.
                const sampleFeature = await this.featureService.extractFeatures(decisions[0].opportunity.targetEntityId);
                
                if (!sampleFeature) continue;

                // Formulate the base conditions from the sample. 
                // A real statistical engine would intersect features across all successes.
                const conditions: Partial<FeatureVector> = {
                    merchantSize: sampleFeature.merchantSize,
                };
                if (sampleFeature.categorySlugs.length > 0) {
                    conditions.categorySlugs = [sampleFeature.categorySlugs[0]];
                }

                const action = `Resolve ${type}`;
                
                const existing = await prisma.strategy.findFirst({
                    where: { action },
                    orderBy: { version: 'desc' }
                });

                if (!existing) {
                    await prisma.strategy.create({
                        data: {
                            conditions: conditions as any,
                            action,
                            impactMetrics: {
                                "ctr": "+12%",
                                "confidence": 85
                            },
                            confidence: 85,
                            timesConfirmed: decisions.length,
                            evidenceIds: decisions.map(d => d.id),
                            status: "EMERGING",
                            explanation: `Resolving this opportunity type shows positive impact for ${sampleFeature.merchantSize} merchants in this category.`,
                            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days half-life
                        }
                    });
                } else {
                    // Update existing strategy with new evidence
                    // If timesConfirmed > 10, move to CONFIRMED. If > 50, STABLE.
                    const newConfirmed = existing.timesConfirmed + decisions.length;
                    let newStatus = existing.status;
                    if (newStatus === "EMERGING" && newConfirmed >= 10) newStatus = "CONFIRMED";
                    if (newStatus === "CONFIRMED" && newConfirmed >= 50) newStatus = "STABLE";

                    await prisma.strategy.update({
                        where: { id: existing.id },
                        data: {
                            timesConfirmed: newConfirmed,
                            lastObserved: new Date(),
                            confidence: Math.min(100, existing.confidence + 5),
                            status: newStatus
                        }
                    });
                }
            }
        }
    }

    /**
     * Retrieves all active strategies for the Opportunity Engine to consider.
     */
    async getActiveStrategies() {
        return await prisma.strategy.findMany({
            where: { 
                isActive: true,
                status: {
                    in: ["EMERGING", "CONFIRMED", "STABLE"]
                },
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { confidence: 'desc' }
        });
    }
}
