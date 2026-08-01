import { prisma } from "@/lib/db";
import { PublicMerchant } from "./dtos";

export class MerchantRepository {
  /**
   * Retrieves a canonical merchant by slug, returning a Public DTO.
   */
  async getPublicMerchantBySlug(slug: string): Promise<PublicMerchant | null> {
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
  }

  /**
   * Retrieves all featured public merchants.
   */
  async getFeaturedMerchants(limit: number = 10): Promise<PublicMerchant[]> {
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
      isFeatured: store.isFeatured,
      healthScore: store.healthScore,
      contents: [],
      histories: [],
      categories: []
    }));
  }

  /**
   * Retrieves active public stores.
   */
  async getPublicActiveStores(limit: number = 12, excludeStoreId?: string): Promise<PublicMerchant[]> {
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
      isFeatured: store.isFeatured,
      healthScore: store.healthScore,
      contents: [],
      histories: [],
      categories: []
    }));
  }
  /**
   * Retrieves competitors for a given store based on shared categories.
   */
  async getCompetitors(storeId: string, categoryIds: string[], limit: number = 3) {
    if (categoryIds.length === 0) return [];
    
    const competitors = await prisma.store.findMany({
      where: {
        id: { not: storeId },
        isActive: true,
        storeCategories: {
          some: {
            categoryId: { in: categoryIds }
          }
        }
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        cashbackRate: true,
      }
    });

    return competitors.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      logo: c.logo,
      savings: c.cashbackRate ? `${c.cashbackRate} Cashback` : 'Great Deals',
      isBetter: Math.random() > 0.5 // Temporary mock for UI demo
    }));
  }
  /**
   * Retrieves bank offers for a given store.
   */
  async getStoreBankOffers(storeId: string) {
    return prisma.bankOffer.findMany({
      where: {
        storeId,
        isActive: true,
      },
      include: { bank: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Retrieves shopping tips for a given store's categories.
   */
  async getStoreShoppingTips(categoryIds: string[]) {
    if (!categoryIds || categoryIds.length === 0) return [];
    
    // Convert Category IDs to their slugs/names, or assume ShoppingTip uses category names/slugs
    // Need to lookup category names since ShoppingTip uses string `category`
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { name: true, slug: true }
    });
    
    const categoryNames = categories.map(c => c.name);
    const categorySlugs = categories.map(c => c.slug);
    
    return prisma.shoppingTip.findMany({
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
  }
}

export const merchantRepository = new MerchantRepository();
