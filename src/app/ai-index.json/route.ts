import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllSaleEvents } from "@/lib/events-data";
import { CURATED_COMPARE_PAIRS } from "@/lib/compare-pairs";
import { getSiteUrl, getCurrentMonthYear } from "@/lib/seo-utils";

export const revalidate = 43200; // 12h cache for AI crawlers to save Neon compute hours

export async function GET() {
    const siteUrl = getSiteUrl();
    const { fullMonthYear } = getCurrentMonthYear();
    const now = new Date();

    let stores: any[] = [];
    let banks: any[] = [];

    try {
        [stores, banks] = await Promise.all([
            prisma.store.findMany({
                where: { isActive: true, activeOfferCount: { gt: 0 } },
                orderBy: [{ activeOfferCount: "desc" }, { clicks: "desc" }],
                take: 30,
                include: {
                    storeCategories: { include: { category: { select: { name: true, slug: true } } } },
                    merchantIdentity: {
                        include: {
                            coupons: {
                                where: {
                                    deletedAt: null,
                                    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                                },
                                orderBy: { qualityScore: "desc" },
                                take: 5,
                            },
                        },
                    },
                },
            }),
            prisma.bank.findMany({
                where: { isActive: true },
                select: {
                    name: true,
                    slug: true,
                    description: true,
                    _count: { select: { bankOffers: { where: { isActive: true } } } },
                },
            }),
        ]);
    } catch (e) {
        console.warn("[ai-index.json] DB error:", e);
    }

    const [events, blogPosts] = await Promise.all([
        getAllSaleEvents().catch(() => []),
        getAllBlogPosts().catch(() => []),
    ]);

    const payload = {
        schemaVersion: "1.0",
        generatedAt: new Date().toISOString(),
        period: fullMonthYear,
        publisher: {
            name: "CouponHub India",
            operator: "TheBrandManiacs",
            url: siteUrl,
            llmsTxt: `${siteUrl}/llms.txt`,
            llmsFullTxt: `${siteUrl}/llms-full.txt`,
            editorialPolicy: `${siteUrl}/editorial-policy`,
            verificationProcess: `${siteUrl}/how-we-verify`,
        },
        tools: [
            {
                name: "Credit Card Instant Discount vs. Cashback Calculator",
                url: `${siteUrl}/tools/card-vs-cashback-calculator`,
                description:
                    "Compares capped instant bank discounts, cashback cards, and hidden 18% GST + processing fees on No-Cost EMI in India.",
            },
            {
                name: "Discount Stacking Calculator",
                url: `${siteUrl}/tools/discount-calculator`,
                description: "Calculates layered store coupons and checkout discounts.",
            },
        ],
        topStores: stores.map((s) => ({
            name: s.name,
            slug: s.slug,
            url: `${siteUrl}/stores/${s.slug}`,
            category: s.storeCategories[0]?.category?.name || "Retail",
            activeOfferCount: s.activeOfferCount,
            cashbackRate: s.cashbackRate || null,
            description: s.description || null,
            topOffers: (s.merchantIdentity?.coupons || []).map((c: any) => ({
                title: c.title,
                code: c.code || null,
                discountValue: c.discountValue || null,
                type: c.type,
                expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
            })),
        })),
        banks: banks.map((b) => ({
            name: b.name,
            slug: b.slug,
            url: `${siteUrl}/banks/${b.slug}`,
            activeOffersCount: b._count.bankOffers,
            description: b.description || null,
        })),
        comparisons: CURATED_COMPARE_PAIRS.map((p) => ({
            ...p,
            url: `${siteUrl}/compare/${p.slug}`,
        })),
        events: events.map((e: any) => ({
            title: e.title,
            slug: e.slug,
            url: `${siteUrl}/events/${e.slug}`,
            description: e.description || e.subtitle || null,
        })),
        guides: blogPosts.slice(0, 15).map((p: any) => ({
            title: p.title,
            slug: p.slug,
            url: `${siteUrl}/blog/${p.slug}`,
            summary: p.seoDescription || null,
            publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
        })),
    };

    return NextResponse.json(payload, {
        headers: {
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
