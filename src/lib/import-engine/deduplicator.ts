import { NormalizedOffer } from "./types";
import { prisma } from "@/lib/db";

export interface DuplicateResult {
  riskScore: number; // 0-100
  matchedCouponIds: string[];
  reasons: string[];
}

export class Deduplicator {
  /**
   * Checks an offer against existing live Coupons and returns a risk profile.
   */
  async check(offer: NormalizedOffer, storeId?: string): Promise<DuplicateResult> {
    const reasons: string[] = [];
    const matchedIds = new Set<string>();
    let riskScore = 0;

    // 1. Exact external ID match (100% risk)
    if (offer.externalId && storeId) {
       // Assuming we have a way to track external IDs on Coupon. 
       // For V1, we might not have externalId on Coupon, but we could check affiliateUrl as a strong identifier.
       // Let's rely on affiliateUrl instead as a primary strict match.
    }

    // 2. Exact Affiliate URL match (90% risk - could be same offer re-imported)
    if (offer.affiliateUrl) {
      const existingUrls = await prisma.coupon.findMany({
        where: { affiliateUrl: offer.affiliateUrl },
        select: { id: true }
      });
      if (existingUrls.length > 0) {
        riskScore = Math.max(riskScore, 90);
        reasons.push("Exact affiliate URL match found.");
        existingUrls.forEach(c => matchedIds.add(c.id));
      }
    }

    // 3. Exact Code + Store match (95% risk - same code usually means same offer)
    if (offer.code && storeId) {
      const existingCodes = await prisma.coupon.findMany({
        where: { storeId, code: offer.code },
        select: { id: true }
      });
      if (existingCodes.length > 0) {
        riskScore = Math.max(riskScore, 95);
        reasons.push("Exact coupon code match for this store found.");
        existingCodes.forEach(c => matchedIds.add(c.id));
      }
    }

    // 4. Merchant + Title Match (70% risk)
    if (storeId && offer.title) {
        const existingTitles = await prisma.coupon.findMany({
            where: { storeId, title: offer.title },
            select: { id: true }
        });
        if (existingTitles.length > 0) {
            riskScore = Math.max(riskScore, 70);
            reasons.push("Exact title match for this store found.");
            existingTitles.forEach(c => matchedIds.add(c.id));
        }
    }

    return {
      riskScore,
      matchedCouponIds: Array.from(matchedIds),
      reasons
    };
  }
}
