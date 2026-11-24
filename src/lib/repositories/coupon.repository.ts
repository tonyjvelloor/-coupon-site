import { prisma } from "@/lib/db";
import { PublicCoupon } from "./dtos";
import { cleanCouponCode, rankCoupons, selectDiverseTopCoupons } from "@/lib/coupon-ranking";

export class CouponRepository {
  /**
   * Retrieves active, public coupons for a canonical store slug.
   * Prioritizes unexpired verified offers and ranks them by real value & code presence.
   * Gracefully falls back to top recently-verified store offers if feed expiry dates lag.
   */
  async getPublicCouponsByStoreSlug(slug: string): Promise<PublicCoupon[]> {
    try {
      const store = await prisma.store.findUnique({
        where: { slug },
        include: { merchantIdentity: true }
      });

      if (!store || !store.isActive || !store.merchantIdentity) {
        return [];
      }

      const now = new Date();
      let coupons = await prisma.coupon.findMany({
        where: {
          merchantIdentityId: store.merchantIdentity.id,
          deletedAt: null,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } }
          ]
        },
        orderBy: [
          { displayOrder: 'desc' },
          { isFeatured: 'desc' },
          { qualityScore: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      // Resilience fallback: never show an empty 0-offer page if feed sync lagged past expiry
      if (coupons.length === 0) {
        coupons = await prisma.coupon.findMany({
          where: {
            merchantIdentityId: store.merchantIdentity.id,
            deletedAt: null,
          },
          orderBy: [
            { isFeatured: 'desc' },
            { qualityScore: 'desc' },
            { clicks: 'desc' },
            { createdAt: 'desc' }
          ],
          take: 25
        });
      }

      const mapped: PublicCoupon[] = coupons.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        code: cleanCouponCode(c.code),
        type: c.type,
        discountType: c.discountType,
        discountValue: c.discountValue,
        affiliateUrl: c.affiliateUrl,
        expiresAt: c.expiresAt,
        isVerified: c.isVerified,
        isExclusive: c.isExclusive,
        merchantName: store.name,
        merchantSlug: store.slug,
        merchantLogo: store.logo,
        createdAt: c.createdAt
      }));

