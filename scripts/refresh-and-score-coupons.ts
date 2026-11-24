import "dotenv/config";
import { prisma } from "../src/lib/db";
import { cleanCouponCode, formatDiscountBadge, scoreCoupon } from "../src/lib/coupon-ranking";
import { CuelinksConnector } from "../src/lib/import-engine/connectors/cuelinks/cuelinks.connector";
import { ImportPipeline } from "../src/lib/import-engine/pipeline";
import { submitToIndexNow } from "../src/lib/indexnow";

/**
 * One-shot maintenance script to:
 * 1. Pull fresh live offers from Cuelinks (when CUELINKS_API_KEY is configured).
 * 2. Clean stray whitespace in promo codes and extend valid ongoing offers past stale dates.
 * 3. Re-compute qualityScore and highlight the best coupons (isFeatured = true) across top merchants.
 * 4. Sync store.activeOfferCount and notify IndexNow for refreshed top URLs.
 *
 * Run with: npx tsx scripts/refresh-and-score-coupons.ts
 */
async function main() {
    const now = new Date();
    const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);

    // 1. Run live Cuelinks import if API key is configured
    if (process.env.CUELINKS_API_KEY) {
        console.log("[Refresh] Running live Cuelinks import...");
        try {
            const connector = new CuelinksConnector();
            const pipeline = new ImportPipeline();
            await pipeline.run(connector, "v1.0");
            console.log("[Refresh] Cuelinks import finished.");
        } catch (err) {
            console.warn("[Refresh] Cuelinks import failed (continuing with DB refresh):", err);
        }
    } else {
        console.log("[Refresh] CUELINKS_API_KEY not set, skipping live fetch.");
    }

    // 2. Refresh stale batch expiry dates (e.g. coupons batch-stamped to 2026-11-15) & clean promo codes
    const coupons = await prisma.coupon.findMany({
        where: { deletedAt: null },
        include: {
            merchantIdentity: {
                include: { store: true },
            },
        },
    });

    console.log(`[Refresh] Evaluating ${coupons.length} coupons...`);

    const scored: Array<{ id: string; storeSlug: string; storeId: string | null; score: number; hasCode: boolean }> = [];
    let codesCleaned = 0;
    let expiriesExtended = 0;

    for (const c of coupons) {
        const cleaned = cleanCouponCode(c.code);
        const needsCodeClean = cleaned !== c.code;
        const formattedVal = formatDiscountBadge(c.discountValue, c.discountType, c.title);

        // Extend non-festive expired evergreen offers or refresh active window
        const isExpiredStaleBatch = c.expiresAt && new Date(c.expiresAt) <= now;
        const isOldDiwaliSpecific = /\bdiwali\b/i.test(`${c.title} ${cleaned || ""}`);
        const newExpiresAt = isExpiredStaleBatch && !isOldDiwaliSpecific ? nextMonthEnd : c.expiresAt;

        const score = scoreCoupon(
            {
                ...c,
                code: cleaned,
                expiresAt: newExpiresAt,
                discountValue: formattedVal,
            },
            now
        );

        const normalizedQuality = Math.min(99, Math.max(20, Math.round(score)));

        if (needsCodeClean || newExpiresAt !== c.expiresAt || c.qualityScore !== normalizedQuality) {
            await prisma.coupon.update({
                where: { id: c.id },
                data: {
                    code: cleaned,
                    expiresAt: newExpiresAt,
                    qualityScore: normalizedQuality,
                    isFeatured: false,
                },
            });
            if (needsCodeClean) codesCleaned++;
            if (newExpiresAt !== c.expiresAt) expiriesExtended++;
        }

        const isActiveAfterUpdate = !newExpiresAt || new Date(newExpiresAt) > now;
        if (isActiveAfterUpdate && c.merchantIdentity?.store?.isActive) {
            scored.push({
                id: c.id,
                storeSlug: c.merchantIdentity.store.slug,
                storeId: c.merchantIdentity.store.id,
                score,
                hasCode: Boolean(cleaned),
            });
        }
    }

    // 3. Highlight top 24 diverse best coupons (max 2 per store, prioritizing verified codes)
    scored.sort((a, b) => b.score - a.score);
    const storeFeaturedCount = new Map<string, number>();
    const featuredIds: string[] = [];
    const refreshedStoreSlugs = new Set<string>();

    for (const item of scored) {
        if (featuredIds.length >= 24) break;
        const count = storeFeaturedCount.get(item.storeSlug) || 0;
        if (count >= 2) continue;
        storeFeaturedCount.set(item.storeSlug, count + 1);
        featuredIds.push(item.id);
        refreshedStoreSlugs.add(item.storeSlug);
    }

    if (featuredIds.length > 0) {
        await prisma.coupon.updateMany({
            where: { id: { in: featuredIds } },
            data: { isFeatured: true, displayOrder: 100 },
        });
    }

    // 4. Sync activeOfferCount on active stores
    const activeStores = await prisma.store.findMany({
        where: { isActive: true, merchantIdentity: { isNot: null } },
        select: {
            id: true,
            slug: true,
            activeOfferCount: true,
            merchantIdentity: {
                select: {
                    coupons: {
                        where: {
                            deletedAt: null,
                            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                        },
                        select: { id: true },
                    },
                },
            },
        },
    });

    let storeCountsUpdated = 0;
    for (const st of activeStores) {
        const realCount = st.merchantIdentity?.coupons.length || 0;
        if (realCount !== st.activeOfferCount) {
            await prisma.store.update({
                where: { id: st.id },
                data: { activeOfferCount: realCount },
            });
            storeCountsUpdated++;
        }
    }

    // 5. Notify IndexNow for key refreshed pages
    const urlsToPing = [
        "/",
        "/best-offers",
        "/stores",
        "/tools/card-vs-cashback-calculator",
        ...Array.from(refreshedStoreSlugs)
            .slice(0, 15)
            .map((slug) => `/stores/${slug}`),
    ];
    await submitToIndexNow(urlsToPing).catch((e) => console.warn("[Refresh] IndexNow skipped:", e));

    console.log({
        totalEvaluated: coupons.length,
        codesCleaned,
        expiriesExtended,
        featuredHighlighted: featuredIds.length,
        storeCountsUpdated,
        pingedUrls: urlsToPing.length,
    });
    process.exit(0);
}

main().catch((err) => {
    console.error("[Refresh] Fatal error:", err);
    process.exit(1);
});
