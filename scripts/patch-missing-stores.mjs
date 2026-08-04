/**
 * Patch: Add deals to stores not covered by initial seed
 * Usage: node --env-file=.env scripts/patch-missing-stores.mjs
 */
import pg from "pg";
import { createHash } from "crypto";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const uid = (a, b) => createHash("md5").update(`manual|${a}|${b}`).digest("hex").slice(0, 24);

const patches = [
  { slug: "tata-cliq", deals: [
    { t: "Tata CLiQ: Up to 50% off on electronics", dt: "percentage", dv: "50", type: "deal" },
    { t: "Extra 10% off with Tata Pay Credit Card", dt: "percentage", dv: "10", type: "deal" },
    { t: "Luxury brands at best prices on Tata CLiQ Luxury", dt: "flat", type: "deal" },
  ]},
  { slug: "nykaa-beauty", deals: [
    { t: "Flat 20% off on first purchase", code: "NYKAA20", dt: "percentage", dv: "20", type: "coupon" },
    { t: "Free gift on orders above ₹1499", dt: "freebie", type: "deal" },
  ]},
  { slug: "nykaa-fashion", deals: [
    { t: "Nykaa Fashion: Up to 60% off on top brands", dt: "percentage", dv: "60", type: "deal" },
    { t: "Extra 10% off on first app order", code: "NYFASH10", dt: "percentage", dv: "10", type: "coupon" },
  ]},
  { slug: "boat", deals: [
    { t: "boAt: Flat 30% off on headphones & earbuds", dt: "percentage", dv: "30", type: "deal" },
    { t: "Extra 10% off with HDFC Bank Cards", dt: "percentage", dv: "10", type: "deal" },
    { t: "Free delivery on all boAt orders", dt: "freebie", type: "deal" },
  ]},
];

async function main() {
  for (const { slug, deals } of patches) {
    const { rows } = await pool.query(
      `SELECT s.id as store_id, s.name, s."affiliateUrl", s.website, mi.id as identity_id
       FROM "Store" s LEFT JOIN "MerchantIdentity" mi ON mi."canonicalStoreId" = s.id WHERE s.slug = $1`,
      [slug]
    );
    if (!rows.length) { console.log(`Not found: ${slug}`); continue; }

    const store = rows[0];
    const affiliateUrl = store.affiliateUrl || store.website;
    const identityId = store.identity_id;
    if (!identityId) { console.log(`No identity: ${slug}`); continue; }

    let count = 0;
    for (let i = 0; i < deals.length; i++) {
      const d = deals[i];
      await pool.query(
        `INSERT INTO "Coupon" (
          id, title, code, type, "discountType", "discountValue", "affiliateUrl",
          "expiresAt", "merchantIdentityId", connector, "publishedByType", "qualityScore",
          "isVerified", "isExclusive", "isFeatured", "usageCount", clicks, "displayOrder",
          version, "successCount", "failureCount", "revenueAttribution", "totalClicks", "totalConversions",
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          NULL, $8, 'manual', 'ADMIN', 90,
          true, false, $9, 0, 0, $10,
          1, 0, 0, 0, 0, 0,
          NOW(), NOW()
        ) ON CONFLICT (id) DO NOTHING`,
        [uid(slug, String(i)), d.t, d.code ?? null, d.type, d.dt, d.dv ?? null, affiliateUrl, identityId, i === 0, (deals.length - i) * 10]
      );
      count++;
    }
    console.log(`✅ ${store.name}: ${count} deals added`);
  }

  // Refresh counts
  await pool.query(`
    UPDATE "Store" s SET "activeOfferCount" = (
      SELECT COUNT(*) FROM "Coupon" c
      JOIN "MerchantIdentity" mi ON mi.id = c."merchantIdentityId"
      WHERE mi."canonicalStoreId" = s.id AND c."deletedAt" IS NULL
        AND (c."expiresAt" IS NULL OR c."expiresAt" > NOW())
    )
  `);

  const { rows } = await pool.query(`SELECT COUNT(*) as n FROM "Store" WHERE "activeOfferCount" > 0`);
  console.log(`\n🎯 Stores with coupons: ${rows[0].n}`);
}

main().catch(console.error).finally(() => pool.end());
