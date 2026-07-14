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

        // Mock pattern detection for demonstration
        // Groups by opportunity type
        const typeCount = completedDecisions.reduce((acc, d) => {
            const type = d.opportunity.type;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        for (const [type, count] of Object.entries(typeCount)) {
            if (count >= 3) {
                // If we've seen this succeed 3 times, generate a Learning
                const existing = await prisma.learning.findFirst({
                    where: { pattern: { contains: type } }
                });

                if (!existing) {
                    await prisma.learning.create({
                        data: {
                            pattern: `Resolving ${type} opportunities consistently improves performance for this merchant cohort.`,
                            confidence: 85,
                            impact: "Positive trend identified",
                            evidence: completedDecisions.filter(d => d.opportunity.type === type).map(d => d.id),
                            isActive: true
                        }
                    });
                }
            }
        }
    }

    /**
     * Retrieves active Knowledge Memory to feed into the Opportunity Engine.
     */
    async getActiveLearnings() {
        return await prisma.learning.findMany({
            where: { isActive: true },
            orderBy: { confidence: 'desc' }
        });
    }
}
