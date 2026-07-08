import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class FaqWorker implements IntelligenceWorker {
  name = "faq-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.MERCHANT_UPDATED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Store") throw new Error("FaqWorker only processes Stores");

    const store = await prisma.store.findUnique({
      where: { id: entityId }
    });

    if (!store) throw new Error("Store not found");

    const inputSnapshot = {
      storeName: store.name,
      description: store.description,
      website: store.website
    };

    const prompt = `Generate a structured JSON array of 5 Frequently Asked Questions about coupons and shipping for ${store.name}.`;
    const response = await llmProvider.generate<any>(
      "faq-v1",
      prompt,
      {}
    );

    const faqs = [
      { question: `Does ${store.name} offer free shipping?`, answer: `Yes, ${store.name} typically offers free shipping on orders over a certain amount.` },
      { question: `How do I use a ${store.name} promo code?`, answer: `During checkout, paste your code into the "Promo Code" box and click Apply.` },
      { question: `Does ${store.name} have a student discount?`, answer: `Please check their website via StudentBeans or UNiDAYS for current student offers.` }
    ];

    const proposal: WorkerProposal = {
      confidence: response.data.confidence || 0.95,
      reasoning: response.data.reasoning || `Generated standard e-commerce FAQ template adapted for ${store.name}.`,
      warnings: response.data.warnings || [],
      data: {
        storeContents: [
          { 
            type: 'FAQ', 
            content: JSON.stringify(faqs)
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
