import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Universal webhook endpoint for Affiliate Server-to-Server (S2S) Postbacks.
 * 
 * Example URL configuration for an affiliate network:
 * https://couponhub.example.com/api/webhooks/postbacks?network=impact&transaction_id={OrderID}&sale={ActionTracker.Amount}&commission={ActionTracker.Payout}&click_id={SubId1}
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const network = searchParams.get('network') || 'unknown';
  const transactionId = searchParams.get('transaction_id');
  const clickId = searchParams.get('click_id');
  const saleAmount = parseFloat(searchParams.get('sale') || '0');
  const commissionAmount = parseFloat(searchParams.get('commission') || '0');
  
  const log = logger.child({ module: 'PostbackWebhook', network, transactionId });

  if (!transactionId) {
    log.warn('Received postback without transaction ID');
    return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
  }

  try {
    // 1. Record the raw postback
    const postback = await prisma.affiliatePostback.upsert({
      where: { transactionId },
      create: {
        network,
        transactionId,
        clickId,
        saleAmount,
        commissionAmount,
        status: 'PENDING',
        rawPayload: Object.fromEntries(searchParams.entries()),
      },
      update: {
        saleAmount,
        commissionAmount,
        rawPayload: Object.fromEntries(searchParams.entries()),
        updatedAt: new Date(),
      }
    });

    // 2. Try to attribute revenue to a specific Store/Coupon if we have a clickId
    // In a real system, you would look up the ClickEvent by clickId and update the related Store
    if (clickId && !postback.processed && commissionAmount > 0) {
      // Placeholder: If clickId is structured like "storeId_couponId_userId"
      const [storeId] = clickId.split('_');
      
      if (storeId) {
        // Increment the store's revenue intrinsically
        await prisma.store.update({
          where: { id: storeId },
          data: { revenue: { increment: commissionAmount } }
        });
        
        await prisma.affiliatePostback.update({
          where: { id: postback.id },
          data: { processed: true, status: 'APPROVED' }
        });
        
        log.info({ storeId, commissionAmount }, 'Attributed revenue to store');
      }
    }

    return NextResponse.json({ success: true, id: postback.id });
  } catch (error) {
    log.error({ err: error }, 'Failed to process postback');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
