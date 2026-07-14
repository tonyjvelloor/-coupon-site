import { prisma } from "@/lib/db";

export class LearningService {
    /**
     * Scans executed Decisions and generates Learning observations.
     * This acts as the offline "Pattern Detection" worker.
     */
    async generateLearnings() {
        const completedDecisions = await prisma.decision.findMany({
            where: {
                executedAt: { not: null },
                actualImpact: { not: null }
            },
            include: {
                opportunity: true
            }
        });

        // Group decisions by opportunity type to find recurring success patterns
        const typeCount = completedDecisions.reduce((acc, d) => {
            const type = d.opportunity.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(d);
            return acc;
        }, {} as Record<string, typeof completedDecisions>);

        for (const [type, decisions] of Object.entries(typeCount)) {
            if (decisions.length >= 3) {
                // If we've seen this succeed 3+ times, generate a structured Learning.
                // In production, this would use a statistical model or LLM to find common conditions (e.g. category, merchant size).
                const action = `Resolve ${type}`;
                
                const existing = await prisma.learning.findFirst({
                    where: { action }
                });

                if (!existing) {
                    await prisma.learning.create({
                        data: {
                            conditions: {
                                "opportunityType": type,
                                "minHealthScore": 80
                            },
                            action,
                            impactMetrics: {
                                "ctr": "+12%",
                                "confidence": 85
                            },
                            confidence: 85,
                            timesConfirmed: decisions.length,
                            evidenceIds: decisions.map(d => d.id),
                            isActive: true,
                            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days half-life
                        }
                    });
                } else {
                    // Update existing learning with new evidence
                    await prisma.learning.update({
                        where: { id: existing.id },
                        data: {
                            timesConfirmed: { increment: decisions.length },
                            lastObserved: new Date(),
                            confidence: Math.min(100, existing.confidence + 5)
                        }
                    });
                }
            }
        }
    }

    /**
     * Retrieves active, non-expired Knowledge Memory to feed into the Opportunity Engine.
     */
    async getActiveLearnings() {
        return await prisma.learning.findMany({
            where: { 
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { confidence: 'desc' }
        });
    }
}
