import { prisma } from "@/lib/db";
import { PublicCoupon } from "./dtos";

export class CouponRepository {
  /**
   * Retrieves active, public coupons for a canonical store slug.
   * Maps Prisma models to the PublicCoupon DTO, hiding internal identity logic.
   */
  async getPublicCouponsByStoreSlug(slug: string): Promise<PublicCoupon[]> {
    const store = await prisma.store.findUnique({
      where: { slug },
      include: { merchantIdentity: true }
    });

    if (!store || !store.merchantIdentity) {
      return [];
    }

    const coupons = await prisma.coupon.findMany({
      where: {
        merchantIdentityId: store.merchantIdentity.id,
        deletedAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: [
        { displayOrder: 'desc' },
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return coupons.map(c => ({
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
    }));
  }

  async getRecentPublicCoupons(limit: number = 20): Promise<PublicCoupon[]> {
    const coupons = await prisma.coupon.findMany({
      where: {
        deletedAt: null,
        merchantIdentity: {
          canonicalStoreId: { not: null }
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        merchantIdentity: {
          include: {
            store: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
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

  async getCuratedCoupons(walletBanks: string[], savedStoreSlugs: string[], limit: number = 6): Promise<PublicCoupon[]> {
    // If no preferences, just return recent coupons
    if (walletBanks.length === 0 && savedStoreSlugs.length === 0) {
      return this.getRecentPublicCoupons(limit);
    }

    const coupons = await prisma.coupon.findMany({
      where: {
        deletedAt: null,
        merchantIdentity: {
          canonicalStoreId: { not: null }
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
        merchantIdentity: {
          include: {
            store: true
          }
        }
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
}

export const couponRepository = new CouponRepository();
