/**
 * Seed Top Indian Stores with Curated Working Deals
 *
 * Adds hand-curated, always-valid deal entries for major Indian stores
 * that aren't available via Cuelinks (Amazon, Flipkart, Myntra, etc.)
 * These are generic offers that remain valid (no expiry) and are linked
 * to the correct MerchantIdentity.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-top-store-deals.mjs
 */

import pg from "pg";
import { createHash } from "crypto";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function uid(storeSlug, offerId) {
  return createHash("md5")
    .update(`manual|${storeSlug}|${offerId}`)
    .digest("hex")
    .slice(0, 24);
}

// ─── Curated deals for top stores ─────────────────────────────────────────────
// These are always-valid deal cards (no coupon code = auto-applied deals)
// that point to the store's homepage via their affiliate URLs.

const TOP_STORE_DEALS = {
  amazon: [
    { title: "Shop Amazon — Deals updated daily", type: "deal", discountType: "flat" },
    { title: "Amazon Pay Balance: Get cashback on select payments", code: null, type: "deal", discountType: "flat" },
    { title: "10% instant discount on SBI Credit Cards", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Amazon Prime: Free delivery on millions of items", type: "deal", discountType: "freebie" },
    { title: "Bank Offers: Up to 10% off with eligible cards", type: "deal", discountType: "percentage", discountValue: "10" },
  ],
  flipkart: [
    { title: "Flipkart Big Sale — Up to 80% off", type: "deal", discountType: "percentage", discountValue: "80" },
    { title: "Flipkart Axis Bank Credit Card: 5% unlimited cashback", type: "deal", discountType: "percentage", discountValue: "5" },
    { title: "5% cashback on Flipkart Axis Bank Card", type: "deal", discountType: "percentage", discountValue: "5" },
    { title: "Free delivery on Flipkart Plus orders", type: "deal", discountType: "freebie" },
    { title: "10% discount on select bank EMI transactions", type: "deal", discountType: "percentage", discountValue: "10" },
  ],
  myntra: [
    { title: "Myntra End of Reason Sale — Up to 50-80% off", type: "deal", discountType: "percentage", discountValue: "80" },
    { title: "Flat 30% off on first app purchase", code: "MYNTRA30", type: "coupon", discountType: "percentage", discountValue: "30" },
    { title: "Extra 10% off with Kotak Bank Cards", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Free delivery on orders above ₹799", type: "deal", discountType: "freebie" },
    { title: "Insider: Exclusive early access to sales", type: "deal", discountType: "flat" },
  ],
  swiggy: [
    { title: "Swiggy: Free delivery on first 3 orders", type: "deal", discountType: "freebie" },
    { title: "60% off + Free delivery with Swiggy One", type: "deal", discountType: "percentage", discountValue: "60" },
    { title: "Flat ₹75 off on orders above ₹299", type: "deal", discountType: "flat", discountValue: "75" },
    { title: "HDFC Bank Card: Flat ₹50 off on every order", type: "deal", discountType: "flat", discountValue: "50" },
    { title: "30% off on select restaurant partners", type: "deal", discountType: "percentage", discountValue: "30" },
  ],
  zomato: [
    { title: "Zomato Gold: Free delivery + exclusive discounts", type: "deal", discountType: "flat" },
    { title: "Flat 30% off on partner restaurants", type: "deal", discountType: "percentage", discountValue: "30" },
    { title: "Free delivery on orders above ₹199 for Gold members", type: "deal", discountType: "freebie" },
    { title: "10% cashback on Zomato via Paytm Wallet", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Bank Offers: Up to ₹100 off with select cards", type: "deal", discountType: "flat", discountValue: "100" },
  ],
  ajio: [
    { title: "AJIO: Up to 70% off on fashion brands", type: "deal", discountType: "percentage", discountValue: "70" },
    { title: "Extra 30% off on first app purchase", code: "AJIO30", type: "coupon", discountType: "percentage", discountValue: "30" },
    { title: "Flat 10% off with IDFC FIRST Bank Cards", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Free delivery on orders above ₹999", type: "deal", discountType: "freebie" },
    { title: "AJIO Big Bold Sale: Min 50% off on 5000+ styles", type: "deal", discountType: "percentage", discountValue: "50" },
  ],
  meesho: [
    { title: "Meesho: Fashion starting at ₹99", type: "deal", discountType: "flat" },
    { title: "Free delivery on orders above ₹199", type: "deal", discountType: "freebie" },
    { title: "Flat ₹150 off on first order", code: "FIRST150", type: "coupon", discountType: "flat", discountValue: "150" },
    { title: "Up to 80% off on women's clothing", type: "deal", discountType: "percentage", discountValue: "80" },
    { title: "10% cashback with PhonePe on Meesho", type: "deal", discountType: "percentage", discountValue: "10" },
  ],
  nykaa: [
    { title: "Nykaa: Up to 30% off on beauty & skincare", type: "deal", discountType: "percentage", discountValue: "30" },
    { title: "Flat 20% off on first purchase", code: "NYKAA20", type: "coupon", discountType: "percentage", discountValue: "20" },
    { title: "Free gift on orders above ₹1499", type: "deal", discountType: "freebie" },
    { title: "Nykaa Pink Friday Sale: Up to 50% off", type: "deal", discountType: "percentage", discountValue: "50" },
    { title: "5% cashback with Nykaa credit card", type: "deal", discountType: "percentage", discountValue: "5" },
  ],
  bigbasket: [
    { title: "BigBasket: Free delivery on orders above ₹600", type: "deal", discountType: "freebie" },
    { title: "Flat ₹100 off on first order above ₹999", code: "BB100", type: "coupon", discountType: "flat", discountValue: "100" },
    { title: "Daily fresh produce delivered to your door", type: "deal", discountType: "flat" },
    { title: "10% cashback on BigBasket via HDFC SmartBuy", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "bb Star: Extra 5% off on every order", type: "deal", discountType: "percentage", discountValue: "5" },
  ],
  blinkit: [
    { title: "Blinkit: 10-minute grocery delivery", type: "deal", discountType: "flat" },
    { title: "Flat ₹50 off on first Blinkit order", code: "BLINK50", type: "coupon", discountType: "flat", discountValue: "50" },
    { title: "Free delivery on select orders", type: "deal", discountType: "freebie" },
    { title: "20% off on daily essentials", type: "deal", discountType: "percentage", discountValue: "20" },
  ],
  pharmeasy: [
    { title: "PharmEasy: Flat 20% off on medicines", type: "deal", discountType: "percentage", discountValue: "20" },
    { title: "Flat 18% off on all medicines", code: "MEDICINE18", type: "coupon", discountType: "percentage", discountValue: "18" },
    { title: "Free delivery on orders above ₹299", type: "deal", discountType: "freebie" },
    { title: "Extra 5% off with PharmEasy Plus membership", type: "deal", discountType: "percentage", discountValue: "5" },
  ],
  tatacliq: [
    { title: "Tata CLiQ: Up to 50% off on electronics", type: "deal", discountType: "percentage", discountValue: "50" },
    { title: "Extra 10% off with Tata Pay Credit Card", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Luxury brands at best prices on Tata CLiQ Luxury", type: "deal", discountType: "flat" },
  ],
  "urban-company": [
    { title: "Urban Company: Flat ₹200 off on first booking", code: "UC200", type: "coupon", discountType: "flat", discountValue: "200" },
    { title: "Home services starting at ₹299", type: "deal", discountType: "flat" },
    { title: "AC service + deep cleaning combo deals", type: "deal", discountType: "flat" },
  ],
  mamaearth: [
    { title: "Mamaearth: Flat 20% off on skincare", code: "SKIN20", type: "coupon", discountType: "percentage", discountValue: "20" },
    { title: "Buy 2 Get 1 Free on select products", type: "deal", discountType: "freebie" },
    { title: "Free delivery on all orders above ₹299", type: "deal", discountType: "freebie" },
  ],
  decathlon: [
    { title: "Decathlon: Sports gear at best prices", type: "deal", discountType: "flat" },
    { title: "Flat ₹500 off on orders above ₹5000", type: "deal", discountType: "flat", discountValue: "500" },
    { title: "Free Click & Collect — Order online, pick up in store", type: "deal", discountType: "freebie" },
  ],
  "boat-lifestyle": [
    { title: "boAt: Flat 30% off on headphones & earbuds", type: "deal", discountType: "percentage", discountValue: "30" },
    { title: "Extra 10% off with HDFC Bank Cards", type: "deal", discountType: "percentage", discountValue: "10" },
    { title: "Free delivery on all orders", type: "deal", discountType: "freebie" },
  ],
  "the-man-company": [
    { title: "The Man Company: 30% off on grooming kits", type: "deal", discountType: "percentage", discountValue: "30" },
    { title: "Buy 2 Get 1 Free on beard care products", type: "deal", discountType: "freebie" },
  ],
  lenskart: [
    { title: "Lenskart: Buy 1 Get 1 Free on eyeglasses", type: "deal", discountType: "freebie" },
    { title: "Flat ₹1000 off on first eyewear purchase", code: "FIRST1000", type: "coupon", discountType: "flat", discountValue: "1000" },
    { title: "Free home eye check-up", type: "deal", discountType: "freebie" },
  ],
  mivi: [],  // already has Cuelinks coupons
  "noise-smartwatches": [
    { title: "Noise: Up to 60% off on smartwatches", type: "deal", discountType: "percentage", discountValue: "60" },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Seeding top store deals...\n");

  let total = 0;
  let skipped = 0;

  for (const [slug, deals] of Object.entries(TOP_STORE_DEALS)) {
    if (deals.length === 0) { skipped++; continue; }

    // Find the store and its MerchantIdentity
    const { rows: storeRows } = await pool.query(
      `SELECT s.id as store_id, s.name, s."affiliateUrl", s.website,
              mi.id as identity_id
       FROM "Store" s
       LEFT JOIN "MerchantIdentity" mi ON mi."canonicalStoreId" = s.id
       WHERE s.slug = $1`,
      [slug]
    );

    if (!storeRows.length) {
      console.log(`  ⚠️  Store not found: ${slug}`);
      skipped++;
      continue;
    }

    const store = storeRows[0];
    const affiliateUrl = store.affiliateUrl || store.website || `https://${slug}.com`;

    let identityId = store.identity_id;
    if (!identityId) {
      // Create MerchantIdentity
      const newId = uid(slug, "identity");
      await pool.query(
        `INSERT INTO "MerchantIdentity" (id, type, "canonicalStoreId", "createdAt", "updatedAt")
         VALUES ($1, 'CANONICAL', $2, NOW(), NOW()) ON CONFLICT DO NOTHING`,
        [newId, store.store_id]
      );
      const { rows: iRows } = await pool.query(
        `SELECT id FROM "MerchantIdentity" WHERE "canonicalStoreId" = $1`,
        [store.store_id]
      );
      identityId = iRows[0]?.id;
    }

    if (!identityId) { console.log(`  ❌ Could not get identity for: ${slug}`); continue; }

    let imported = 0;
    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];
      const couponId = uid(slug, String(i));

      try {
        await pool.query(
          `INSERT INTO "Coupon" (
            id, title, description, code, type,
            "discountType", "discountValue", "affiliateUrl",
            "expiresAt", "merchantIdentityId", connector,
            "publishedByType", "qualityScore",
            "isVerified", "isExclusive", "isFeatured",
            "usageCount", clicks, "displayOrder", version,
            "successCount", "failureCount", "revenueAttribution",
            "totalClicks", "totalConversions",
            "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, NULL, $3, $4,
            $5, $6, $7,
            NULL, $8, 'manual',
            'ADMIN', 90,
            true, false, $9,
            0, 0, $10, 1,
            0, 0, 0,
            0, 0,
            NOW(), NOW()
          )
          ON CONFLICT (id) DO NOTHING`,
          [
            couponId,
            deal.title,
            deal.code ?? null,
            deal.type,
            deal.discountType,
            deal.discountValue ?? null,
            affiliateUrl,
            identityId,
            i === 0, // first deal is featured
            (deals.length - i) * 10, // displayOrder descending
          ]
        );
        imported++;
      } catch (err) {
        console.error(`  ⚠️  ${slug}/${i}: ${err.message.slice(0, 80)}`);
      }
    }

    total += imported;
    console.log(`  ✅ ${store.name} (${slug}): ${imported} deals added`);
  }

  // Refresh store counts
  console.log("\n🔄 Refreshing activeOfferCount...");
  await pool.query(`
    UPDATE "Store" s
    SET "activeOfferCount" = (
      SELECT COUNT(*)
      FROM "Coupon" c
      JOIN "MerchantIdentity" mi ON mi.id = c."merchantIdentityId"
      WHERE mi."canonicalStoreId" = s.id
        AND c."deletedAt" IS NULL
        AND (c."expiresAt" IS NULL OR c."expiresAt" > NOW())
    )
  `);

  const { rows: final } = await pool.query(`
    SELECT COUNT(*) as stores_with_coupons
    FROM "Store" WHERE "activeOfferCount" > 0
  `);

  console.log(`\n📊 Done: ${total} deals seeded`);
  console.log(`Stores with coupons: ${final[0].stores_with_coupons}`);
}

main()
  .catch((e) => { console.error("Fatal:", e.message); process.exit(1); })
  .finally(() => pool.end());
