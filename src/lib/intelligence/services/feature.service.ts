import { prisma } from "@/lib/db";
import { Store } from "@prisma/client";

export type MerchantSize = "SMALL" | "MEDIUM" | "LARGE";

export interface FeatureVector {
    categorySlugs: string[];
    merchantSize: MerchantSize;
    searchImpressions: number;
    offerCount: number;
    visitors: number;
    revenue: number;
    contentAssets: number;
    cashbackEnabled: boolean;
    missingFAQ: boolean;
    authority: number; // Proxy derived from metrics
}

export class FeatureExtractionService {
    /**
     * Extracts a standard Feature Vector for a given Merchant.
     */
    async extractFeatures(storeId: string): Promise<FeatureVector | null> {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                storeCategories: {
                    include: { category: true }
                },
                storeContents: true,
            }
        });

        if (!store) return null;

        const categorySlugs = store.storeCategories.map(sc => sc.category.slug);
        const contentAssets = store.storeContents.length;
        const missingFAQ = !store.storeContents.some(c => c.type === "FAQ");
        const cashbackEnabled = !!store.cashbackRate;

        // Composite size calculation
        // This is a naive heuristic: Size Score = Impressions + (Offers * 100) + Visitors + (Revenue * 10) + (Content Assets * 500)
        const sizeScore = store.searchImpressions 
            + (store.offerCount * 100) 
            + store.visitors 
            + (store.revenue * 10) 
            + (contentAssets * 500);

        let merchantSize: MerchantSize = "SMALL";
        if (sizeScore > 50000) merchantSize = "LARGE";
        else if (sizeScore > 5000) merchantSize = "MEDIUM";

        // Proxy authority as log of traffic + impressions
        const authority = Math.min(100, Math.floor(Math.log10(store.visitors + store.searchImpressions + 10) * 10));

        return {
            categorySlugs,
            merchantSize,
            searchImpressions: store.searchImpressions,
            offerCount: store.offerCount,
            visitors: store.visitors,
            revenue: store.revenue,
            contentAssets,
            cashbackEnabled,
            missingFAQ,
            authority
        };
    }
}
