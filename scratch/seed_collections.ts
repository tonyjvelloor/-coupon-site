import 'dotenv/config';
import { prisma } from '../src/lib/db';

const collections = [
  {
    slug: "new-user-coupons",
    name: "First Order & New User Coupons",
    content: "Exclusive sign-up and first order discount codes for new users.",
    seoTitle: "New User & First Order Coupons (Flat Discounts) | CouponHub",
    seoDescription: "Verified sign-up bonuses, first order promo codes, and new user discounts for Swiggy, Zomato, Amazon, Myntra, and top Indian brands.",
    type: "new_user",
    isIndexable: true,
  },
  {
    slug: "free-shipping-codes",
    name: "Free Shipping Promo Codes",
    content: "Get free delivery on your online orders with these working free shipping coupons.",
    seoTitle: "Free Shipping Promo Codes & Vouchers in India | CouponHub",
    seoDescription: "Never pay for delivery again. Find 100% verified free shipping coupon codes and zero delivery fee offers for all your favorite stores.",
    type: "shipping",
    isIndexable: true,
  },
  {
    slug: "bogo-deals",
    name: "Buy 1 Get 1 Free Offers",
    content: "Double your savings with active Buy 1 Get 1 (BOGO) deals and multi-pack discounts.",
    seoTitle: "Buy 1 Get 1 Free (BOGO) Offers & Coupons | CouponHub",
    seoDescription: "The best BOGO (Buy 1 Get 1 Free) deals, 2-for-1 offers, and combo discounts across fashion, beauty, and food delivery in India.",
    type: "bogo",
    isIndexable: true,
  },
  {
    slug: "flight-coupons",
    name: "Flight Booking Discount Codes",
    content: "Save big on domestic and international flight bookings.",
    seoTitle: "Flight Coupons & Promo Codes (Verified) | CouponHub",
    seoDescription: "Get the latest flight promo codes and instant bank discounts for MakeMyTrip, Cleartrip, Indigo, Air India, and Goibibo. Travel for less.",
    type: "travel",
    isIndexable: true,
  }
];

async function main() {
  console.log(`Seeding ${collections.length} collections...\n`);
  
  for (const col of collections) {
    const existing = await prisma.collection.findUnique({ where: { slug: col.slug } });
    if (existing) {
      await prisma.collection.update({ where: { slug: col.slug }, data: col });
      console.log(`📝 Updated: ${col.slug}`);
    } else {
      await prisma.collection.create({ data: col });
      console.log(`✅ Created: ${col.slug}`);
    }
  }
  
  // Now link top coupons to these collections based on keywords
  // 1. New User
  const newCoupons = await prisma.coupon.findMany({
      where: { OR: [{ title: { contains: "first" } }, { title: { contains: "new user" } }] },
      take: 20
  });
  if (newCoupons.length > 0) {
      const col = await prisma.collection.findUnique({ where: { slug: "new-user-coupons" } });
      for (const c of newCoupons) {
          await prisma.coupon.update({
              where: { id: c.id },
              data: { collections: { connect: { id: col!.id } } }
          });
      }
      console.log(`Linked ${newCoupons.length} coupons to new-user-coupons`);
  }

  // 2. Free Shipping
  const shippingCoupons = await prisma.coupon.findMany({
      where: { title: { contains: "free shipping" } },
      take: 20
  });
  if (shippingCoupons.length > 0) {
      const col = await prisma.collection.findUnique({ where: { slug: "free-shipping-codes" } });
      for (const c of shippingCoupons) {
          await prisma.coupon.update({
              where: { id: c.id },
              data: { collections: { connect: { id: col!.id } } }
          });
      }
      console.log(`Linked ${shippingCoupons.length} coupons to free-shipping-codes`);
  }

  console.log(`\n✅ Done!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
