import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class CollectionWorker implements IntelligenceWorker {
  name = "collection-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.COUPON_PUBLISHED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Coupon") throw new Error("CollectionWorker analyzes newly published coupons");

    const coupon = await prisma.coupon.findUnique({
      where: { id: entityId },
      include: { store: true }
    });

    if (!coupon) throw new Error("Coupon not found");

    const inputSnapshot = {
      couponTitle: coupon.title,
      description: coupon.description,
      storeName: coupon.store.name,
    };

    const prompt = `Analyze this coupon and propose a new programmatic SEO Collection if it represents a broader trend (e.g., Bank Offers, Diwali).`;
    const response = await llmProvider.generate<any>(
      "collection-opportunity-v1",
      prompt,
      {}
    );

    const proposal: WorkerProposal = {
      confidence: response.data.confidence || 0.9,
      reasoning: response.data.reasoning || `Coupon title mentions 'HDFC Bank', proposing an HDFC Bank Offers collection.`,
      warnings: response.data.warnings || [],
      data: {
        collectionProposal: {
          name: "HDFC Bank Offers",
          slug: "hdfc-bank-offers",
          type: "bank",
          seoTitle: "Best HDFC Bank Offers & Credit Card Discounts",
          seoDescription: "Get the latest HDFC Bank credit card offers, discounts, and cashback deals across top merchants."
        }
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
