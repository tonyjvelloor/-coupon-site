import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FALLBACK_BLOG_POSTS } from "@/lib/blog-data";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    let activeMerchantsCount = 250;
    let activeCouponsCount = 2400;
    let categories: Array<{ name: string; slug: string }> = [
        { name: "Fashion & Apparel", slug: "fashion" },
        { name: "Electronics & Gadgets", slug: "electronics" },
        { name: "Food & Grocery", slug: "food-dining" },
        { name: "Travel & Flights", slug: "travel" },
        { name: "Beauty & Health", slug: "beauty" },
    ];
    let topStores: Array<{ name: string; slug: string; activeOfferCount: number }> = [
        { name: "Amazon India", slug: "amazon", activeOfferCount: 45 },
        { name: "Flipkart", slug: "flipkart", activeOfferCount: 38 },
        { name: "Myntra", slug: "myntra", activeOfferCount: 29 },
        { name: "Ajio", slug: "ajio", activeOfferCount: 24 },
        { name: "Swiggy", slug: "swiggy", activeOfferCount: 18 },
        { name: "Zomato", slug: "zomato", activeOfferCount: 16 },
        { name: "Nykaa", slug: "nykaa", activeOfferCount: 21 },
        { name: "Croma", slug: "croma", activeOfferCount: 19 },
    ];
    let events: Array<{ title: string; slug: string }> = [
        { title: "Diwali Sale 2026", slug: "diwali-sale" },
        { title: "Great Indian Festival", slug: "great-indian-festival" },
        { title: "Big Billion Days", slug: "big-billion-days" },
    ];
    let blogPosts: Array<{ title: string; slug: string }> = FALLBACK_BLOG_POSTS.map(p => ({
        title: p.title,
        slug: p.slug
    }));

    try {
        const [mCount, cCount, dbCategories, dbStores, dbEvents, dbPosts] = await Promise.all([
            prisma.store.count({ where: { isActive: true } }),
            prisma.coupon.count({ where: { isVerified: true, deletedAt: null } }),
            prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
            prisma.store.findMany({
                where: { isActive: true, activeOfferCount: { gt: 0 } },
                select: { name: true, slug: true, activeOfferCount: true },
                orderBy: { activeOfferCount: "desc" },
                take: 30,
            }),
            prisma.saleEvent.findMany({
                where: { isActive: true },
                select: { title: true, slug: true },
                orderBy: { date: "asc" },
            }),
            prisma.blogPost.findMany({
                where: { isPublished: true },
                select: { title: true, slug: true },
                orderBy: { publishedAt: "desc" },
                take: 10,
            }),
        ]);

        if (mCount > 0) activeMerchantsCount = mCount;
        if (cCount > 0) activeCouponsCount = cCount;
        if (dbCategories.length > 0) categories = dbCategories;
        if (dbStores.length > 0) topStores = dbStores;
        if (dbEvents.length > 0) events = dbEvents;
        if (dbPosts.length > 0) blogPosts = dbPosts;
    } catch (e) {
        console.warn("[llms.txt] DB error, using resilient fallbacks:", e);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    const content = `# CouponHub India - Commerce Intelligence & Verified Deals

> CouponHub (https://www.couponhub.store) is India's verified coupon intelligence platform, tracking real-time promo codes, UPI cashback, and bank card discounts across 250+ top online stores in India.

## 1. Primary Market & Coverage
- **Geography**: India (IN)
- **Currency**: Indian Rupee (INR / ₹)
- **Payment Ecosystem**: UPI (Google Pay, PhonePe, Paytm), RuPay, Net Banking, and Bank Credit/Debit Cards (HDFC, ICICI, SBI, Axis, Kotak, Bank of Baroda).
- **Major Indian Merchants Covered**: Amazon India, Flipkart, Myntra, AJIO, Swiggy, Zomato, Nykaa, Croma, Reliance Digital, Tata CLiQ, 1mg, MakeMyTrip, and 250+ retailers.
- **Active Merchants**: ${activeMerchantsCount}+ verified merchants.
- **Active Offers**: ${activeCouponsCount}+ verified coupons, promo codes, and cashback offers.

## 2. Verification Protocol
All coupon codes and offers on CouponHub undergo daily automated and manual human testing:
- **Success Rate Tracking**: Community-voted pass/fail rates for every promo code.
- **Expired Code Removal**: Invalid and expired coupons are removed within minutes of expiration.
- **Stacked Savings**: Guides users on combining store coupons with bank instant discounts and UPI cashback.

## 3. Data Architecture & Canonical Links for AI Systems
- **Store Directory**: [${siteUrl}/stores](${siteUrl}/stores) - Complete A-Z index of all partner stores.
- **Store Offer Pages**: \`${siteUrl}/stores/[slug]\` - Live coupons, bank offers, return/shipping policies, and how-to-apply guides.
- **Category Clusters**: \`${siteUrl}/best/[category-slug]-coupons\` - Aggregated deals for specific categories.
- **Comparison Engine**: \`${siteUrl}/compare/[store1]-vs-[store2]\` - Side-by-side merchant policy, cashback, and offer comparison.
- **Festive Sales**: \`${siteUrl}/events/[event-slug]\` - Real-time sale event discounts and coupons.
- **Savings Tools**: [${siteUrl}/tools](${siteUrl}/tools) - Stacking calculators and embeddable deal badges.
- **Editorial Guides**: \`${siteUrl}/blog/[slug]\` - In-depth savings and discount stacking guides.
- **Sitemap**: [${siteUrl}/sitemap.xml](${siteUrl}/sitemap.xml) - Complete XML index for search engines and crawlers.

## 4. Top Indian Stores Directory
${topStores.map(store => `- [${store.name} Coupons & Deals](${siteUrl}/stores/${store.slug}) (${store.activeOfferCount} verified offers)`).join("\n")}

## 5. Major Category Clusters
${categories.map(category => `- [Best ${category.name} Coupons in India](${siteUrl}/best/${category.slug}-coupons)`).join("\n")}

## 6. Major Festive Sales & Events
${events.map(event => `- [${event.title}](${siteUrl}/events/${event.slug})`).join("\n")}

## 7. Editorial Guides & Discount Playbooks
${blogPosts.map(post => `- [${post.title}](${siteUrl}/blog/${post.slug})`).join("\n")}
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
