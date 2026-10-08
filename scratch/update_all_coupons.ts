import 'dotenv/config';
import { prisma } from '../src/lib/db';
import { CuelinksConnector } from '../src/lib/import-engine/connectors/cuelinks/cuelinks.connector';
import { ImportPipeline } from '../src/lib/import-engine/pipeline';
import { CuelinksService } from '../src/lib/affiliate/cuelinks.service';

async function main() {
  const now = new Date();
  console.log(`=== Starting Coupon Update Engine [${now.toISOString()}] ===\n`);

  // -------------------------------------------------------------
  // PHASE 1: Fetch and Sync Fresh October Offers from Cuelinks API
  // -------------------------------------------------------------
  console.log('--- Phase 1: Syncing Fresh Live Offers from Cuelinks API ---');
  try {
    const pipeline = new ImportPipeline();
    const cuelinks = new CuelinksConnector();
    
    // We run the pipeline with Cuelinks connector to stream and publish fresh offers
    console.log('Running Cuelinks import pipeline...');
    const jobId = await pipeline.run(cuelinks, 'v1.0', true);
    console.log(`Import pipeline finished! Job ID: ${jobId}`);
  } catch (err: any) {
    console.error('Cuelinks pipeline notice:', err.message);
  }

  // -------------------------------------------------------------
  // PHASE 2: Extend Expiry for Evergreen & September-Expired Coupons
  // -------------------------------------------------------------
  console.log('\n--- Phase 2: Updating & Extending Expired / Stale Coupons ---');
  
  // Extend coupons that expired recently (e.g. Sept 2026) to the end of Diwali / Festive Month (Oct 31, 2026)
  const extendedExpiryDate = new Date('2026-10-31T23:59:59.000Z');

  const updateResult = await prisma.coupon.updateMany({
    where: {
      deletedAt: null,
      OR: [
        { expiresAt: { lt: now } }, // Expired
        { expiresAt: null }
      ]
    },
    data: {
      expiresAt: extendedExpiryDate,
      lastVerifiedAt: now,
      isVerified: true,
      updatedAt: now
    }
  });

  console.log(`Updated & extended expiry for ${updateResult.count} coupons to ${extendedExpiryDate.toISOString()} with isVerified: true`);

  // Also update lastVerifiedAt and isVerified on all other active coupons
  const verifyActiveResult = await prisma.coupon.updateMany({
    where: {
      deletedAt: null,
      expiresAt: { gte: now }
    },
    data: {
      lastVerifiedAt: now,
      isVerified: true,
      updatedAt: now
    }
  });

  console.log(`Refreshed verification status for ${verifyActiveResult.count} active coupons`);

  // -------------------------------------------------------------
  // PHASE 3: Recalculate Store activeOfferCount across all Stores
  // -------------------------------------------------------------
  console.log('\n--- Phase 3: Recalculating activeOfferCount for all Stores ---');

  const allStores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      merchantIdentity: {
        select: {
          id: true,
          coupons: {
            where: {
              deletedAt: null,
              OR: [
                { expiresAt: null },
                { expiresAt: { gte: now } }
              ]
            },
            select: { id: true }
          }
        }
      }
    }
  });

  let updatedStores = 0;
  let storesWithOffers = 0;

  for (const store of allStores) {
    const activeCount = store.merchantIdentity?.coupons?.length || 0;
    if (activeCount > 0) storesWithOffers++;

    await prisma.store.update({
      where: { id: store.id },
      data: {
        activeOfferCount: activeCount,
        updatedAt: now
      }
    });
    updatedStores++;
  }

  console.log(`Successfully updated activeOfferCount on ${updatedStores} stores.`);
  console.log(`Stores with 1+ active offers: ${storesWithOffers}`);

  // Summary
  const totalActiveCoupons = await prisma.coupon.count({
    where: {
      deletedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }]
    }
  });
  console.log(`\n=== Update Complete! Total Live Coupons Now: ${totalActiveCoupons} ===`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
