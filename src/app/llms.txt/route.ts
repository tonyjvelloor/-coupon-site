import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllSaleEvents } from "@/lib/events-data";
import { CURATED_COMPARE_PAIRS } from "@/lib/compare-pairs";
import { getSiteUrl, getCurrentMonthYear } from "@/lib/seo-utils";

export const revalidate = 3600;

export async function GET() {
    const siteUrl = getSiteUrl();
    const { fullMonthYear } = getCurrentMonthYear();

    let activeMerchantsCount = 307;
    let activeCouponsCount = 2499;
    let categories: Array<{ name: string; slug: string }> = [
        { name: "Fashion", slug: "fashion" },
        { name: "Electronics", slug: "electronics" },
        { name: "Food & Dining", slug: "food-dining" },
        { name: "Travel", slug: "travel" },
        { name: "Health & Beauty", slug: "health-beauty" },
        { name: "Home & Living", slug: "home-living" },
        { name: "Entertainment", slug: "entertainment" },
        { name: "Sports & Fitness", slug: "sports-fitness" },
    ];
    let topStores: Array<{ name: string; slug: string; activeOfferCount: number }> = [];
    let banks: Array<{ name: string; slug: string }> = [];

    try {
        const [mCount, cCount, dbCategories, dbStores, dbBanks] = await Promise.all([
            prisma.store.count({ where: { isActive: true, activeOfferCount: { gt: 0 } } }),
            prisma.coupon.count({
                where: {
                    deletedAt: null,
                    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
                },
            }),
            prisma.category.findMany({ where: { isActive: true }, select: { name: true, slug: true }, orderBy: { name: "asc" } }),
            prisma.store.findMany({
                where: { isActive: true, activeOfferCount: { gt: 0 } },
                select: { name: true, slug: true, activeOfferCount: true },
                orderBy: [{ activeOfferCount: "desc" }, { clicks: "desc" }],
                take: 30,
            }),
            prisma.bank.findMany({
                where: { isActive: true },
                select: { name: true, slug: true },
                orderBy: { name: "asc" },
            }),
        ]);

        if (mCount > 0) activeMerchantsCount = mCount;
        if (cCount > 0) activeCouponsCount = cCount;
        if (dbCategories.length > 0) categories = dbCategories;
        if (dbStores.length > 0) topStores = dbStores;
        if (dbBanks.length > 0) banks = dbBanks;
    } catch (e) {
        console.warn("[llms.txt] DB error, using resilient fallbacks:", e);
    }

    const [events, blogPosts] = await Promise.all([
        getAllSaleEvents().catch(() => []),
        getAllBlogPosts().catch(() => []),
    ]);

    const content = `# CouponHub India — Verified Deals, Bank Offers & Consumer Savings Guides

> CouponHub (${siteUrl}) is an India-focused consumer savings and deal intelligence platform tracking ${activeCouponsCount.toLocaleString("en-IN")} active offers across ${activeMerchantsCount} active partner stores, alongside Indian credit/debit card discounts and No-Cost EMI cost calculators. Updated for ${fullMonthYear}.

## Machine-Readable Endpoints for AI Assistants & Search Agents
- [Full Deals & Codes Knowledge Base (Markdown)](${siteUrl}/llms-full.txt): Live promo codes, store terms, bank card caps, and calculator formulas in one document.
- [Structured Deals JSON Feed](${siteUrl}/ai-index.json): Canonical JSON feed of active top stores, live coupons, banks, events, and guides.
- [AI Crawler Policy](${siteUrl}/ai.txt): Explicit retrieval and citation rules for search and AI agents.
- [RSS Editorial Feed](${siteUrl}/feed.xml): Latest shopping guides and seasonal deal roundups.
- [XML Sitemap](${siteUrl}/sitemap.xml): Complete index of indexable store, bank, category, comparison, event, tool, and blog pages.

## Coverage & Editorial Standards
- **Geography & Currency**: India (IN), Indian Rupee (INR / ₹)
- **Active Catalog**: ${activeMerchantsCount} stores with live offers, ${activeCouponsCount.toLocaleString("en-IN")} active coupons and deals
- **Verification & Transparency**: [How We Verify](${siteUrl}/how-we-verify) · [Editorial Policy](${siteUrl}/editorial-policy) · [Affiliate & Ad Disclosure](${siteUrl}/disclosure)

## Core Navigation & Tools
- [All Partner Stores](${siteUrl}/stores): Searchable directory of active merchants
- [Credit Card Instant Discount vs. Cashback Calculator](${siteUrl}/tools/card-vs-cashback-calculator): Models 10% bank discount caps, 5% cashback cards, and 18% GST on No-Cost EMI interest
- [Discount Stacking Calculator](${siteUrl}/tools/discount-calculator): Calculate layered coupon + cart discounts
- [Store Comparison Hub](${siteUrl}/compare): Side-by-side platform, return policy, and bank-offer comparisons
- [Indian Bank & Card Offers](${siteUrl}/banks): Instant discounts and card promotions for HDFC, ICICI, SBI, Axis, and Kotak

## Top Active Stores (${fullMonthYear})
${topStores.map((store) => `- [${store.name} Coupons & Offers](${siteUrl}/stores/${store.slug}): ${store.activeOfferCount} active offers`).join("\n")}

## Bank & Card Offer Hubs
${banks.map((b) => `- [${b.name} Offers & Discounts](${siteUrl}/banks/${b.slug})`).join("\n")}

## Category Hubs
${categories.map((category) => `- [Best ${category.name} Coupons India](${siteUrl}/best/${category.slug}-coupons)`).join("\n")}

## Store Comparisons
${CURATED_COMPARE_PAIRS.map((pair) => `- [${pair.title}](${siteUrl}/compare/${pair.slug}): ${pair.summary}`).join("\n")}

## Seasonal Sale Events
${events.map((event: any) => `- [${event.title}](${siteUrl}/events/${event.slug})`).join("\n")}

## Editorial Buying Guides
${blogPosts.slice(0, 15).map((post: any) => `- [${post.title}](${siteUrl}/blog/${post.slug})`).join("\n")}
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