      return rankCoupons(mapped);
    } catch (err) {
      console.warn(`[CouponRepository] getPublicCouponsByStoreSlug(${slug}) failed:`, err);
      return [];
    }
  }

  /**
   * Retrieves top-scoring coupons across diverse high-value merchants,
   * highlighting verified promo codes alongside top deals.
   */
  async getBestPublicCoupons(limit: number = 30, maxPerStore: number = 2): Promise<PublicCoupon[]> {
    try {
      const now = new Date();
      const baseWhere = {
        deletedAt: null,
        merchantIdentity: {
          canonicalStoreId: { not: null },
          store: { isActive: true }
        }
      };

      let coupons = await prisma.coupon.findMany({
        where: {
          ...baseWhere,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } }
          ]
        },
        include: {
          merchantIdentity: { include: { store: true } }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { qualityScore: 'desc' },
          { clicks: 'desc' },
          { createdAt: 'desc' }
        ],
        take: Math.max(limit * 4, 120)
      });

      if (coupons.length < limit) {
        const fallback = await prisma.coupon.findMany({
          where: baseWhere,
          include: {
            merchantIdentity: { include: { store: true } }
          },
          orderBy: [
            { isFeatured: 'desc' },
            { qualityScore: 'desc' },
            { clicks: 'desc' },
            { createdAt: 'desc' }
          ],
          take: Math.max(limit * 4, 140)
        });
        const existingIds = new Set(coupons.map(c => c.id));
        for (const item of fallback) {
          if (!existingIds.has(item.id)) coupons.push(item);
        }
      }

      const mapped = coupons
        .filter(c => Boolean(c.merchantIdentity?.store))
        .map(c => {
          const store = c.merchantIdentity.store!;
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            code: cleanCouponCode(c.code),
            type: c.type,
            discountType: c.discountType,
            discountValue: c.discountValue,
            affiliateUrl: c.affiliateUrl,
            expiresAt: c.expiresAt,
            isVerified: c.isVerified,
            isExclusive: c.isExclusive,
            isFeatured: c.isFeatured,
            qualityScore: c.qualityScore,
            clicks: c.clicks,
            merchantName: store.name,
            merchantSlug: store.slug,
            merchantLogo: store.logo,
            createdAt: c.createdAt,
            store,
          };
        });

      return selectDiverseTopCoupons(mapped, limit, maxPerStore);
    } catch (err) {
      console.warn("[CouponRepository] getBestPublicCoupons failed:", err);
      return [];
    }
  }

  async getRecentPublicCoupons(limit: number = 20, excludeStoreId?: string): Promise<PublicCoupon[]> {
    if (!excludeStoreId) {
      return this.getBestPublicCoupons(limit, 2);
    }
    try {
      const coupons = await prisma.coupon.findMany({
        where: {
          deletedAt: null,
          merchantIdentity: {
            canonicalStoreId: { not: excludeStoreId },
            store: { isActive: true }
          },
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        include: {
          merchantIdentity: { include: { store: true } }
        },
        orderBy: [{ isFeatured: 'desc' }, { qualityScore: 'desc' }, { createdAt: 'desc' }],
        take: limit
      });

      return coupons.map(c => {
        const store = c.merchantIdentity.store!;
        return {
          id: c.id,
          title: c.title,
          description: c.description,
          code: cleanCouponCode(c.code),
          type: c.type,
          discountType: c.discountType,
          discountValue: c.discountValue,
          affiliateUrl: c.affiliateUrl,
          expiresAt: c.expiresAt,
          isVerified: c.isVerified,
          isExclusive: c.isExclusive,
          merchantName: store.name,
          merchantSlug: store.slug,
          merchantLogo: store.logo,
          createdAt: c.createdAt
        };
      });
    } catch (err) {
      console.warn("[CouponRepository] getRecentPublicCoupons failed:", err);
      return [];
    }
  }

  async getCuratedCoupons(walletBanks: string[], savedStoreSlugs: string[], limit: number = 6): Promise<PublicCoupon[]> {
    // If no preferences, just return recent coupons
    if (walletBanks.length === 0 && savedStoreSlugs.length === 0) {
      return this.getRecentPublicCoupons(limit);
    }

    const coupons = await prisma.coupon.findMany({
      where: {
        deletedAt: null,
        merchantIdentity: {
          canonicalStoreId: { not: null },
          store: { isActive: true }
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ],
        AND: [
          {
            OR: [
              ...(walletBanks.length > 0 ? [{ bank: { in: walletBanks, mode: 'insensitive' as const } }] : []),
              ...(savedStoreSlugs.length > 0 ? [{ merchantIdentity: { store: { slug: { in: savedStoreSlugs } } } }] : [])
            ]
          }
        ]
      },
      include: {
        merchantIdentity: { include: { store: true } }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return coupons.map(c => {
      const store = c.merchantIdentity.store!;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        code: c.code,
        type: c.type,
        discountType: c.discountType,
        discountValue: c.discountValue,
        affiliateUrl: c.affiliateUrl,
        expiresAt: c.expiresAt,
        isVerified: c.isVerified,
        isExclusive: c.isExclusive,
        merchantName: store.name,
        merchantSlug: store.slug,
        merchantLogo: store.logo,
        createdAt: c.createdAt
      };
    });
  }

  async getTrendingCoupons(excludeStoreId?: string, limit: number = 6): Promise<PublicCoupon[]> {
    const coupons = await prisma.coupon.findMany({
      where: {
        deletedAt: null,
        merchantIdentity: {
          canonicalStoreId: excludeStoreId ? { not: excludeStoreId } : { not: null },
          store: { isActive: true }
        }
      },
      orderBy: { usageCount: 'desc' },
      take: limit,
      include: { merchantIdentity: { include: { store: true } } }
    });

    return coupons.map(c => {
      const store = c.merchantIdentity.store!;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        code: c.code,
        type: c.type,
        discountType: c.discountType,
        discountValue: c.discountValue,
        affiliateUrl: c.affiliateUrl,
        expiresAt: c.expiresAt,
        isVerified: c.isVerified,
        isExclusive: c.isExclusive,
        merchantName: store.name,
        merchantSlug: store.slug,
        merchantLogo: store.logo,
        createdAt: c.createdAt
      };
    });
  }

  async getExpiringCoupons(excludeStoreId?: string, limit: number = 6): Promise<PublicCoupon[]> {
    const coupons = await prisma.coupon.findMany({
      where: {
        deletedAt: null,
        expiresAt: { not: null, gt: new Date() },
        merchantIdentity: {
          canonicalStoreId: excludeStoreId ? { not: excludeStoreId } : { not: null },
          store: { isActive: true }
        }
      },
      orderBy: { expiresAt: 'asc' },
      take: limit,
      include: { merchantIdentity: { include: { store: true } } }
    });

    return coupons.map(c => {
      const store = c.merchantIdentity.store!;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        code: c.code,
        type: c.type,
        discountType: c.discountType,
        discountValue: c.discountValue,
        affiliateUrl: c.affiliateUrl,
        expiresAt: c.expiresAt,
        isVerified: c.isVerified,
        isExclusive: c.isExclusive,
        merchantName: store.name,
        merchantSlug: store.slug,
        merchantLogo: store.logo,
        createdAt: c.createdAt
      };
    });
  }

  async voteCoupon(id: string, isSuccess: boolean): Promise<void> {
    const incrementField = isSuccess ? 'successCount' : 'failureCount';
    await prisma.coupon.update({
      where: { id },
      data: {
        [incrementField]: {
          increment: 1
        }
      }
    });
  }
}

export const couponRepository = new CouponRepository();
