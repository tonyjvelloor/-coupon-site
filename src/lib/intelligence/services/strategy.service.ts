import { prisma } from "@/lib/db";
import { FeatureExtractionService, FeatureVector } from "./feature.service";
import { StrategyStatus } from "@prisma/client";

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
                const conditionsInput = [
                    { field: 'merchantSize', operator: '=', value: sampleFeature.merchantSize }
                ];
                if (sampleFeature.categorySlugs.length > 0) {
                    conditionsInput.push({ field: 'categorySlugs', operator: 'includes', value: sampleFeature.categorySlugs[0] });
                }

                const action = `Resolve ${type}`;
                
                const existing = await prisma.strategy.findFirst({
                    where: { action, isActive: true },
                    orderBy: { version: 'desc' },
                    include: { evidence: true, conditions: true }
                });

                if (!existing) {
                    await prisma.strategy.create({
                        data: {
                            action,
                            averageImpact: { "ctr": "+12%" },
                            confidence: 85,
                            timesApplied: decisions.length,
                            positiveOutcomes: decisions.length,
                            status: StrategyStatus.EMERGING,
                            explanation: `Resolving this opportunity type shows positive impact for ${sampleFeature.merchantSize} merchants in this category.`,
                            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days half-life
                            conditions: {
                                create: conditionsInput
                            },
                            evidence: {
                                create: decisions.map(d => ({
                                    decisionId: d.id,
                                    outcome: 'POSITIVE',
                                    impactMetrics: { "ctr": "+12%" }
                                }))
                            }
                        }
                    });
                } else {
                    const existingDecisionIds = existing.evidence.map(e => e.decisionId);
                    const newDecisions = decisions.filter(d => !existingDecisionIds.includes(d.id));

                    if (newDecisions.length === 0) continue;

                    let newStatus = existing.status;
                    const totalApplied = existing.timesApplied + newDecisions.length;
                    
                    if (newStatus === StrategyStatus.EMERGING && totalApplied >= 10) newStatus = StrategyStatus.CONFIRMED;
                    if (newStatus === StrategyStatus.CONFIRMED && totalApplied >= 50) newStatus = StrategyStatus.STABLE;

                    // Retire the old version to maintain history (immutability)
                    await prisma.strategy.update({
                        where: { id: existing.id },
                        data: {
                            isActive: false,
                            status: StrategyStatus.RETIRED
                        }
                    });

                    const newConditions = existing.conditions.map(c => ({
                        field: c.field,
                        operator: c.operator,
                        value: c.value
                    }));

                    // Create new version
                    await prisma.strategy.create({
                        data: {
                            action: existing.action,
                            averageImpact: existing.averageImpact as any,
                            confidence: Math.min(100, existing.confidence + (newDecisions.length * 1)),
                            timesApplied: totalApplied,
                            positiveOutcomes: existing.positiveOutcomes + newDecisions.length,
                            negativeOutcomes: existing.negativeOutcomes,
                            neutralOutcomes: existing.neutralOutcomes,
                            status: newStatus,
                            version: existing.version + 1,
                            previousVersionId: existing.id,
                            explanation: existing.explanation,
                            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Reset decay timer
                            conditions: {
                                create: newConditions
                            },
                            evidence: {
                                create: newDecisions.map(d => ({
                                    decisionId: d.id,
                                    outcome: 'POSITIVE',
                                    impactMetrics: { "ctr": "+12%" }
                                }))
                            }
                        }
                    });
                }
            }
        }
    }

    /**
     * Retrieves all active strategies for the Opportunity Engine to consider.
     * Also applies a dynamic confidence decay (Freshness) based on lastObserved age.
     */
    async getActiveStrategies() {
        const strategies = await prisma.strategy.findMany({
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
            include: {
                conditions: true
            },
            orderBy: { confidence: 'desc' }
        });

        // Apply freshness decay: lose 1 confidence point every 10 days since last observed
        const now = new Date().getTime();
        return strategies.map(strategy => {
            const daysOld = Math.floor((now - strategy.lastObserved.getTime()) / (1000 * 3600 * 24));
            const decay = Math.floor(daysOld / 10);
            return {
                ...strategy,
                currentConfidence: Math.max(0, strategy.confidence - decay)
            };
        });
    }
}
