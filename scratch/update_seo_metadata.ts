import 'dotenv/config';
import { prisma } from '../src/lib/db';

const monthYear = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date());

const updates = [
  { slug: "off-duty", seoTitle: `Off-Duty Coupon Code: 15% OFF + Free Shipping – ${monthYear} | CouponHub`, seoDescription: `Save 15% OFF on Off-Duty India baggy jeans, cargos & streetwear. Use WELCOME10 for 10% OFF on first order. Free shipping on orders above Rs.999. 4 verified deals updated today.` },
  { slug: "wellbeing-nutrition", seoTitle: `Wellbeing Nutrition Coupon Code: Up to 19.5% Cashback – ${monthYear} | CouponHub`, seoDescription: `Get up to 19.5% cashback + exclusive discount codes on Wellbeing Nutrition protein, multivitamins & supplements. 37 verified deals updated daily.` },
  { slug: "the-derma-co", seoTitle: `The Derma Co Coupon Code: 20% OFF Skincare – ${monthYear} | CouponHub`, seoDescription: `Grab 20.25% cashback + promo codes on The Derma Co serums, sunscreens & acne treatments. 14 verified deals for Indian skincare shoppers.` },
  { slug: "plum-goodness", seoTitle: `Plum Goodness Coupon Code: 15% Cashback – ${monthYear} | CouponHub`, seoDescription: `Save 15% cashback + verified discount codes on Plum Goodness skincare, lip care & hair care. 10 active deals — 100% vegan, 100% verified.` },
  { slug: "lets-beco", seoTitle: `Lets Beco Coupon Code: 15% Cashback on Eco Products – ${monthYear} | CouponHub`, seoDescription: `Get 15% cashback + discount codes on Lets Beco bamboo & sustainable products. 11 verified eco-friendly deals. Switch to sustainable living and save.` },
  { slug: "khadi-natural", seoTitle: `Khadi Natural Coupon Code: 13.5% OFF Herbal Products – ${monthYear} | CouponHub`, seoDescription: `Save 13.5% cashback + promo codes on Khadi Natural herbal skincare, hair oils & soaps. 15 verified Ayurvedic product deals. Trusted Indian brand.` },
  { slug: "bella-vita", seoTitle: `Bella Vita Coupon Code: 12% Cashback on Perfumes – ${monthYear} | CouponHub`, seoDescription: `Get 12% cashback + promo codes on Bella Vita Organic perfumes, body mists & skincare. 21 verified deals — premium Indian fragrances at best price.` },
  { slug: "campus-shoes", seoTitle: `Campus Shoes Coupon Code: 11% Cashback + Deals – ${monthYear} | CouponHub`, seoDescription: `Save 11.25% cashback + discount codes on Campus Shoes for men, women & kids. 12 verified deals on running shoes, sneakers & sports footwear.` },
  { slug: "the-man-company", seoTitle: `The Man Company Coupon Code: 11% OFF Grooming – ${monthYear} | CouponHub`, seoDescription: `Get 11.25% cashback + promo codes on The Man Company beard oil, face wash & grooming kits. 16 verified men's grooming deals at best price.` },
  { slug: "gharsoaps", seoTitle: `GharSoaps Coupon Code: 11.25% Cashback – ${monthYear} | CouponHub`, seoDescription: `Save 11.25% cashback + discount codes on GharSoaps handmade soaps, bath bombs & skincare. 18 verified artisan beauty deals. Ethical & natural.` },
  { slug: "jockey", seoTitle: `Jockey Coupon Code: 9.75% Cashback + Promo Codes – ${monthYear} | CouponHub`, seoDescription: `Get 9.75% cashback + verified promo codes on Jockey innerwear, activewear & loungewear for men, women & kids. 27 active deals — official India store.` },
  { slug: "tata-cliq", seoTitle: `Tata CLiQ Coupon Code: 9% Cashback + Offers – ${monthYear} | CouponHub`, seoDescription: `Get 9% cashback + Tata CLiQ promo codes on fashion, electronics, beauty & home. 30 verified deals. Shop top Indian & international brands.` },
  { slug: "shopsy", seoTitle: `Shopsy Coupon Code: 9% Cashback + 52 Active Deals – ${monthYear} | CouponHub`, seoDescription: `Save 9% cashback + verified Shopsy discount codes on budget fashion, shoes & accessories. 52 active offers. India's top budget fashion platform.` },
];

async function main() {
  console.log(`Updating SEO metadata for ${updates.length} stores...\n`);
  let updated = 0;
  for (const u of updates) {
    const result = await prisma.store.updateMany({
      where: { slug: u.slug },
      data: { seoTitle: u.seoTitle, seoDescription: u.seoDescription },
    });
    if (result.count > 0) {
      console.log(`✅ ${u.slug}`);
      updated++;
    } else {
      console.log(`⚠️  Not found: ${u.slug}`);
    }
  }
  console.log(`\n✅ Done! ${updated}/${updates.length} stores updated.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
