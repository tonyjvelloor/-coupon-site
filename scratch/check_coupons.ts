import "dotenv/config";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const count = await prisma.coupon.count();
  console.log(`Total coupons in DB: ${count}`);

  const activeCount = await prisma.coupon.count({
    where: { status: 'ACTIVE' }
  });
  console.log(`Active coupons in DB: ${activeCount}`);

  const stores = await prisma.store.findMany({
    take: 5,
    include: {
      merchantIdentity: {
        include: {
          coupons: true
        }
      }
    }
  });

  console.log('Sample Stores:');
  for (const store of stores) {
    console.log(`- ${store.name}: ${store.merchantIdentity?.coupons.length || 0} coupons, activeOfferCount: ${store.activeOfferCount}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
