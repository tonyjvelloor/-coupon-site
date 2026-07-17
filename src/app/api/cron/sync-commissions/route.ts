import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CJCommissionClient } from '@/lib/import-engine/connectors/cj/commission-client';
import crypto from 'crypto';

// Optional: Force dynamic evaluation if this is a GET route used for cron
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Verify cron secret (if set)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && token !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Initialize the CJ Client
    const client = new CJCommissionClient();

    // 3. Define the timeframe: last 48 hours to now
    const now = new Date();
    const beforePostingDate = now.toISOString();
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);
    const sincePostingDate = twoDaysAgo.toISOString();

    console.log(`[CJ Commissions Sync] Fetching from ${sincePostingDate} to ${beforePostingDate}`);

    // 4. Fetch the data
    const result = await client.fetchCommissions(sincePostingDate, beforePostingDate);
    const records = result?.records || [];

    let processedCount = 0;
    let newCount = 0;

    // 5. Upsert records into Prisma
    for (const record of records) {
      // Use originalActionId if available, otherwise generate a unique hash
      const transactionId = record.originalActionId || 
        crypto.createHash('sha256')
              .update(`${record.postingDate}-${record.advertiserName}-${record.pubCommissionAmountUsd}`)
              .digest('hex');

      const saleAmount = record.saleAmountPubCurrency || 0;
      const commissionAmount = record.pubCommissionAmountUsd || 0;
      const status = record.actionStatus || "UNKNOWN";

      await prisma.affiliatePostback.upsert({
        where: { transactionId },
        update: {
          status,
          saleAmount,
          commissionAmount,
          rawPayload: record,
          updatedAt: new Date(),
        },
        create: {
          network: "cj",
          transactionId,
          status,
          saleAmount,
          commissionAmount,
          rawPayload: record,
        }
      });

      processedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `CJ Commission sync complete. Processed ${processedCount} records.`,
      timeframe: { sincePostingDate, beforePostingDate },
      processedCount
    });

  } catch (error: any) {
    console.error('[CJ Commissions Sync] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
