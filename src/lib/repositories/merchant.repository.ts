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
        name: true,
        slug: true,
        cashbackRate: true,
      }
    });

    return competitors.map(c => ({
      name: c.name,
      slug: c.slug,
      savings: c.cashbackRate ? `${c.cashbackRate} Cashback` : 'Great Deals',
      isBetter: Math.random() > 0.5 // Temporary mock for UI demo
    }));
  }
}

export const merchantRepository = new MerchantRepository();
