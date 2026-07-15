#!/usr/bin/env node
/**
 * Cuelinks Campaign Seeder
 * --------------------------
 * Fetches all open Cuelinks campaigns and creates Store records for any
 * campaigns that don't already exist in CouponHub's database.
 *
 * Usage:
 *   npx tsx scripts/connectors/cuelinks-seed-stores.ts
 *   npx tsx scripts/connectors/cuelinks-seed-stores.ts --dry-run
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient, MerchantIdentityType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_KEY = process.env.CUELINKS_API_KEY;
const BASE_URL = "https://developers.cuelinks.com/pub_api/v3";
const PAGE_SIZE = 100;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

if (!API_KEY) {
  console.error("❌ CUELINKS_API_KEY not set.");
  process.exit(1);
}

interface CuelinksCampaign {
  id: number;
  name: string;
  url: string;
  domain: string;
  image: string;
  payout_type: string;
  payout: string;
  payout_currency: string;
  campaign_type: string;
  access_status: string;
  categories: { id: number; name: string }[];
  tracking_url: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Cuelinks category id → our DB category slug mapping (best-effort)
const CATEGORY_MAP: Record<number, string> = {
  1: "fashion",
  2: "electronics",
  3: "home-living",
  4: "sports-fitness",
  7: "food-grocery",
  8: "health-beauty",
  11: "travel",
  12: "finance",
  14: "services",
  18: "entertainment",
};

async function fetchAllCampaigns(): Promise<CuelinksCampaign[]> {
  const all: CuelinksCampaign[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const qs = new URLSearchParams({
      access_status: "open",
      per_page: PAGE_SIZE.toString(),
      page: page.toString(),
    });

    const res = await fetch(`${BASE_URL}/campaigns?${qs}`, {
      headers: { Authorization: `Token ${API_KEY}` },
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    totalPages = json.meta?.total_pages ?? 1;
    all.push(...(json.data ?? []));
    console.log(`  📦 Page ${page}/${totalPages} — ${all.length} campaigns so far`);
    page++;
    await new Promise(r => setTimeout(r, 300));
  }

  return all;
}

async function main() {
  console.log(`\n🌱 Cuelinks Store Seeder${DRY_RUN ? " [DRY RUN]" : ""}...\n`);

  const campaigns = await fetchAllCampaigns();
  console.log(`\n✅ Fetched ${campaigns.length} open campaigns.\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const campaign of campaigns) {
    try {
      const slug = slugify(campaign.name);
      if (!slug) { skipped++; continue; }

      // Check if store already exists
      const existing = await prisma.store.findFirst({
        where: { OR: [{ slug }, { name: { equals: campaign.name, mode: "insensitive" } }] },
      });

      if (existing) {
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  🔍 [DRY] Would create store: ${campaign.name} (${slug})`);
        created++;
        continue;
      }

      // Parse cashback rate
      const cashbackRate =
        campaign.payout_currency === "%" ? `${campaign.payout}%` : `₹${campaign.payout}`;

      // Create store
      const store = await prisma.store.create({
        data: {
          name: campaign.name,
          slug,
          website: campaign.url,
          logo: campaign.image?.includes("Placeholder") ? null : campaign.image,
          cashbackRate,
          cashbackType: campaign.payout_type,
          isActive: true,
          isFeatured: false,
        },
      });

      // Create canonical MerchantIdentity
      await prisma.merchantIdentity.create({
        data: {
          type: MerchantIdentityType.CANONICAL,
          canonicalStoreId: store.id,
        },
      });

      // Wire up categories
      for (const cat of campaign.categories) {
        const catSlug = CATEGORY_MAP[cat.id];
        if (catSlug) {
          const dbCat = await prisma.category.findFirst({ where: { slug: catSlug } });
          if (dbCat) {
            await prisma.storeCategory.upsert({
              where: { storeId_categoryId: { storeId: store.id, categoryId: dbCat.id } },
              create: { storeId: store.id, categoryId: dbCat.id },
              update: {},
            });
          }
        }
      }

      console.log(`  ✅ Created store: ${campaign.name} → /${slug}`);
      created++;
    } catch (err: any) {
      console.error(`  ❌ Error for campaign "${campaign.name}": ${err.message}`);
      errors++;
    }
  }

  console.log(`
╔══════════════════════════════════╗
║    Cuelinks Store Seeder Done    ║
╠══════════════════════════════════╣
║  Total campaigns : ${String(campaigns.length).padEnd(14)}║
║  Stores created  : ${String(created).padEnd(14)}║
║  Already existed : ${String(skipped).padEnd(14)}║
║  Errors          : ${String(errors).padEnd(14)}║
╚══════════════════════════════════╝
`);
}

main()
  .catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
  })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
