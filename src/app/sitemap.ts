import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    // 1. Static Routes
    const staticRoutes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/stores`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/html-sitemap`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.5,
        },
    ];

    // 2. Dynamic Store Routes
    const stores = await prisma.store.findMany({
        where: { 
            isActive: true,
            activeOfferCount: { gt: 0 }
        },
        select: { 
            slug: true, 
            updatedAt: true,
            storeContents: {
                select: {
                    type: true,
                    updatedAt: true
                }
            }
        },
    });

    const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
        url: `${baseUrl}/stores/${store.slug}`,
        lastModified: store.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.9,
    }));

    // 3. Dynamic Bank Routes (India Bank & Card SEO)
    const banks = await prisma.bank.findMany({
        where: { isActive: true },
        select: {
            slug: true,
            updatedAt: true,
            _count: { select: { bankOffers: { where: { isActive: true } } } },
        },
    });

    const bankRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/banks`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        ...banks
            .filter((b) => b._count.bankOffers > 0)
            .map((bank) => ({
                url: `${baseUrl}/banks/${bank.slug}`,
                lastModified: bank.updatedAt,
                changeFrequency: "daily" as const,
                priority: 0.8,
            })),
    ];

    // 3. Dynamic Category Routes (Programmatic SEO with Quality Gates)
    // Only index categories that have enough inventory to be valuable to users
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

    const categoryRoutes: MetadataRoute.Sitemap = [];
    
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

    // 4. Dynamic Blog Routes
    const blogPosts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
    });

    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    // 5. Dynamic Collection Routes (Programmatic SEO)
    const collections = await prisma.collection.findMany({
        where: { isIndexable: true },
        select: { slug: true, updatedAt: true },
    });

    const collectionRoutes = collections.map((col) => ({
        url: `${baseUrl}/offers/${col.slug}`,
        lastModified: col.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
    }));

    // 6. Dynamic Compare Routes (Programmatic SEO: Store vs Store)
    const topStores = await prisma.store.findMany({
        where: { isActive: true, activeOfferCount: { gt: 10 } },
        select: { slug: true, updatedAt: true, storeCategories: { select: { categoryId: true } } },
        orderBy: { activeOfferCount: 'desc' },
        take: 50 // Limit to top 50 stores to prevent quadratic explosion (50 * 50 = ~1,225 pairs max)
    });

    const compareRoutes: MetadataRoute.Sitemap = [];
    
    for (let i = 0; i < topStores.length; i++) {
        for (let j = i + 1; j < topStores.length; j++) {
            const storeA = topStores[i];
            const storeB = topStores[j];
            // Only generate comparison if they share a category
            const sharesCategory = storeA.storeCategories.some(c1 => 
                storeB.storeCategories.some(c2 => c1.categoryId === c2.categoryId)
            );
            if (sharesCategory) {
                // Ensure alphabetical order to avoid duplicate reverse pages
                const [slug1, slug2] = [storeA.slug, storeB.slug].sort();
                // Use the most recent update time
                const lastModified = storeA.updatedAt > storeB.updatedAt ? storeA.updatedAt : storeB.updatedAt;
                
                compareRoutes.push({
                    url: `${baseUrl}/compare/${slug1}-vs-${slug2}`,
                    lastModified,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                });
            }
        }
    }

    return [...staticRoutes, ...storeRoutes, ...bankRoutes, ...categoryRoutes, ...blogRoutes, ...collectionRoutes, ...compareRoutes];
}
