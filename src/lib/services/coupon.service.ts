import { couponRepository } from "../repositories/coupon.repository";
import { PublicCoupon } from "../repositories/dtos";

export class CouponService {
  /**
   * Encapsulates the business logic for retrieving a store's public coupons.
   */
  async getStoreCoupons(slug: string): Promise<PublicCoupon[]> {
    return await couponRepository.getPublicCouponsByStoreSlug(slug);
  }

  /**
   * Retrieves globally recent active coupons.
   */
  async getRecentCoupons(limit: number = 20): Promise<PublicCoupon[]> {
    return await couponRepository.getRecentPublicCoupons(limit);
  }

  /**
   * Retrieves curated deals based on user preferences.
   */
  async getCuratedDeals(walletBanks: string[], savedStoreSlugs: string[], limit: number = 6): Promise<PublicCoupon[]> {
    return await couponRepository.getCuratedCoupons(walletBanks, savedStoreSlugs, limit);
  }

  /**
   * Records a user vote for a coupon.
   */
  async voteCoupon(id: string, isSuccess: boolean): Promise<void> {
    return await couponRepository.voteCoupon(id, isSuccess);
  }
}

export const couponService = new CouponService();
