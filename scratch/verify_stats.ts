import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function verify() {
  const now = new Date();
  const total = await prisma.coupon.count();
  const active = await prisma.coupon.count({
    where: {
      deletedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }]
    }
  });
  const verified = await prisma.coupon.count({
    where: { isVerified: true, deletedAt: null }
  });
  const storesWithOffers = await prisma.store.count({
    where: { activeOfferCount: { gt: 0 } }
  });
  const totalStores = await prisma.store.count();
  
  console.log(JSON.stringify({
    totalCoupons: total,
    activeCoupons: active,
    verifiedCoupons: verified,
    storesWithActiveOffers: storesWithOffers,
    totalStores: totalStores
  }, null, 2));
}

verify().finally(() => prisma.$disconnect());
