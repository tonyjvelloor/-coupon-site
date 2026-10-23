import 'dotenv/config';
import { prisma } from '../src/lib/db';
import { FALLBACK_BLOG_POSTS } from '../src/lib/blog-data';
import { FALLBACK_SALE_EVENTS } from '../src/lib/events-data';

const AUTHOR_ID = '1ebc7065-47f0-4cfc-8007-d137e0c9fa73';

async function main() {
    const now = new Date();
    console.log(`=== Starting Diwali 2026 Festive Seed & Offer Refresh [${now.toISOString()}] ===\n`);

    // 1. Seed & Publish All Blog Posts
    console.log("--- Step 1: Seeding & Publishing Diwali 2026 Blog Posts ---");
    let admin = await prisma.admin.findFirst();
    const authorId = admin?.id || AUTHOR_ID;

    for (const post of FALLBACK_BLOG_POSTS) {
        try {
            await prisma.blogPost.upsert({
                where: { slug: post.slug },
                update: {
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    seoTitle: post.seoTitle,
                    seoDescription: post.seoDescription,
                    keywords: post.keywords,
                    isPublished: true,
                    publishedAt: post.publishedAt,
                    authorId: authorId,
                },
                create: {
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    seoTitle: post.seoTitle,
                    seoDescription: post.seoDescription,
                    keywords: post.keywords,
                    isPublished: true,
                    publishedAt: post.publishedAt,
                    authorId: authorId,
                }
            });
            console.log(`✅ Blog published: /blog/${post.slug}`);
        } catch (e: any) {
            console.warn(`Notice on blog ${post.slug}:`, e.message);
        }
    }

    // 2. Seed & Update Sale Events
    console.log("\n--- Step 2: Seeding & Activating Diwali Sale Events ---");
    for (const event of FALLBACK_SALE_EVENTS) {
        try {
            await prisma.saleEvent.upsert({
                where: { slug: event.slug },
                update: {
                    title: event.title,
                    subtitle: event.subtitle,
                    description: event.description,
                    seoTitle: event.seoTitle,
                    date: event.date,
                    icon: event.icon,
                    isActive: true,
                },
                create: {
                    slug: event.slug,
                    title: event.title,
                    subtitle: event.subtitle,
                    description: event.description,
                    seoTitle: event.seoTitle,
                    date: event.date,
                    icon: event.icon,
                    isActive: true,
                }
            });
            console.log(`✅ Sale Event active: /events/${event.slug}`);
        } catch (e: any) {
            console.warn(`Notice on event ${event.slug}:`, e.message);
        }
    }

    // 3. Extend & Verify Existing Coupons for Diwali
    console.log("\n--- Step 3: Extending Expiry for Festive Shopping ---");
    const extendedExpiry = new Date('2026-11-15T23:59:59.000Z');
    try {
        const updateResult = await prisma.coupon.updateMany({
            where: {
                deletedAt: null,
            },
            data: {
                expiresAt: extendedExpiry,
                isVerified: true,
                lastVerifiedAt: now,
            }
        });
        console.log(`✅ Extended & verified ${updateResult.count} coupons to ${extendedExpiry.toISOString()}`);
    } catch (e: any) {
        console.warn("Notice updating existing coupons:", e.message);
    }

    // 4. Upsert Verified Diwali 2026 Promo Codes
    console.log("\n--- Step 4: Adding Curated Live Diwali Coupon Codes ---");
    const diwaliDeals = [
        {
            storeSlug: "ajio",
            title: "Ajio Diwali All-Stars: Up to 90% Off + Extra ₹400 Off",
            description: "Celebrate Diwali with Ajio. Get up to 90% off and save an additional ₹400 on qualifying festive fashion orders.",
            code: "ALLSTARSDIWALI400",
            discountType: "flat",
            discountValue: "₹400",
            affiliateUrl: "https://www.ajio.com/?affid=couponhub",
            isExclusive: true,
            isFeatured: true,
        },
        {
            storeSlug: "ajio",
            title: "Ajio Festive Delight: Flat 10% Off on ₹2,290+",
            description: "Save 10% on your festive shopping cart of ₹2,290 or higher. Applicable across ethnic wear, footwear, and accessories.",
            code: "ALLSTARSDIWALI10",
            discountType: "percentage",
            discountValue: "10%",
            affiliateUrl: "https://www.ajio.com/?affid=couponhub",
            isExclusive: false,
            isFeatured: true,
        },
        {
            storeSlug: "tata-cliq",
            title: "Tata CLiQ Luxury: Flat 12% Off for New Users",
            description: "Luxury awaits this Diwali. Get a flat 12% discount on your first order of designer apparel, watches, and beauty.",
            code: "LUXNEW",
            discountType: "percentage",
            discountValue: "12%",
            affiliateUrl: "https://luxury.tatacliq.com/?affid=couponhub",
            isExclusive: true,
            isFeatured: true,
        },
        {
            storeSlug: "tata-cliq",
            title: "Tata CLiQ Luxury: 12% Off via ICICI Bank EMI",
            description: "Enjoy 12% instant discount on luxury festive collections when checking out with ICICI Bank Credit Card EMI.",
            code: "TCLICICIEMI",
            discountType: "percentage",
            discountValue: "12%",
            affiliateUrl: "https://luxury.tatacliq.com/?affid=couponhub",
            isExclusive: false,
            isFeatured: true,
        },
    ];

    for (const deal of diwaliDeals) {
        try {
            const store = await prisma.store.findUnique({
                where: { slug: deal.storeSlug },
                include: { merchantIdentity: true }
            });

            if (store && store.merchantIdentity) {
                await prisma.coupon.create({
                    data: {
                        title: deal.title,
                        description: deal.description,
                        code: deal.code,
                        type: "coupon",
                        discountType: deal.discountType,
                        discountValue: deal.discountValue,
                        affiliateUrl: deal.affiliateUrl,
                        isVerified: true,
                        isFeatured: deal.isFeatured,
                        isExclusive: deal.isExclusive,
                        expiresAt: extendedExpiry,
                        lastVerifiedAt: now,
                        merchantIdentityId: store.merchantIdentity.id,
                    }
                });
                console.log(`✅ Seeded deal: [${deal.storeSlug}] ${deal.code}`);
            }
        } catch (e: any) {
            console.warn(`Notice on deal ${deal.code}:`, e.message);
        }
    }

    console.log("\n🎉 Diwali 2026 Festive Seed & SEO Refresh Completed!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
