import { prisma } from "@/lib/db";
import { PublicMerchant } from "./dtos";
import {
  FALLBACK_STORES,
  getFallbackBankOffersForStore,
  getFallbackCompetitors,
  getFallbackMerchantBySlug,
} from "@/lib/fallback-catalog";

export class MerchantRepository {
  /**
   * Retrieves a canonical merchant by slug, returning a Public DTO.
   */
  async getPublicMerchantBySlug(slug: string): Promise<PublicMerchant | null> {
    try {
      const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: {
          storeContents: true,
          merchantHistories: true,
          storeCategories: { include: { category: true } }
        }
      });

      if (!store) {
        return null;
      }

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        seoTitle: store.seoTitle,
        seoDescription: store.seoDescription,
        logo: store.logo,
        website: store.website,
        cashbackRate: store.cashbackRate,
        cashbackType: store.cashbackType,
        offerCount: store.offerCount,
        activeOfferCount: store.activeOfferCount,
        isFeatured: store.isFeatured,
        healthScore: store.healthScore,
        contents: store.storeContents.map(c => ({
          id: c.id,
          type: c.type,
          content: c.content,
          updatedAt: c.updatedAt
        })),
        histories: store.merchantHistories.map(h => ({
          id: h.id,
          title: h.title,
          type: h.type,
          date: h.date
        })),
        categories: store.storeCategories.map(sc => ({
          id: sc.category.id,
          name: sc.category.name,
          slug: sc.category.slug
        }))
      };
    } catch (err) {
      console.warn(`[MerchantRepository] getPublicMerchantBySlug(${slug}) failed, checking fallback:`, err);
      return getFallbackMerchantBySlug(slug);
    }
  }

  /**
   * Retrieves all featured public merchants.
   */
  async getFeaturedMerchants(limit: number = 10): Promise<PublicMerchant[]> {
    try {
      const stores = await prisma.store.findMany({
        where: {
          isActive: true,
          isFeatured: true
        },
        orderBy: { offerCount: 'desc' },
        take: limit
      });

      return stores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        seoTitle: store.seoTitle,
        seoDescription: store.seoDescription,
        logo: store.logo,
        website: store.website,
        cashbackRate: store.cashbackRate,
        cashbackType: store.cashbackType,
        offerCount: store.offerCount,
        activeOfferCount: store.activeOfferCount,
        isFeatured: store.isFeatured,
        healthScore: store.healthScore,
        contents: [],
        histories: [],
        categories: []
      }));
    } catch (err) {
      console.warn("[MerchantRepository] getFeaturedMerchants failed, using fallback:", err);
      return FALLBACK_STORES.filter((s) => s.isFeatured)
        .slice(0, limit)
        .map((s) => getFallbackMerchantBySlug(s.slug)!)
        .filter(Boolean);
    }
  }

  /**
   * Retrieves active public stores.
   */
  async getPublicActiveStores(limit: number = 12, excludeStoreId?: string): Promise<PublicMerchant[]> {
    try {
      const stores = await prisma.store.findMany({
        where: {
          isActive: true,
          ...(excludeStoreId ? { id: { not: excludeStoreId } } : {})
        },
        orderBy: { offerCount: 'desc' },
        take: limit
      });

      return stores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        seoTitle: store.seoTitle,
        seoDescription: store.seoDescription,
        logo: store.logo,
        website: store.website,
        cashbackRate: store.cashbackRate,
        cashbackType: store.cashbackType,
        offerCount: store.offerCount,
        activeOfferCount: store.activeOfferCount,
        isFeatured: store.isFeatured,
        healthScore: store.healthScore,
        contents: [],
        histories: [],
        categories: []
      }));
    } catch (err) {
      console.warn("[MerchantRepository] getPublicActiveStores failed, using fallback:", err);
      return FALLBACK_STORES.filter((s) => !excludeStoreId || s.id !== excludeStoreId)
        .slice(0, limit)
        .map((s) => getFallbackMerchantBySlug(s.slug)!)
        .filter(Boolean);
    }
  }
  /**
   * Retrieves competitors for a given store based on shared categories.
   */
  async getCompetitors(storeId: string, categoryIds: string[], limit: number = 6) {
    if (categoryIds.length === 0) return [];
    
    try {
      const competitors = await prisma.store.findMany({
        where: {
          id: { not: storeId },
          isActive: true,
          activeOfferCount: { gt: 0 },
          storeCategories: {
            some: {
              categoryId: { in: categoryIds }
            }
          }
        },
        // Sort by most active (offers) then cashback to surface highest-value stores
        orderBy: [
          { activeOfferCount: 'desc' },
        ],
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          cashbackRate: true,
          activeOfferCount: true,
        }
      });

      return competitors.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        logo: c.logo,
        savings: c.cashbackRate ? `${c.cashbackRate} Cashback` : `${c.activeOfferCount} Offers`,
        isBetter: false
      }));
    } catch (err) {
      console.warn(`[MerchantRepository] getCompetitors(${storeId}) failed, using fallback:`, err);
      return getFallbackCompetitors(storeId, categoryIds, limit);
    }
  }

  /**
   * Retrieves bank offers for a given store.
   */
  async getStoreBankOffers(storeId: string) {
    try {
      return await prisma.bankOffer.findMany({
        where: {
          storeId,
          isActive: true,
        },
        include: { bank: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (err) {
      console.warn(`[MerchantRepository] getStoreBankOffers(${storeId}) failed, using fallback:`, err);
      return getFallbackBankOffersForStore(storeId);
    }
  }

  /**
   * Retrieves shopping tips for a given store's categories.
   */
  async getStoreShoppingTips(categoryIds: string[]) {
    if (!categoryIds || categoryIds.length === 0) return [];
    
    try {
      // Convert Category IDs to their slugs/names, or assume ShoppingTip uses category names/slugs
      // Need to lookup category names since ShoppingTip uses string `category`
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { name: true, slug: true }
      });
      
      const categoryNames = categories.map(c => c.name);
      const categorySlugs = categories.map(c => c.slug);
      
      return await prisma.shoppingTip.findMany({
        where: {
          isActive: true,
          OR: [
            { category: { in: categoryNames } },
            { category: { in: categorySlugs } },
            { category: 'general' }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (err) {
      console.warn("[MerchantRepository] getStoreShoppingTips failed, returning empty:", err);
      return [];
    }
  }
}

export const merchantRepository = new MerchantRepository();
