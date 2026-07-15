#!/usr/bin/env node
/**
 * Cuelinks Connector v2
 * ---------------------
 * Fetches all live offers from the Cuelinks API and upserts them into the
 * CouponHub database. Uses a pre-loaded in-memory store map for fast
 * merchant resolution without hammering the DB with per-offer queries.
 *
 * Usage:
 *   npx tsx scripts/connectors/cuelinks-connector.ts
 *   npx tsx scripts/connectors/cuelinks-connector.ts --dry-run
 *   npx tsx scripts/connectors/cuelinks-connector.ts --limit 50
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, MerchantIdentityType } from "@prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3, // conservative pool for Neon
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Config ──────────────────────────────────────────────────────────────────

const API_KEY = process.env.CUELINKS_API_KEY;
const BASE_URL = "https://developers.cuelinks.com/pub_api/v3";
const CONNECTOR_NAME = "cuelinks";
const CONNECTOR_VERSION = "2.0";
const PAGE_SIZE = 100;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = (() => {
  const idx = args.indexOf("--limit");
  return idx !== -1 ? parseInt(args[idx + 1], 10) : Infinity;
})();

if (!API_KEY) {
  console.error("❌ CUELINKS_API_KEY not set.");
  process.exit(1);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface CuelinksOffer {
  id: number;
  title: string;
  description: string | null;
  terms: string | null;
  coupon_code: string | null;
  offer_type: string;
  campaign_id: number;
  campaign_name: string;
  tracking_url: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  percent_off: number | null;
  original_price: number | null;
  discount_price: number | null;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDiscount(offer: CuelinksOffer) {
  if (offer.percent_off) return { discountType: "percentage", discountValue: `${offer.percent_off}` };
  if (offer.original_price && offer.discount_price) {
    return { discountType: "fixed", discountValue: `${Math.round(offer.original_price - offer.discount_price)}` };
  }
  const pct = offer.title.match(/(\d+)\s*%/);
  if (pct) return { discountType: "percentage", discountValue: pct[1] };
  const flat = offer.title.match(/(?:₹|rs\.?\s*)(\d[\d,]*)/i);
  if (flat) return { discountType: "fixed", discountValue: flat[1].replace(/,/g, "") };
  return { discountType: "percentage", discountValue: null };
}

// ─── Step 1: Load store resolution map from DB ───────────────────────────────

async function buildStoreMap(): Promise<Map<string, string>> {
  console.log("🗺️  Loading stores + identities from DB...");
  
  const stores = await (prisma as any).store.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
  });

  const identities = await (prisma as any).merchantIdentity.findMany({
    where: { canonicalStoreId: { not: null } },
    select: { id: true, canonicalStoreId: true },
  });

  const storeIdToIdentityId = new Map<string, string>();
  for (const id of identities) {
    storeIdToIdentityId.set(id.canonicalStoreId, id.id);
  }

  // Map: slug → merchantIdentityId (and also name → merchantIdentityId)
  const map = new Map<string, string>();
  for (const store of stores) {
    const identityId = storeIdToIdentityId.get(store.id);
    if (identityId) {
      map.set(store.slug, identityId);
      map.set(store.name.toLowerCase().trim(), identityId);
    }
  }

  console.log(`  ✅ Loaded ${stores.length} stores, ${identities.length} identities → ${map.size} resolution keys\n`);
  return map;
}

// ─── Step 2: Fetch all live offers from Cuelinks ─────────────────────────────

async function fetchAllOffers(): Promise<CuelinksOffer[]> {
  const all: CuelinksOffer[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && all.length < LIMIT) {
    const qs = new URLSearchParams({ per_page: PAGE_SIZE.toString(), page: page.toString() });
    const res = await fetch(`${BASE_URL}/offers?${qs}`, {
      headers: { Authorization: `Token ${API_KEY}` },
    });
    if (!res.ok) throw new Error(`Cuelinks API error ${res.status}`);

    const json = await res.json();
    totalPages = json.meta?.total_pages ?? 1;
    const liveOffers = (json.data ?? []).filter((o: any) => o.status === "live");
    all.push(...liveOffers);
    console.log(`  📦 Page ${page}/${totalPages} — ${liveOffers.length} live offers (running: ${all.length})`);
    page++;
    await new Promise(r => setTimeout(r, 250));
  }

  return LIMIT < Infinity ? all.slice(0, LIMIT) : all;
}

// ─── Step 3: Resolve merchantIdentityId for each offer ───────────────────────

function resolveIdentityId(offer: CuelinksOffer, storeMap: Map<string, string>): string | null {
  const slug = slugify(offer.campaign_name);
  return storeMap.get(slug)
    ?? storeMap.get(offer.campaign_name.toLowerCase().trim())
    ?? null;
}

// ─── Step 4: Load existing coupon tracking URLs to detect updates ─────────────

async function loadExistingCouponUrls(): Promise<Set<string>> {
  console.log("🔍 Loading existing Cuelinks coupon URLs...");
  const existing = await (prisma as any).coupon.findMany({
    where: { connector: CONNECTOR_NAME },
    select: { affiliateUrl: true },
  });
  const set = new Set<string>(existing.map((c: any) => c.affiliateUrl));
  console.log(`  ✅ Found ${set.size} existing Cuelinks coupons\n`);
  return set;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Cuelinks Connector v2${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  // Load resolution maps upfront (2 DB queries total)
  const [storeMap, existingUrls] = await Promise.all([
    buildStoreMap(),
    DRY_RUN ? Promise.resolve(new Set<string>()) : loadExistingCouponUrls(),
  ]);

  // Fetch all live offers
  console.log("📡 Fetching offers from Cuelinks API...");
  const offers = await fetchAllOffers();
  console.log(`\n✅ Fetched ${offers.length} live offers.\n`);
  console.log("💾 Writing to database...");

  let published = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const missedCampaigns = new Set<string>();

  // Process in batches of 50 to keep memory manageable
  const BATCH = 50;
  for (let i = 0; i < offers.length; i += BATCH) {
    const batch = offers.slice(i, i + BATCH);

    for (const offer of batch) {
      try {
        const merchantIdentityId = resolveIdentityId(offer, storeMap);

        if (!merchantIdentityId) {
          missedCampaigns.add(offer.campaign_name);
          skipped++;
          continue;
        }

        const { discountType, discountValue } = parseDiscount(offer);
        const code = offer.coupon_code?.trim() || null;

        const couponData = {
          title: offer.title.trim().slice(0, 500),
          description: offer.description?.trim().slice(0, 2000) || null,
          code,
          type: code ? "coupon" : "deal",
          discountType,
          discountValue,
          affiliateUrl: offer.tracking_url,
          termsConditions: offer.terms?.trim() || null,
          expiresAt: offer.end_date ? new Date(offer.end_date) : null,
          isVerified: true,
          isFeatured: false,
          merchantIdentityId,
          connector: CONNECTOR_NAME,
          connectorVersion: CONNECTOR_VERSION,
          publishedByType: "CONNECTOR",
        };

        if (DRY_RUN) {
          console.log(`  🔍 [DRY] ${offer.campaign_name}: "${offer.title.slice(0, 50)}..."`);
          published++;
          continue;
        }

        if (existingUrls.has(offer.tracking_url)) {
          // Update existing
          await (prisma as any).coupon.updateMany({
            where: { connector: CONNECTOR_NAME, affiliateUrl: offer.tracking_url },
            data: {
              title: couponData.title,
              description: couponData.description,
              code: couponData.code,
              discountType: couponData.discountType,
              discountValue: couponData.discountValue,
              expiresAt: couponData.expiresAt,
              connectorVersion: CONNECTOR_VERSION,
            },
          });
          updated++;
        } else {
          await (prisma as any).coupon.create({ data: couponData });
          existingUrls.add(offer.tracking_url); // prevent re-create in same run
          published++;
        }
      } catch (err: any) {
        console.error(`  ❌ Offer ${offer.id} (${offer.campaign_name}): ${err.message}`);
        errors++;
      }
    }

    // Progress
    const done = Math.min(i + BATCH, offers.length);
    process.stdout.write(`\r  Progress: ${done}/${offers.length} offers processed...`);
  }

  console.log(`\n`);

  console.log(`
╔══════════════════════════════════════╗
║    Cuelinks Connector v2 Results     ║
╠══════════════════════════════════════╣
║  Total fetched     : ${String(offers.length).padEnd(16)}║
║  Published (new)   : ${String(published).padEnd(16)}║
║  Updated           : ${String(updated).padEnd(16)}║
║  Skipped (no store): ${String(skipped).padEnd(16)}║
║  Errors            : ${String(errors).padEnd(16)}║
╚══════════════════════════════════════╝
`);

  if (missedCampaigns.size > 0) {
    console.log(`⚠️  ${missedCampaigns.size} campaigns had no matching store:`);
    for (const name of [...missedCampaigns].slice(0, 10)) {
      console.log(`   - ${name}`);
    }
    if (missedCampaigns.size > 10) console.log(`   ... and ${missedCampaigns.size - 10} more`);
  }
}

main()
  .catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
