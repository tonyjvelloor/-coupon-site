/**
 * Bulk Import Script — Cuelinks Direct (pg-native)
 *
 * Fetches ALL pages of live offers from Cuelinks API,
 * matches to existing stores, and upserts coupons directly.
 *
 * Usage:
 *   node --env-file=.env scripts/bulk-import-cuelinks.mjs
 */

import pg from "pg";
import { createHash } from "crypto";

const { Pool } = pg;

const DB_URL = process.env.DATABASE_URL;
const API_KEY = process.env.CUELINKS_API_KEY;

if (!API_KEY) { console.error("❌ CUELINKS_API_KEY not set"); process.exit(1); }
if (!DB_URL) { console.error("❌ DATABASE_URL not set"); process.exit(1); }

const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
const BASE_URL = "https://developers.cuelinks.com/pub_api/v3";
const headers = { Authorization: `Token ${API_KEY}` };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const norm = (s = "") => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = (offer) =>
  createHash("md5")
    .update(`cuelinks|${offer.id}|${offer.campaign_id}`)
    .digest("hex")
    .slice(0, 24);

// ─── Fetch ALL offers ─────────────────────────────────────────────────────────

async function fetchAllOffers() {
  const all = [];
  let page = 1;

  console.log("📡 Fetching offers from Cuelinks...");

  while (true) {
    const qs = new URLSearchParams({ per_page: "100", page: String(page) });
    const res = await fetch(`${BASE_URL}/offers?${qs}`, { headers });

    if (!res.ok) {
      console.error(`  HTTP ${res.status} on page ${page}`);
      break;
    }

    const json = await res.json();
    const data = json?.data || [];
    const meta = json?.meta || json?.pagination || {};

    all.push(...data);

    const totalPages = meta.total_pages ?? meta.last_page ?? (data.length < 100 ? page : page + 1);
    console.log(`  Page ${page}/${totalPages}: ${data.length} offers (total: ${all.length})`);

    if (page >= totalPages || data.length === 0) break;
    page++;
    await sleep(350);
  }

  console.log(`✅ Total offers fetched: ${all.length}\n`);
  return all;
}

// ─── Load stores from DB ──────────────────────────────────────────────────────

async function loadStores() {
  const { rows } = await pool.query(`
    SELECT s.id as store_id, s.name, s.slug, mi.id as identity_id
    FROM "Store" s
    LEFT JOIN "MerchantIdentity" mi ON mi."canonicalStoreId" = s.id
    WHERE s."isActive" = true
  `);

  const lookup = new Map();
  for (const row of rows) {
    const entry = { storeId: row.store_id, storeName: row.name, identityId: row.identity_id };
    lookup.set(norm(row.name), entry);
    lookup.set(norm(row.slug), entry);
  }

  console.log(`📦 Loaded ${rows.length} active stores`);
  return lookup;
}

function findStore(campaignName, lookup) {
  const key = norm(campaignName || "");
  if (!key) return null;
  if (lookup.has(key)) return lookup.get(key);
  for (const [k, v] of lookup) {
    if (k.length >= 4 && (key.includes(k) || k.includes(key))) return v;
  }
  return null;
}

// ─── Get or create MerchantIdentity ──────────────────────────────────────────

const identityCache = new Map();

async function getOrCreateIdentity(storeId, existingId) {
  if (identityCache.has(storeId)) return identityCache.get(storeId);
  if (existingId) { identityCache.set(storeId, existingId); return existingId; }

  // Check
  const { rows } = await pool.query(
    `SELECT id FROM "MerchantIdentity" WHERE "canonicalStoreId" = $1 LIMIT 1`,
    [storeId]
  );
  if (rows.length) { identityCache.set(storeId, rows[0].id); return rows[0].id; }

  // Create
  const id = createHash("md5").update(`identity_${storeId}`).digest("hex").slice(0, 24);
  await pool.query(
    `INSERT INTO "MerchantIdentity" (id, type, "canonicalStoreId", "createdAt", "updatedAt")
     VALUES ($1, 'CANONICAL', $2, NOW(), NOW())
     ON CONFLICT DO NOTHING`,
    [id, storeId]
  );

  // Re-fetch to get actual id (might differ if conflict)
  const { rows: r2 } = await pool.query(
    `SELECT id FROM "MerchantIdentity" WHERE "canonicalStoreId" = $1 LIMIT 1`,
    [storeId]
  );
  const finalId = r2[0]?.id ?? id;
  identityCache.set(storeId, finalId);
  return finalId;
}

