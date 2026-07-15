import { NextResponse } from 'next/server';
import { couponService } from '@/lib/services/coupon.service';
import { merchantService } from '@/lib/services/merchant.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet = [], savedStores = [], recentlyViewed = [] } = body;

    // Fetch curated deals
    const curatedDeals = await couponService.getCuratedDeals(wallet, savedStores, 6);

    // Fetch recently viewed stores
    let recentStores = [];
    if (recentlyViewed.length > 0) {
      const promises = recentlyViewed.slice(0, 3).map((slug: string) => merchantService.getMerchantBySlug(slug));
      const results = await Promise.all(promises);
      recentStores = results.filter(Boolean);
    }

    return NextResponse.json({
      curatedDeals,
      recentStores
    });
  } catch (error) {
    console.error('Error in personalization API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
