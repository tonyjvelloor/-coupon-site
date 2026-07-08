import { prisma } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { Search, Edit3, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function MerchantKnowledgePage() {
    // Fetch all active stores with their contents
    const stores = await prisma.store.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            slug: true,
            clicks: true,
            revenue: true,
            activeOfferCount: true,
            updatedAt: true,
            storeContents: {
                select: { type: true }
            }
        },
    });

    const expectedTypes = ['ABOUT', 'FAQ', 'BUYING_GUIDE', 'RETURNS', 'SHIPPING', 'PAYMENTS', 'STUDENT'];

    const storeData = stores.map(store => {
        const typesPresent = store.storeContents.map(c => c.type);
        const coverageScore = Math.round((typesPresent.length / expectedTypes.length) * 100);
        const coveragePenalty = 100 - coverageScore;
        
        // Freshness: 100 if updated in last 7 days, 50 if last 30, else 0
        const daysSinceUpdate = (Date.now() - new Date(store.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        let freshness = 0;
        if (daysSinceUpdate <= 7) freshness = 100;
        else if (daysSinceUpdate <= 30) freshness = 50;

        // Opportunity Score formula
        // Weighted sum of metrics, minus coverage penalty. 
        // We boost clicks and revenue so they have a meaningful impact against the 0-100 penalty.
        const baseOpportunity = (store.clicks * 0.35) + (store.revenue * 3.0) + (store.activeOfferCount * 2.0) + (freshness * 0.15);
        const opportunityScore = Math.round(baseOpportunity - coveragePenalty);

        return {
            ...store,
            coverageScore,
            opportunityScore,
            typesPresent,
        };
    });

    // Sort by Opportunity Score descending
    storeData.sort((a, b) => b.opportunityScore - a.opportunityScore);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Merchant Knowledge Engine</h1>
                    <p className="text-slate-500 mt-2">Editorial Queue sorted by Revenue Opportunity.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Merchant</th>
                                <th className="px-6 py-4 font-semibold">Opportunity Score</th>
                                <th className="px-6 py-4 font-semibold">Content Matrix</th>
                                <th className="px-6 py-4 font-semibold">Coverage</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {storeData.map(store => (
                                <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{store.name}</div>
                                        <div className="text-slate-500 text-xs mt-1">
                                            {formatNumber(store.clicks)} clicks • {store.activeOfferCount} offers
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-semibold">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            {store.opportunityScore}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1.5">
                                            {expectedTypes.map(type => {
                                                const hasType = store.typesPresent.includes(type as any);
                                                return (
                                                    <div 
                                                        key={type} 
                                                        title={type}
                                                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                                            hasType ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-300'
                                                        }`}
                                                    >
                                                        {type.charAt(0)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                                                <div 
                                                    className={`h-2 rounded-full ${store.coverageScore >= 80 ? 'bg-green-500' : store.coverageScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${store.coverageScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{store.coverageScore}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/admin/stores/${store.id}/edit`}
                                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
