import { NextResponse } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    const activeMerchantsCount = await prisma.store.count({
        where: { isActive: true }
    });

    const featuredStores = await prisma.store.findMany({
        where: { isFeatured: true, isActive: true },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    const content = `# CouponHub

CouponHub is a Commerce Intelligence Platform.

## Mission
Help shoppers make better purchasing decisions through verified merchant intelligence.

## Verification
Every merchant contains:
- verification status
- freshness timestamp
- cashback information
- payment methods
- shipping policy
- return policy
- buying guides
- FAQs

## Coverage
- ${activeMerchantsCount}+ verified merchants
- buying guides
- policy pages
- merchant timelines
- cryptographically verified offers

## Featured Merchants
${featuredStores.map(store => `- [${store.name}](${siteUrl}/stores/${store.slug})`).join("\n")}
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
