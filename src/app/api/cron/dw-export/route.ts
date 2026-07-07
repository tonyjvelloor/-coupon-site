import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

// Simulate a CSV/JSONL export by returning JSON that a downstream service would fetch
export async function GET(request: Request) {
  const log = logger.child({ module: 'DataWarehouseExport' });
  
  // Security check: Only allow authorized requests
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
    log.warn('Unauthorized DW export attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    log.info('Starting Data Warehouse Export');

    // 1. Export Stores Snapshot
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        isActive: true,
        clicks: true,
        revenue: true,
        activeOfferCount: true,
        searchImpressions: true,
      }
    });

    // 2. Export Analytics Events (last 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: yesterday }
      },
      select: {
        id: true,
        type: true,
        entityType: true,
        entityId: true,
        createdAt: true,
      }
    });

    log.info({ storeCount: stores.length, eventCount: events.length }, 'Export complete');

    // Return the structured payload for a downstream BI tool (like BigQuery) to ingest
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      entities: {
        stores,
        events,
      }
    });
  } catch (error) {
    log.error({ err: error }, 'DW Export failed');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
