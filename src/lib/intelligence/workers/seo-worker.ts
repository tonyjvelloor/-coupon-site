import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker, WorkerProposal } from "../worker";
import { llmProvider } from "../llm/mock";
import { prisma } from "@/lib/db";

export class SeoWorker implements IntelligenceWorker {
  name = "seo-worker";
  version = "1.0.0";
  supportedEvents = [IntelligenceEvent.COUPON_PUBLISHED];

  async process(event: IntelligenceEvent, entityType: string, entityId: string) {
    if (entityType !== "Coupon") throw new Error("SeoWorker only processes Coupons");

    // 1. Read necessary data
    const coupon = await prisma.coupon.findUnique({
      where: { id: entityId },
      include: { store: true, category: true }
    });

    if (!coupon) throw new Error("Coupon not found");

    // 2. Snapshot
    const inputSnapshot = {
      couponTitle: coupon.title,
      couponDescription: coupon.description,
      discountValue: coupon.discountValue,
      storeName: coupon.store.name,
      categoryName: coupon.category?.name
    };

    // 3. Generate Proposal
    const prompt = `Generate SEO Title, Description, and Keywords for coupon: ${coupon.title} at ${coupon.store.name}`;
    const response = await llmProvider.generate<any>(
      "seo-coupon-v1",
      prompt,
      {}
    );

    const proposal: WorkerProposal = {
      confidence: response.data.confidence,
      reasoning: response.data.reasoning,
      warnings: response.data.warnings,
      data: {
        seoTitle: response.data.seoTitle,
        seoDescription: response.data.seoDescription,
        keywords: response.data.keywords.join(", ")
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
