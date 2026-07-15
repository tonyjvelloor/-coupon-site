import { merchantRepository } from "../repositories/merchant.repository";
import { PublicMerchant } from "../repositories/dtos";
import { prisma } from "@/lib/db";

export class MerchantService {
  /**
   * Retrieves a public merchant by its slug.
   * Encapsulates any business rules required before returning to the frontend.
   */
  async getMerchantBySlug(slug: string): Promise<PublicMerchant | null> {
    const merchant = await merchantRepository.getPublicMerchantBySlug(slug);
    
    // Future business rules can be added here
    // e.g. checking if merchant is soft-banned, has active fraud alerts, etc.
    
    return merchant;
  }

  async getFeaturedMerchants(limit: number = 10): Promise<PublicMerchant[]> {
    return await merchantRepository.getFeaturedMerchants(limit);
  }

  async getCompetitors(storeId: string, categoryIds: string[], limit: number = 3) {
    return await merchantRepository.getCompetitors(storeId, categoryIds, limit);
  }

  /**
   * Retrieves all active store slugs for static generation.
   */
  async getAllStoreSlugs(): Promise<{ slug: string }[]> {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: { slug: true }
    });
    return stores;
  }
}

export const merchantService = new MerchantService();
