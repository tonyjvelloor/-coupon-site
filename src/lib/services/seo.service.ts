import { prisma } from "@/lib/db";

export class SeoService {
    /**
     * Calculate and update the health score for a specific store.
     */
    async calculateStoreHealthScore(storeId: string): Promise<number> {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                storeContents: true,
                merchantIdentity: { include: { coupons: true } },
                storeCategories: true,
            }
        });

        if (!store) return 0;

        let score = 0;

        // 1. Basic Metadata (20 pts)
        if (store.seoTitle) score += 10;
        if (store.seoDescription) score += 10;

        // 2. Branding (10 pts)
        if (store.logo) score += 10;

        // 3. Content / FAQ / Guides (30 pts)
        if (store.storeContents && store.storeContents.length > 0) {
            score += 15; // Has some content
            if (store.storeContents.some(c => c.type === 'FAQ' || c.type === 'GUIDE')) {
                score += 15; // Has rich content
            }
        }

        // 4. Offers (30 pts)
        const activeOffers = store.merchantIdentity?.coupons?.filter(c => !c.deletedAt && (!c.expiresAt || c.expiresAt > new Date())) || [];
        if (activeOffers.length > 0) {
            score += 15; // Has active offers
            if (activeOffers.length >= 5) {
                score += 15; // High offer density
            }
        }

        // 5. Taxonomy (10 pts)
        if (store.storeCategories && store.storeCategories.length > 0) {
            score += 10;
        }

        // Update the store with the calculated score
        await prisma.store.update({
            where: { id: storeId },
            data: { healthScore: score }
        });

        return score;
    }

    /**
     * Returns an overview of SEO issues across the entire platform.
     */
    async getPlatformSeoHealth() {
        const [
            totalStores,
            missingSeoMeta,
            missingLogos,
            missingCategories,
            inactiveStores,
            orphanedStores
        ] = await Promise.all([
            prisma.store.count(),
            prisma.store.count({
                where: { OR: [{ seoTitle: null }, { seoDescription: null }] }
            }),
            prisma.store.count({ where: { logo: null } }),
            prisma.store.count({ where: { storeCategories: { none: {} } } }),
            prisma.store.count({ where: { isActive: false } }),
            prisma.store.count({
                where: {
                    AND: [
                        { storeCategories: { none: {} } }, // Not linked in any category
                        { isFeatured: false } // Not featured on homepage
                    ]
                }
            })
        ]);

        return {
            totalStores,
            issues: {
                missingSeoMeta,
                missingLogos,
                missingCategories,
                inactiveStores,
                orphanedStores
            }
        };
    }
}

export const seoService = new SeoService();
