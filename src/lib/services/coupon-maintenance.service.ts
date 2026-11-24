import { prisma } from "@/lib/db";
import { cleanCouponCode, formatDiscountBadge, scoreCoupon } from "@/lib/coupon-ranking";
import { submitToIndexNow } from "@/lib/indexnow";

export interface MaintenanceSummary {
  evaluated: number;
  updated: number;
  featuredHighlighted: number;
  storeCountsUpdated: number;
  pingedUrls: number;
}

/**
 * Lightweight, Neon-Free-friendly post-import maintenance pass:
 * 1. Scores recent/active coupons and cleans whitespace from promo codes (batched writes).
 * 2. Promotes the top 24 diverse highest-value coupons (max 2 per store) to isFeatured = true.
 * 3. Re-syncs activeOfferCount for stores whose count drifted.
 * 4. Pings IndexNow with refreshed core & top merchant URLs.
 */
export async function runCouponScoringAndIndexNow(): Promise<MaintenanceSummary> {
  const now = new Date();

  const coupons = await prisma.coupon.findMany({
    where: {
      deletedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      type: true,
      discountType: true,
      discountValue: true,
      affiliateUrl: true,
      expiresAt: true,
      isVerified: true,
      isExclusive: true,
      isFeatured: true,
      qualityScore: true,
      clicks: true,
      createdAt: true,
      merchantIdentity: {
        select: {
          store: {
            select: { id: true, slug: true, isActive: true },
          },
        },
      },
    },
    take: 1500,
    orderBy: { createdAt: "desc" },
  });

  const scored: Array<{ id: string; storeSlug: string; score: number }> = [];
  const pendingUpdates: Array<{ id: string; code: string | null; qualityScore: number }> = [];

  for (const c of coupons) {
    const cleaned = cleanCouponCode(c.code);
    const formattedVal = formatDiscountBadge(c.discountValue, c.discountType, c.title);
    const rawScore = scoreCoupon(
      {
        ...c,
        code: cleaned,
        discountValue: formattedVal,
        qualityScore: c.qualityScore ?? undefined,
      },
      now
    );
    const normalizedQuality = Math.min(99, Math.max(20, Math.round(rawScore)));

    if (cleaned !== c.code || c.qualityScore !== normalizedQuality) {
      pendingUpdates.push({
        id: c.id,
        code: cleaned,
        qualityScore: normalizedQuality,
      });
    }

    if (c.merchantIdentity?.store?.isActive) {
      scored.push({
        id: c.id,
        storeSlug: c.merchantIdentity.store.slug,
        score: rawScore,
      });
    }
  }

  // Batch updates in chunks of 25 (capped at 150 per cron run to keep Neon compute fast & minimal)
  const cappedUpdates = pendingUpdates.slice(0, 150);
  for (let i = 0; i < cappedUpdates.length; i += 25) {
    const chunk = cappedUpdates.slice(i, i + 25);
    await Promise.all(
      chunk.map((u) =>
        prisma.coupon.update({
          where: { id: u.id },
          data: { code: u.code, qualityScore: u.qualityScore },
        })
      )
    );
  }

  // Select top 24 diverse coupons (max 2 per store)
  scored.sort((a, b) => b.score - a.score);
  const storeCount = new Map<string, number>();
  const featuredIds: string[] = [];
  const topStoreSlugs = new Set<string>();

  for (const item of scored) {
    if (featuredIds.length >= 24) break;
    const count = storeCount.get(item.storeSlug) || 0;
    if (count >= 2) continue;
    storeCount.set(item.storeSlug, count + 1);
    featuredIds.push(item.id);
    topStoreSlugs.add(item.storeSlug);
  }

  if (featuredIds.length > 0) {
    // Only reset previously featured coupons not in the new top set (2 fast bulk queries)
    await prisma.coupon.updateMany({
      where: { isFeatured: true, id: { notIn: featuredIds } },
      data: { isFeatured: false, displayOrder: 0 },
    });
    await prisma.coupon.updateMany({
      where: { id: { in: featuredIds } },
      data: { isFeatured: true, displayOrder: 100 },
    });
  }

  // Sync activeOfferCount only for stores whose count differs
  const countsByStore = new Map<string, number>();
  for (const c of coupons) {
    const sid = c.merchantIdentity?.store?.id;
    if (sid) countsByStore.set(sid, (countsByStore.get(sid) || 0) + 1);
  }

  let storeCountsUpdated = 0;
  if (countsByStore.size > 0) {
    const storeIds = Array.from(countsByStore.keys());
    const stores = await prisma.store.findMany({
      where: { id: { in: storeIds } },
      select: { id: true, activeOfferCount: true },
    });
    const toSync = stores.filter((s) => (countsByStore.get(s.id) || 0) !== s.activeOfferCount).slice(0, 100);
    for (let i = 0; i < toSync.length; i += 25) {
      const chunk = toSync.slice(i, i + 25);
      await Promise.all(
        chunk.map((s) =>
          prisma.store.update({
            where: { id: s.id },
            data: { activeOfferCount: countsByStore.get(s.id) || 0 },
          })
        )
      );
    }
    storeCountsUpdated = toSync.length;
  }

  // Notify IndexNow of refreshed top URLs
  const urlsToPing = [
    "/",
    "/best-offers",
    "/stores",
    "/tools/card-finder",
    "/tools/card-vs-cashback-calculator",
    ...Array.from(topStoreSlugs)
      .slice(0, 15)
      .map((slug) => `/stores/${slug}`),
  ];
  await submitToIndexNow(urlsToPing).catch((e) =>
    console.warn("[CouponMaintenance] IndexNow ping skipped:", e)
  );

  return {
    evaluated: coupons.length,
    updated: cappedUpdates.length,
    featuredHighlighted: featuredIds.length,
    storeCountsUpdated,
    pingedUrls: urlsToPing.length,
  };
}
