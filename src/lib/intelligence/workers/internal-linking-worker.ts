import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class InternalLinkingWorker implements IntelligenceWorker {
  name = "internal-linking-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.MERCHANT_UPDATED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Store") throw new Error("InternalLinkingWorker primarily processes Stores for now");

    const store = await prisma.store.findUnique({
      where: { id: entityId },
      include: {
        storeCategories: { include: { category: true } }
      }
    });

    if (!store) throw new Error("Store not found");

    const inputSnapshot = {
      storeName: store.name,
      categories: store.storeCategories.map(sc => sc.category.name),
      offerCount: store.activeOfferCount
    };

    const prompt = `Propose top 5 related merchants and top 3 categories to link from ${store.name}'s page.`;
    const response = await llmProvider.generate<any>(
      "internal-linking-v1",
      prompt,
      {}
    );

    const proposal: WorkerProposal = {
      confidence: response.data.confidence || 0.85,
      reasoning: response.data.reasoning || `Linked based on shared category overlaps.`,
      warnings: response.data.warnings || [],
      data: {
        relatedStoreSlugs: ["amazon", "flipkart"], // mock
        relatedCategorySlugs: ["electronics", "fashion"] // mock
      }
    };

    return {
      inputSnapshot,
      proposal,
      promptVersion: response.promptVersion,
      model: response.model,
      settings: response.settings
    };
  }
}
