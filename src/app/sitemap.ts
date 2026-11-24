import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllSaleEvents } from "@/lib/events-data";
import { contentSplitService } from "@/lib/services/content-split.service";
import { getSiteUrl, isStoreSubpageIndexable, MIN_STORE_OFFERS_FOR_SUBPAGES } from "@/lib/seo-utils";
import { CURATED_COMPARE_PAIRS } from "@/lib/compare-pairs";
import {
    FALLBACK_BANK_OFFERS,
    FALLBACK_BANKS,
    FALLBACK_CATEGORIES,
    FALLBACK_COLLECTIONS,
    FALLBACK_STORES,
} from "@/lib/fallback-catalog";

export const revalidate = 43200; // 12h cache so crawler sitemap fetches don't wake Neon Free compute

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();

    // 1. Static Routes
    const staticRoutes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/best-offers`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.95,
        },
        {
            url: `${baseUrl}/stores`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.85,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/events`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.85,
        },
        {
            url: `${baseUrl}/html-sitemap`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/compare`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
        },
        {
            url: `${baseUrl}/tools`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools/card-finder`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tools/discount-calculator`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools/card-vs-cashback-calculator`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85,
        },
    ];

    // 2. Dynamic Store Routes
    const storeRoutes: MetadataRoute.Sitemap = [];
    try {
        const stores = await prisma.store.findMany({
            where: { 
                isActive: true,
                activeOfferCount: { gt: 0 }
            },
            select: { 
                slug: true, 
                updatedAt: true,
                activeOfferCount: true,
                storeContents: {
                    select: {
                        type: true,
                        content: true,
                        updatedAt: true
                    }
                }
            },
        });
        
        stores.forEach((store) => {
            // Root store page
            storeRoutes.push({
                url: `${baseUrl}/stores/${store.slug}`,
                lastModified: store.updatedAt,
                changeFrequency: "daily" as const,
                priority: store.activeOfferCount >= MIN_STORE_OFFERS_FOR_SUBPAGES ? 0.9 : 0.75,
            });

            // Only include deep subpages for stores with real demand to preserve crawl budget
            // and match actual page split thresholds (avoiding 307 redirects in sitemap)
            if (store.activeOfferCount < MIN_STORE_OFFERS_FOR_SUBPAGES) {
                return;
            }

            const getContent = (type: string) => store.storeContents.find(c => c.type === type)?.content;

            if (contentSplitService.shouldSplitGuide(getContent('BUYING_GUIDE'))) {
                storeRoutes.push({ url: `${baseUrl}/stores/${store.slug}/buying-guide`, lastModified: store.updatedAt, changeFrequency: "weekly", priority: 0.6 });
            }
            if (contentSplitService.shouldSplitFaq(getContent('FAQ'))) {
                storeRoutes.push({ url: `${baseUrl}/stores/${store.slug}/faq`, lastModified: store.updatedAt, changeFrequency: "weekly", priority: 0.6 });
            }
            if (isStoreSubpageIndexable(store.activeOfferCount, getContent('RETURNS'))) {
                storeRoutes.push({ url: `${baseUrl}/stores/${store.slug}/returns`, lastModified: store.updatedAt, changeFrequency: "weekly", priority: 0.5 });
            }
            if (isStoreSubpageIndexable(store.activeOfferCount, getContent('SHIPPING'))) {
                storeRoutes.push({ url: `${baseUrl}/stores/${store.slug}/shipping`, lastModified: store.updatedAt, changeFrequency: "weekly", priority: 0.5 });
            }
            if (isStoreSubpageIndexable(store.activeOfferCount, getContent('STUDENT'), 50)) {
                storeRoutes.push({ url: `${baseUrl}/stores/${store.slug}/student-discount`, lastModified: store.updatedAt, changeFrequency: "monthly", priority: 0.7 });
            }
        });
    } catch (e) {
        console.warn("[sitemap] Failed to fetch stores, using fallback catalog:", e);
    }

    if (storeRoutes.length === 0) {
        FALLBACK_STORES.forEach((store) => {
            storeRoutes.push({
                url: `${baseUrl}/stores/${store.slug}`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: store.isFeatured ? 0.9 : 0.8,
            });
        });
    }

    // 3. Dynamic Bank Routes (India Bank & Card SEO)
    const bankRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/banks`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
    ];
    try {
        const banks = await prisma.bank.findMany({
            where: { isActive: true },
            select: {
                slug: true,
                updatedAt: true,
                _count: { select: { bankOffers: { where: { isActive: true } } } },
            },
        });

        banks
            .filter((b) => b._count.bankOffers > 0)
            .forEach((bank) => {
                bankRoutes.push({
                    url: `${baseUrl}/banks/${bank.slug}`,
                    lastModified: bank.updatedAt,
                    changeFrequency: "daily" as const,
                    priority: 0.8,
                });
            });
        
        // 3.5 Dynamic Bank x Store Routes
        const bankOffers = await prisma.bankOffer.findMany({
            where: { isActive: true, storeId: { not: null } },
            include: { bank: true, store: true }
        });

        bankOffers.forEach((offer) => {
            if (offer.store) {
                bankRoutes.push({
                    url: `${baseUrl}/banks/${offer.bank.slug}/${offer.store.slug}`,
                    lastModified: offer.updatedAt,
                    changeFrequency: "weekly",
                    priority: 0.7,
                });
            }
        });
    } catch (e) {
        console.warn("[sitemap] Failed to fetch bank routes, using fallback catalog:", e);
    }

    if (bankRoutes.length <= 1) {
        FALLBACK_BANKS.forEach((bank) => {
            bankRoutes.push({
                url: `${baseUrl}/banks/${bank.slug}`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.8,
            });
        });
        const seenPairs = new Set<string>();
        FALLBACK_BANK_OFFERS.forEach((offer) => {
            const pairKey = `${offer.bankSlug}/${offer.storeSlug}`;
            if (seenPairs.has(pairKey)) return;
            seenPairs.add(pairKey);
            bankRoutes.push({
                url: `${baseUrl}/banks/${offer.bankSlug}/${offer.storeSlug}`,
                lastModified: new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.75,
            });
        });
    }

    // 3. Dynamic Category Routes (Programmatic SEO with Quality Gates)
    const categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            select: { 
                slug: true, 
                updatedAt: true,
                storeCategories: {
                    select: {
                        store: {
                            select: {
                                merchantIdentity: {
                                    select: {
                                        coupons: {
                                            where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
                                            select: { id: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        categories.forEach((category) => {
            const activeStores = category.storeCategories.length;
            let activeOffers = 0;
            category.storeCategories.forEach(sc => {
                if (sc.store.merchantIdentity) {
                    activeOffers += sc.store.merchantIdentity.coupons.length;
                }
            });
            
            // SEO State Machine: Indexable Threshold
            if (activeStores >= 1 && activeOffers >= 1) {
                categoryRoutes.push({
                    url: `${baseUrl}/best/${category.slug}-coupons`,
                    lastModified: category.updatedAt,
                    changeFrequency: "daily" as const,
                    priority: 0.8,
                });
            }
        });
    } catch (e) {
        console.warn("[sitemap] Failed to fetch category routes, using fallback catalog:", e);
    }

    if (categoryRoutes.length === 0) {
        FALLBACK_CATEGORIES.forEach((category) => {
            categoryRoutes.push({
                url: `${baseUrl}/best/${category.slug}-coupons`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.8,
            });
        });
    }

    // 4. Dynamic Blog Routes
    let blogPosts: any[] = [];
    try {
        blogPosts = await getAllBlogPosts();
    } catch (e) {
        // Fallback handled in helper
    }

    const blogRoutes = blogPosts.map((post) => {
        const isSeasonal = /diwali|festival|black-friday|pink-friday|cyber-monday|eors/.test(post.slug);
        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.publishedAt || new Date(),
            changeFrequency: isSeasonal ? ("daily" as const) : ("weekly" as const),
            priority: isSeasonal ? 0.9 : 0.7,
        };
    });

    // 5. Dynamic Collection Routes (Programmatic SEO)
    const collectionRoutes: MetadataRoute.Sitemap = [];
    try {
        const collections = await prisma.collection.findMany({
            where: { isIndexable: true },
            select: { slug: true, updatedAt: true },
        });

        collections.forEach((col) => {
            collectionRoutes.push({
                url: `${baseUrl}/offers/${col.slug}`,
                lastModified: col.updatedAt,
                changeFrequency: "daily" as const,
                priority: 0.8,
            });
        });
    } catch (e) {
        console.warn("[sitemap] Failed to fetch collection routes, using fallback catalog:", e);
    }

    if (collectionRoutes.length === 0) {
        FALLBACK_COLLECTIONS.forEach((col) => {
            collectionRoutes.push({
                url: `${baseUrl}/offers/${col.slug}`,
                lastModified: new Date(),
                changeFrequency: "daily" as const,
                priority: 0.8,
            });
        });
    }

    // 6. Curated Compare Routes (High-Intent Store vs Store)
    const compareRoutes: MetadataRoute.Sitemap = CURATED_COMPARE_PAIRS.map((pair) => ({
        url: `${baseUrl}/compare/${pair.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
    }));

    // 7. Dynamic Sale Event Routes (Diwali, Prime Day, etc.)
    let saleEvents: any[] = [];
    try {
        saleEvents = await getAllSaleEvents();
    } catch (e) {
        // Fallback handled in helper
    }

    const eventRoutes = saleEvents.map((evt) => {
        const isHotSeasonal = /diwali|indian-festival|black-friday|pink-friday|cyber-monday|end-of-reason/.test(evt.slug);
        return {
            url: `${baseUrl}/events/${evt.slug}`,
            lastModified: evt.date || new Date(),
            changeFrequency: isHotSeasonal ? ("daily" as const) : ("weekly" as const),
            priority: isHotSeasonal ? 0.95 : 0.85,
        };
    });

    return [...staticRoutes, ...storeRoutes, ...bankRoutes, ...categoryRoutes, ...blogRoutes, ...collectionRoutes, ...compareRoutes, ...eventRoutes];
}
