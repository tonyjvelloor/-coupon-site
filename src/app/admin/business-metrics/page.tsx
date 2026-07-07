import { prisma } from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function BusinessMetricsPage() {
  // 1. Funnel Metrics
  const funnelEvents = await prisma.analyticsEvent.groupBy({
    by: ['type'],
    where: {
      type: {
        in: ['OFFER_IMPORTED', 'OFFER_PUBLISHED', 'OFFER_INDEXED', 'OFFER_CLICKED', 'OFFER_CONVERTED']
      }
    },
    _count: true
  });

  const funnelMap = funnelEvents.reduce((acc, event) => {
    acc[event.type] = event._count;
    return acc;
  }, {} as Record<string, number>);

  const imported = funnelMap['OFFER_IMPORTED'] || 0;
  const published = funnelMap['OFFER_PUBLISHED'] || 0;
  const clicks = funnelMap['OFFER_CLICKED'] || 0;
  const conversions = funnelMap['OFFER_CONVERTED'] || 0;

  // 2. Top Performing Stores
  const topStores = await prisma.store.findMany({
    orderBy: { revenue: 'desc' },
    take: 10,
    select: { id: true, name: true, clicks: true, revenue: true }
  });

  // 3. Top Performing Collections
  const topCollections = await prisma.collection.findMany({
    orderBy: { revenueAttribution: 'desc' },
    take: 5,
    select: { id: true, name: true, totalClicks: true, totalConversions: true, revenueAttribution: true }
  });

  // Calculate global RPIP (Revenue Per Indexed Page)
  // For now, approximate "indexed pages" as stores + collections + published offers
  const totalIndexed = (await prisma.store.count()) + (await prisma.collection.count());
  const totalRevenue = topStores.reduce((sum, s) => sum + s.revenue, 0); // Simplified calculation
  
  const rpip = totalIndexed > 0 ? totalRevenue / totalIndexed : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Business Metrics</h1>
        <p className="text-slate-500 mt-2">Funnel performance, revenue attribution, and RPIP.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm border-slate-200 flex flex-col">
          <span className="text-sm font-medium text-slate-500">North Star: RPIP</span>
          <span className="text-3xl font-bold text-emerald-600 mt-2">{formatCurrency(rpip)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm border-slate-200 flex flex-col">
          <span className="text-sm font-medium text-slate-500">Total Revenue Tracked</span>
          <span className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm border-slate-200 flex flex-col">
          <span className="text-sm font-medium text-slate-500">Automation Rate</span>
          <span className="text-3xl font-bold text-indigo-600 mt-2">
            {imported > 0 ? ((published / imported) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm border-slate-200 flex flex-col">
          <span className="text-sm font-medium text-slate-500">Global Conversion Rate</span>
          <span className="text-3xl font-bold text-amber-600 mt-2">
            {clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Full Funnel */}
        <div className="bg-white rounded-xl border shadow-sm border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Conversion Funnel</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">1. Imported</span>
              <span className="text-slate-500">{formatNumber(imported)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">2. Published</span>
              <span className="text-slate-500">{formatNumber(published)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">3. Indexed (Approx)</span>
              <span className="text-slate-500">{formatNumber(totalIndexed)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">4. Clicked</span>
              <span className="text-slate-500">{formatNumber(clicks)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">5. Converted</span>
              <span className="text-emerald-600 font-bold">{formatNumber(conversions)}</span>
            </div>
          </div>
        </div>

        {/* Top Stores */}
        <div className="bg-white rounded-xl border shadow-sm border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Top Stores by Revenue</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {topStores.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No revenue data yet.</div>
            ) : (
              topStores.map(store => (
                <div key={store.id} className="p-4 px-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900">{store.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatNumber(store.clicks)} clicks
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">{formatCurrency(store.revenue)}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      EPC: {store.clicks > 0 ? formatCurrency(store.revenue / store.clicks) : '$0.00'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
