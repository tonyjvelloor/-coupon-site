import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class BuyingGuideWorker implements IntelligenceWorker {
  name = "buying-guide-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.MERCHANT_UPDATED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Store") throw new Error("BuyingGuideWorker only processes Stores");

    const store = await prisma.store.findUnique({
      where: { id: entityId },
      include: {
        coupons: {
          take: 10,
          orderBy: { usageCount: 'desc' },
          select: { title: true, discountType: true }
        }
      }
    });

    if (!store) throw new Error("Store not found");

    const inputSnapshot = {
      storeName: store.name,
      description: store.description,
      topOffers: store.coupons.map(c => c.title)
    };

    const prompt = `Generate a detailed Markdown Buying Guide and savings tips for ${store.name}.`;
    const response = await llmProvider.generate<any>(
      "buying-guide-v1",
      prompt,
      {}
    );

    const proposal: WorkerProposal = {
      confidence: response.data.confidence || 0.88,
      reasoning: response.data.reasoning || `Generated based on store description and top historical offers.`,
      warnings: response.data.warnings || [],
      data: {
        storeContents: [
          { 
            type: 'BUYING_GUIDE', 
            content: `## How to Save at ${store.name}\n\n1. **Sign up for the newsletter**: Get 10% off your first order.\n2. **Wait for major sales**: The best deals happen during Black Friday.\n3. **Use Cashback**: Combine coupons with our cashback portal.`
          }
        ]
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