// ─── Upsert single offer ──────────────────────────────────────────────────────

async function upsertOffer(offer, storeLookup, stats) {
  if (!offer.tracking_url) { stats.noUrl++; return; }

  const match = findStore(offer.campaign_name || offer.merchant_name, storeLookup);
  if (!match) { stats.noStore++; return; }

  if (offer.end_date && new Date(offer.end_date) < new Date()) { stats.expired++; return; }

  let discountType = "flat";
  let discountValue = null;
  if (offer.percent_off && Number(offer.percent_off) > 0) {
    discountType = "percentage"; discountValue = String(offer.percent_off);
  } else if (offer.discount_price && Number(offer.discount_price) > 0) {
    discountType = "flat"; discountValue = String(offer.discount_price);
  } else if (offer.offer_type === "freebie" || offer.title?.toLowerCase().includes("free")) {
    discountType = "freebie";
  }

  try {
    const identityId = await getOrCreateIdentity(match.storeId, match.identityId);
    const couponId = uid(offer);
    const expiresAt = offer.end_date ? new Date(offer.end_date) : null;

    await pool.query(`
      INSERT INTO "Coupon" (
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
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9, $10, 'cuelinks',
        'SYSTEM', 80,
        false, false, false,
        0, 0, 0, 1,
        0, 0, 0,
        0, 0,
        NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        code = EXCLUDED.code,
        "discountType" = EXCLUDED."discountType",
        "discountValue" = EXCLUDED."discountValue",
        "affiliateUrl" = EXCLUDED."affiliateUrl",
        "expiresAt" = EXCLUDED."expiresAt",
        "deletedAt" = NULL,
        "updatedAt" = NOW()
    `, [
      couponId,
      (offer.title || "Special Offer").slice(0, 500),
      offer.description ?? null,
      offer.coupon_code ?? null,
      offer.coupon_code ? "coupon" : "deal",
      discountType,
      discountValue,
      offer.tracking_url,
      expiresAt,
      identityId,
    ]);

    stats.imported++;
  } catch (err) {
    stats.errors++;
    if (stats.errors <= 5) {
      console.error(`  ⚠️  "${offer.title}" → ${err.message.slice(0, 120)}`);
    }
  }
}

// ─── Refresh store counts ─────────────────────────────────────────────────────

async function refreshCounts() {
  console.log("\n🔄 Refreshing activeOfferCount for all stores...");

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

  console.log("✅ Store counts updated");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 CouponHub — Cuelinks Bulk Import\n");
  const t0 = Date.now();

  const [offers, storeLookup] = await Promise.all([
    fetchAllOffers(),
    loadStores(),
  ]);

  const stats = { imported: 0, noStore: 0, noUrl: 0, expired: 0, errors: 0 };

  console.log("⚙️  Importing...");

  // Batch in groups of 20 (parallel) to stay safe with connections
  for (let i = 0; i < offers.length; i += 20) {
    await Promise.all(offers.slice(i, i + 20).map((o) => upsertOffer(o, storeLookup, stats)));
    if (i % 200 === 0 && i > 0) console.log(`  ${i}/${offers.length} processed`);
  }

  await refreshCounts();

  // Final stats from DB
  const { rows: finalRows } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM "Coupon" WHERE "deletedAt" IS NULL) as total_coupons,
      (SELECT COUNT(*) FROM "Store" WHERE "activeOfferCount" > 0) as stores_with_coupons
  `);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`\n📊 Summary (${elapsed}s):`);
  console.log(`  ✅ Imported/Updated : ${stats.imported}`);
  console.log(`  🏪 No store match   : ${stats.noStore}`);
  console.log(`  🔗 No URL           : ${stats.noUrl}`);
  console.log(`  📅 Expired          : ${stats.expired}`);
  console.log(`  ❌ Errors           : ${stats.errors}`);
  console.log(`\n🎯 Live DB:`);
  console.log(`  Active coupons      : ${finalRows[0].total_coupons}`);
  console.log(`  Stores with coupons : ${finalRows[0].stores_with_coupons}`);
}

main()
  .catch((e) => { console.error("Fatal:", e.message); process.exit(1); })
  .finally(() => pool.end());
