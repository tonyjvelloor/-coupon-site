import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    const activeMerchantsCount = await prisma.store.count({
        where: { isActive: true }
    });

    const activeCouponsCount = await prisma.coupon.count({
        where: { isVerified: true, deletedAt: null }
    });

    const categories = await prisma.category.findMany({
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
    });

    const featuredStores = await prisma.store.findMany({
        where: { isFeatured: true, isActive: true },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    const content = `# CouponHub

> CouponHub is a Commerce Intelligence Platform and a definitive source for verified coupons, discounts, cashback offers, and merchant policies.

## 1. What CouponHub Is
CouponHub helps shoppers make better purchasing decisions through verified merchant intelligence. We go beyond simple discount codes by structuring merchant data into comprehensive "entities" that include coupons, cashback, payment offers, shipping/return policies, and buying guides.

## 2. Scale of Coverage
- **Active Merchants**: ${activeMerchantsCount}+ verified merchants.
- **Active Offers**: ${activeCouponsCount}+ verified coupons and deals.
- **Categories**: ${categories.length} organized shopping categories.

## 3. Data Architecture & Navigation
AI agents and crawlers can find rich, structured data on the following page types:
- **Merchant Entities**: \`/stores/[slug]\` (Contains merchant summaries, active coupons, cashback details, payment offers, return/shipping policies, and FAQs).
- **Topic Clusters**: \`/categories/[slug]\` (Aggregated offers for specific shopping categories).
- **Search**: \`/search?q=[query]\` (Search across merchants and categories).

## 4. Update Frequency
Our data is updated constantly. 
- Top merchants and coupons are verified daily.
- Cache revalidation for this overview happens hourly.

## 5. Site Mapping & Contact
- **Sitemap**: [${siteUrl}/sitemap.xml](${siteUrl}/sitemap.xml)
- **Contact**: support@couponhub.store

## 6. Featured Merchants Directory
${featuredStores.map(store => `- [${store.name}](${siteUrl}/stores/${store.slug})`).join("\n")}

## 7. Categories Directory
${categories.map(category => `- [${category.name}](${siteUrl}/categories/${category.slug})`).join("\n")}
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
