import { prisma } from "@/lib/db";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import Link from "next/link";
import { AlertCircle, FileText, TrendingDown, Clock } from "lucide-react";

export default async function MerchantOpsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Stale Merchants
  const staleMerchants = await prisma.store.findMany({
    where: {
      OR: [
        { lastImportedAt: { lt: thirtyDaysAgo } },
        { lastImportedAt: null },
      ],
      isActive: true,
    },
    take: 10,
    orderBy: { clicks: 'desc' },
    select: { id: true, name: true, lastImportedAt: true, clicks: true },
  });

  // 2. Empty Shelves
  const emptyShelves = await prisma.store.findMany({
    where: {
      activeOfferCount: 0,
      isActive: true,
    },
    take: 10,
    orderBy: { clicks: 'desc' },
    select: { id: true, name: true, clicks: true, activeOfferCount: true },
  });

  // 3. Leaking Traffic
  const leakingTraffic = await prisma.store.findMany({
    where: {
      clicks: { gt: 100 },
      revenue: 0,
      isActive: true,
    },
    take: 10,
    orderBy: { clicks: 'desc' },
    select: { id: true, name: true, clicks: true, revenue: true },
  });

  // 4. Thin Content
  const thinContent = await prisma.store.findMany({
    where: {
      OR: [
        { aboutContent: null },
        { aboutContent: '' },
        { faqContent: null },
        { faqContent: '' },
      ],
      isActive: true,
    },
    take: 10,
    orderBy: { clicks: 'desc' },
    select: { id: true, name: true, clicks: true, aboutContent: true, faqContent: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Merchant Operations</h1>
        <p className="text-slate-500 mt-2">Commercial command center for business operators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaking Traffic */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center bg-red-50/50">
            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-slate-900">Leaking Traffic</h3>
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">High Priority</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-500 mb-4">Merchants generating &gt;100 clicks but $0 revenue.</p>
            {leakingTraffic.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">No leaking traffic detected.</div>
            ) : (
              <div className="space-y-3">
                {leakingTraffic.map(store => (
                  <div key={store.id} className="flex justify-between items-center text-sm border border-slate-100 p-3 rounded-lg">
                    <Link href={`/admin/stores/${store.id}`} className="font-medium text-blue-600 hover:underline">{store.name}</Link>
                    <div className="text-right">
                      <div className="font-semibold text-slate-700">{formatNumber(store.clicks)} clicks</div>
                      <div className="text-xs text-red-500">{formatCurrency(store.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty Shelves */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center bg-amber-50/50">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-semibold text-slate-900">Empty Shelves</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-500 mb-4">Active merchants with zero active coupons.</p>
            {emptyShelves.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">No empty shelves detected.</div>
            ) : (
              <div className="space-y-3">
                {emptyShelves.map(store => (
                  <div key={store.id} className="flex justify-between items-center text-sm border border-slate-100 p-3 rounded-lg">
                    <Link href={`/admin/stores/${store.id}`} className="font-medium text-blue-600 hover:underline">{store.name}</Link>
                    <div className="text-right">
                      <div className="font-semibold text-slate-700">{store.activeOfferCount} offers</div>
                      <div className="text-xs text-slate-500">{formatNumber(store.clicks)} clicks</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stale Merchants */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
            <Clock className="h-5 w-5 text-slate-500 mr-2" />
            <h3 className="font-semibold text-slate-900">Stale Merchants</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-500 mb-4">Merchants not successfully imported in 30+ days.</p>
            {staleMerchants.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">No stale merchants detected.</div>
            ) : (
              <div className="space-y-3">
                {staleMerchants.map(store => (
                  <div key={store.id} className="flex justify-between items-center text-sm border border-slate-100 p-3 rounded-lg">
                    <Link href={`/admin/stores/${store.id}`} className="font-medium text-blue-600 hover:underline">{store.name}</Link>
                    <div className="text-right">
                      <div className="font-semibold text-slate-700">
                        {store.lastImportedAt ? formatDate(store.lastImportedAt) : 'Never'}
                      </div>
                      <div className="text-xs text-slate-500">{formatNumber(store.clicks)} clicks</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thin Content */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center bg-blue-50/50">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-semibold text-slate-900">Thin Content</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-500 mb-4">Merchants missing editorial (About / FAQ) content.</p>
            {thinContent.length === 0 ? (
              <div className="text-sm text-slate-400 py-4 text-center">No thin content detected.</div>
            ) : (
              <div className="space-y-3">
                {thinContent.map(store => (
                  <div key={store.id} className="flex justify-between items-center text-sm border border-slate-100 p-3 rounded-lg">
                    <Link href={`/admin/stores/${store.id}`} className="font-medium text-blue-600 hover:underline">{store.name}</Link>
                    <div className="text-right flex gap-2">
                      {!store.aboutContent && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">No About</span>}
                      {!store.faqContent && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">No FAQ</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
