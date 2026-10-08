import 'dotenv/config';
import { prisma } from '../src/lib/db';

const events = [
  {
    slug: "diwali-sale-2026",
    title: "Diwali Sale 2026",
    subtitle: "India's Biggest Festival Shopping Season",
    description: "The Diwali Sale is India's largest shopping event — bigger than Black Friday in India. Get the deepest discounts on fashion, electronics, home decor, and beauty from Amazon, Flipkart, Myntra, Ajio, Nykaa, and 200+ brands. CouponHub curates every verified coupon code and cashback offer so you stack maximum savings this festive season.",
    seoTitle: "Diwali Sale 2026: Best Coupon Codes & Deals | CouponHub",
    date: new Date("2026-10-20T00:00:00Z"),
    icon: "celebration",
    isActive: true,
  },
  {
    slug: "great-indian-festival-2026",
    title: "Amazon Great Indian Festival 2026",
    subtitle: "Amazon's Biggest Annual Sale in India",
    description: "Amazon Great Indian Festival is India's largest online shopping event. Get verified coupon codes, bank card discounts, and exclusive cashback offers on mobiles, laptops, TVs, fashion, kitchen appliances and more. Stack Amazon promo codes with HDFC, SBI, and ICICI card offers for maximum savings.",
    seoTitle: "Amazon Great Indian Festival 2026: Coupon Codes & Bank Offers | CouponHub",
    date: new Date("2026-10-10T00:00:00Z"),
    icon: "local_fire_department",
    isActive: true,
  },
  {
    slug: "big-billion-days-2026",
    title: "Flipkart Big Billion Days 2026",
    subtitle: "Flipkart's Annual Mega Sale Event",
    description: "Flipkart Big Billion Days is the most anticipated sale of the year. Grab verified Flipkart coupon codes, SuperCoin offers, and bank card deals on smartphones, electronics, fashion, and home appliances. CouponHub updates every live Big Billion Days promo code in real time.",
    seoTitle: "Flipkart Big Billion Days 2026: Coupon Codes & Offers | CouponHub",
    date: new Date("2026-10-08T00:00:00Z"),
    icon: "shopping_bag",
    isActive: true,
  },
  {
    slug: "end-of-reason-sale-2026",
    title: "Myntra End of Reason Sale 2026",
    subtitle: "Myntra's Twice-a-Year Fashion Sale",
    description: "Myntra's End of Reason Sale (EORS) is India's biggest fashion sale. Get verified Myntra coupon codes, cashback offers, and bank discounts on clothing, shoes, accessories and beauty from 5,000+ brands. CouponHub lists every working EORS promo code updated daily.",
    seoTitle: "Myntra End of Reason Sale 2026: Coupon Codes & Cashback | CouponHub",
    date: new Date("2026-12-05T00:00:00Z"),
    icon: "style",
    isActive: true,
  },
  {
    slug: "christmas-sale-india-2026",
    title: "Christmas & New Year Sale 2026",
    subtitle: "India's Year-End Shopping Bonanza",
    description: "India's biggest Christmas and New Year sale — brands offer their deepest discounts of the year on electronics, fashion, travel, and entertainment subscriptions. Get verified coupon codes for Amazon, Flipkart, Myntra, MakeMyTrip, Swiggy, Zomato and 100+ brands during the festive season.",
    seoTitle: "Christmas Sale India 2026: Best Coupon Codes & Deals | CouponHub",
    date: new Date("2026-12-25T00:00:00Z"),
    icon: "card_giftcard",
    isActive: true,
  },
];

async function main() {
  console.log(`Seeding ${events.length} sale events...\n`);
  let created = 0;
  let skipped = 0;
  for (const event of events) {
    const existing = await prisma.saleEvent.findUnique({ where: { slug: event.slug } });
    if (existing) {
      // Update if exists
      await prisma.saleEvent.update({ where: { slug: event.slug }, data: event });
      console.log(`📝 Updated: ${event.slug}`);
    } else {
      await prisma.saleEvent.create({ data: event });
      console.log(`✅ Created: ${event.slug} — "${event.title}"`);
      created++;
    }
  }
  console.log(`\n✅ Done! ${created} created, ${skipped} skipped.`);

  // List all active events
  const allEvents = await prisma.saleEvent.findMany({ where: { isActive: true }, select: { slug: true, title: true, date: true } });
  console.log(`\nAll active events (${allEvents.length}):`);
  allEvents.forEach(e => console.log(`  /events/${e.slug} — ${e.title} (${e.date.toDateString()})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
