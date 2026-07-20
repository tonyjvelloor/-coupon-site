import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function fix() {
  const stores = await prisma.store.findMany({
    include: {
      merchantIdentity: {
        include: { coupons: true }
      }
    }
  });

  console.log(`Found ${stores.length} stores.`);
  let updated = 0;

  for (const store of stores) {
    const couponCount = store.merchantIdentity?.coupons.length || 0;
    
    const oldCouponsCount = await prisma.coupon.count({
      where: { merchantIdentity: { canonicalStoreId: store.id } }
    });

    if (store.offerCount !== oldCouponsCount || store.activeOfferCount !== oldCouponsCount) {
      await prisma.store.update({
        where: { id: store.id },
        data: { 
          offerCount: oldCouponsCount,
          activeOfferCount: oldCouponsCount
        }
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} stores with correct offer counts.`);
  
  // Link stores to a random category if they don't have one
  const categories = await prisma.category.findMany();
  const unlinkedStores = await prisma.store.findMany({
    where: { storeCategories: { none: {} } }
  });

  console.log(`Found ${unlinkedStores.length} stores with no categories.`);
  for (const store of unlinkedStores) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (randomCategory) {
      await prisma.storeCategory.create({
        data: {
          storeId: store.id,
          categoryId: randomCategory.id
        }
      });
    }
  }
  
  console.log(`Assigned categories to ${unlinkedStores.length} stores.`);

  const coupons = await prisma.coupon.count();
  console.log(`Total coupons in DB: ${coupons}`);
}

fix();
