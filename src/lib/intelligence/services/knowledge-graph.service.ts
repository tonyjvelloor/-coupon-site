import { prisma } from "@/lib/db";
import { NodeType, EdgeType, KnowledgeNode, KnowledgeEdge } from "@prisma/client";

export class KnowledgeGraphService {
    
    /**
     * Creates or updates a Knowledge Node
     */
    async addNode(data: {
        type: NodeType;
        name: string;
        entityId?: string;
        metadata?: any;
        source?: string;
        confidence?: number;
    }): Promise<KnowledgeNode> {
        if (data.entityId) {
            const existing = await prisma.knowledgeNode.findFirst({
                where: { type: data.type, entityId: data.entityId }
            });
            
            if (existing) {
                return prisma.knowledgeNode.update({
                    where: { id: existing.id },
                    data: {
                        name: data.name,
                        metadata: data.metadata,
                        source: data.source,
                        confidence: data.confidence,
                        verifiedAt: new Date(),
                    }
                });
            }
        }
        
        return prisma.knowledgeNode.create({
            data: {
                ...data,
                metadata: data.metadata ?? {},
                verifiedAt: new Date(),
            }
        });
    }

    /**
     * Creates a directed edge between two nodes with versioning
     */
    async addEdge(data: {
        sourceId: string;
        targetId: string;
        type: EdgeType;
        weight?: number;
        metadata?: any;
        source?: string;
        confidence?: number;
    }): Promise<KnowledgeEdge> {
        const existing = await prisma.knowledgeEdge.findUnique({
            where: {
                sourceId_targetId_type: {
                    sourceId: data.sourceId,
                    targetId: data.targetId,
                    type: data.type
                }
            }
        });

        if (existing) {
            return prisma.knowledgeEdge.update({
                where: { id: existing.id },
                data: {
                    weight: data.weight ?? 1.0,
                    metadata: data.metadata ?? {},
                    source: data.source,
                    confidence: data.confidence,
                    effectiveFrom: new Date(),
                }
            });
        }

        return prisma.knowledgeEdge.create({
            data: {
                ...data,
                metadata: data.metadata ?? {},
                weight: data.weight ?? 1.0,
                effectiveFrom: new Date(),
            }
        });
    }

    /**
     * Retrieves neighbors of a specific node
     */
    async neighbors(nodeId: string, edgeType?: EdgeType) {
        const edges = await prisma.knowledgeEdge.findMany({
            where: {
                sourceId: nodeId,
                ...(edgeType && { type: edgeType }),
                effectiveFrom: { lte: new Date() },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gt: new Date() } }
                ]
            },
            include: { target: true }
        });
        
        return edges.map(e => ({ edge: e, node: e.target }));
    }

    /**
     * Traverses the graph to build the Decision Graph for a Merchant
     */
    async traverseMerchantGraph(merchantNodeId: string) {
        const categories = await this.neighbors(merchantNodeId, "HAS_CATEGORY");
        const brands = await this.neighbors(merchantNodeId, "SELLS");
        const policies = await this.neighbors(merchantNodeId, "HAS_POLICY");
        const events = await this.neighbors(merchantNodeId, "HAS_EVENT");
        const banks = await this.neighbors(merchantNodeId, "HAS_BANK");
        const guides = await this.neighbors(merchantNodeId, "HAS_GUIDE");

        return {
            explore: [...categories, ...brands],
            trustAndPolicies: policies,
            whatsNew: events,
            continueShopping: [...banks, ...guides]
        };
    }

    /**
     * Computes the deterministic health score of a merchant
     */
    async scoreMerchant(merchantId: string): Promise<{
        freshness: number;
        coverage: number;
        trust: number;
        content: number;
        offers: number;
        total: number;
    }> {
        const store = await prisma.store.findUnique({ where: { id: merchantId } });
        if (!store) throw new Error("Store not found");
        
        const offers = Math.min(store.activeOfferCount * 2, 20);
        const freshness = store.lastImportedAt ? 20 : 0; 
        
        const merchantNode = await prisma.knowledgeNode.findFirst({
            where: { type: "MERCHANT", entityId: merchantId }
        });
        
        let content = 0;
        let coverage = 0;
        let trust = 10; 

        if (merchantNode) {
            const guides = await prisma.knowledgeEdge.count({
                where: { sourceId: merchantNode.id, type: "HAS_GUIDE" }
            });
            content = Math.min(guides * 5, 20);

            const categories = await prisma.knowledgeEdge.count({
                where: { sourceId: merchantNode.id, type: "HAS_CATEGORY" }
            });
            coverage = Math.min(categories * 2, 20);
            
            const policies = await prisma.knowledgeEdge.count({
                where: { sourceId: merchantNode.id, type: "HAS_POLICY" }
            });
            trust += Math.min(policies * 5, 20);
        }

        const total = freshness + coverage + trust + content + offers;

        await prisma.store.update({
            where: { id: merchantId },
            data: {
                healthScore: { freshness, coverage, trust, content, offers, total } as any,
                knowledgeDensity: (content / 5) + (coverage / 2) + ((trust - 10) / 5)
            }
        });

        return { freshness, coverage, trust, content, offers, total };
    }
}
