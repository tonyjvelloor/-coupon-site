import { prisma } from "@/lib/db";
import { KnowledgeGraphService } from "../services/knowledge-graph.service";
import { OpportunityType, OpportunityStatus } from "@prisma/client";

const kgService = new KnowledgeGraphService();

export class OpportunityWorker {
    /**
     * AI reasons over the knowledge graph and generates business hypotheses (Opportunities)
     */
    async evaluateMerchant(merchantId: string) {
        // 1. The Platform computes deterministic metrics
        const score = await kgService.scoreMerchant(merchantId);
        
        // 2. The Platform pulls the Graph Snapshot
        const merchantNode = await prisma.knowledgeNode.findFirst({
            where: { type: "MERCHANT", entityId: merchantId }
        });
        
        if (!merchantNode) return [];
        
        const edges = await prisma.knowledgeEdge.findMany({
            where: { sourceId: merchantNode.id },
            include: { target: true }
        });

        // 3. AI Hypothesis Generation
        // In a production environment, this snapshot (score + edges) is passed to an LLM 
        // with strict JSON schema enforcing OpportunityType, confidence, priority, etc.
        // For demonstration, we simulate the AI's deterministic reasoning rules:
        
        const opportunities = [];

        // Hypothesis 1: Missing Basic Knowledge (FAQ)
        const hasFaq = edges.some(e => e.target.type === "FAQ");
        if (!hasFaq && score.offers > 10) {
            opportunities.push({
                type: "KNOWLEDGE" as OpportunityType,
                title: "Missing Merchant FAQ",
                description: `Merchant has high active offers (${score.offers}) but no FAQ. This hurts SEO impressions for transactional long-tail queries.`,
                priority: 85,
                trafficGain: "Medium",
                revenueImpact: "Medium",
                estimatedEffort: "Low",
                confidence: 90,
                recommendedAction: "Generate and publish an FAQ knowledge asset focused on shipping and returns.",
                dependencies: ["Shipping Data", "Return Policy"],
                targetEntityId: merchantId,
                nodeId: merchantNode.id
            });
        }

        // Hypothesis 2: Missing High-Converting Collections
        const hasStudentDiscount = edges.some(e => e.type === "HAS_FEATURE" && e.target.name === "Student Discount");
        if (!hasStudentDiscount) {
            opportunities.push({
                type: "REVENUE" as OpportunityType,
                title: "Missing Student Discount Coverage",
                description: "Student discount queries for this merchant have high conversion rates globally. Verify if a program exists.",
                priority: 70,
                trafficGain: "Medium",
                revenueImpact: "High",
                estimatedEffort: "Medium",
                confidence: 85,
                recommendedAction: "Research merchant's student program. If exists, create Student Discount Collection.",
                dependencies: ["Merchant Program Review"],
                targetEntityId: merchantId,
                nodeId: merchantNode.id
            });
        }

        // Hypothesis 3: Low Freshness
        if (score.freshness < 10) {
            opportunities.push({
                type: "FRESHNESS" as OpportunityType,
                title: "Stale Offer Data",
                description: "Merchant hasn't been imported recently. Risk of expired offers hurting user trust.",
                priority: 95,
                trafficGain: "Low",
                revenueImpact: "High",
                estimatedEffort: "Low",
                confidence: 99,
                recommendedAction: "Trigger an immediate prioritized sync for this merchant in the Import Engine.",
                dependencies: ["Import Connector"],
                targetEntityId: merchantId,
                nodeId: merchantNode.id
            });
        }

        // 4. The Platform Validates & Persists the Hypotheses
        for (const opp of opportunities) {
            const existing = await prisma.opportunity.findFirst({
                where: { 
                    targetEntityId: opp.targetEntityId,
                    title: opp.title,
                    status: { in: ["GENERATED", "TRIAGED", "APPROVED", "IN_PROGRESS"] }
                }
            });

            if (!existing) {
                await prisma.opportunity.create({
                    data: {
                        ...opp,
                        dependencies: opp.dependencies as any,
                        status: "GENERATED" as OpportunityStatus
                    }
                });
            }
        }
        
        return opportunities;
    }
}
