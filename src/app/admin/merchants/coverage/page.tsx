import { prisma } from "@/lib/db";
import Link from "next/link";

interface PageProps {
    searchParams: { filter?: string };
}

export default async function MerchantCoveragePage({ searchParams }: PageProps) {
    const filter = searchParams.filter;
    
    // In a real application we would use dynamic WHERE clauses based on the filter.
    // Here we load and filter in memory for demonstration of the coverage logic.
    const merchants = await prisma.store.findMany({
        where: { isActive: true },
        include: { storeContents: true },
        orderBy: { revenue: "desc" },
        take: 100
    });

    const getCoverage = (merchant: any) => {
        let content = 0; // max 15
        let commerce = 0; // max 17
        let knowledge = 0; // max 32
        let trust = 0; // max 36

        const hasContent = (type: string) => merchant.storeContents.some((c: any) => c.type === type);

        if (merchant.logo) content += 2;
        if (merchant.description) content += 5;
        // Timeline mock
        
        if (merchant.activeOfferCount > 0) commerce += 12;
        if (hasContent('STUDENT')) commerce += 5;

        if (hasContent('FAQ')) knowledge += 10;
        if (hasContent('BUYING_GUIDE')) knowledge += 12;
        // Comparisons mock (+10)

        if (hasContent('SHIPPING')) trust += 8;
        if (hasContent('RETURNS')) trust += 8;
        if (hasContent('REFUND') || hasContent('EXCHANGE')) trust += 10;
        // Trust signals mock (+10)

        const total = content + commerce + knowledge + trust;

        return {
            content: { score: content, max: 15, pct: (content / 15) * 100 },
            commerce: { score: commerce, max: 17, pct: (commerce / 17) * 100 },
            knowledge: { score: knowledge, max: 32, pct: (knowledge / 32) * 100 },
            trust: { score: trust, max: 36, pct: (trust / 36) * 100 },
            total: { score: total, max: 100, pct: total },
            missingFaq: !hasContent('FAQ'),
            missingGuide: !hasContent('BUYING_GUIDE'),
            missingLogo: !merchant.logo,
            highRevenue: merchant.revenue > 10000
        };
    };

    let filteredMerchants = merchants.map(m => ({ ...m, coverage: getCoverage(m) }));

    if (filter === 'low-coverage') filteredMerchants = filteredMerchants.filter(m => m.coverage.total.pct < 50);
    if (filter === 'no-faq') filteredMerchants = filteredMerchants.filter(m => m.coverage.missingFaq);
    if (filter === 'no-guide') filteredMerchants = filteredMerchants.filter(m => m.coverage.missingGuide);
    if (filter === 'no-logo') filteredMerchants = filteredMerchants.filter(m => m.coverage.missingLogo);
    if (filter === 'high-revenue') filteredMerchants = filteredMerchants.filter(m => m.coverage.highRevenue);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Merchant Coverage Heatmap</h1>
                <div className="flex gap-2">
                    <Link href="?filter=all" className={`px-4 py-2 text-sm rounded ${!filter || filter==='all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>All</Link>
                    <Link href="?filter=low-coverage" className={`px-4 py-2 text-sm rounded ${filter==='low-coverage' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Low Coverage</Link>
                    <Link href="?filter=no-faq" className={`px-4 py-2 text-sm rounded ${filter==='no-faq' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>No FAQ</Link>
                    <Link href="?filter=no-guide" className={`px-4 py-2 text-sm rounded ${filter==='no-guide' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>No Guide</Link>
                    <Link href="?filter=high-revenue" className={`px-4 py-2 text-sm rounded ${filter==='high-revenue' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>High Revenue</Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-700 text-sm tracking-wider border-b">
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4">Overall Coverage</th>
                            <th className="px-6 py-4">Content</th>
                            <th className="px-6 py-4">Commerce</th>
                            <th className="px-6 py-4">Knowledge</th>
                            <th className="px-6 py-4">Trust</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredMerchants.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">
                                    {m.name}
                                    <div className="text-xs text-green-600">₹{m.revenue.toLocaleString()} Rev</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-sm h-4">
                                            <div className="bg-indigo-600 h-4 rounded-sm" style={{ width: `${m.coverage.total.pct}%` }}></div>
                                        </div>
                                        <span className="text-sm font-semibold">{m.coverage.total.score}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 bg-gray-200 rounded-sm h-2">
                                        <div className="bg-blue-400 h-2 rounded-sm" style={{ width: `${m.coverage.content.pct}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 bg-gray-200 rounded-sm h-2">
                                        <div className="bg-green-400 h-2 rounded-sm" style={{ width: `${m.coverage.commerce.pct}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 bg-gray-200 rounded-sm h-2">
                                        <div className="bg-purple-400 h-2 rounded-sm" style={{ width: `${m.coverage.knowledge.pct}%` }}></div>
                                    </div>
                                    {m.coverage.missingFaq && <span className="text-[10px] text-red-500 uppercase tracking-wide block mt-1">Missing FAQ</span>}
                                    {m.coverage.missingGuide && <span className="text-[10px] text-red-500 uppercase tracking-wide block mt-1">Missing Guide</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-16 bg-gray-200 rounded-sm h-2">
                                        <div className="bg-yellow-400 h-2 rounded-sm" style={{ width: `${m.coverage.trust.pct}%` }}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
