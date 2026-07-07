import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class MerchantWorker implements IntelligenceWorker {
  name = "merchant-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.MERCHANT_UPDATED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Store") throw new Error("MerchantWorker only processes Stores");

    const store = await prisma.store.findUnique({
      where: { id: entityId },
    });

    if (!store) throw new Error("Store not found");

    const inputSnapshot = {
      storeName: store.name,
      description: store.description,
      website: store.website
    };

    const prompt = `Generate aboutContent, faqContent, and shippingInfo for merchant: ${store.name}`;
    const response = await llmProvider.generate<any>(
      "merchant-enrichment-v1",
      prompt,
      {}
    );

    const proposal: WorkerProposal = {
      confidence: response.data.confidence,
      reasoning: response.data.reasoning,
      warnings: response.data.warnings,
      data: {
        aboutContent: "Mocked generated rich text about " + store.name,
        faqContent: JSON.stringify([{ question: "What is " + store.name + "?", answer: "A great store." }]),
        shippingInfo: "Mocked shipping information."
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
