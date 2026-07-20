import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function KnowledgeROIPage() {
    const contents = await prisma.storeContent.findMany({
        include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } },
        orderBy: { revenue: "desc" },
        take: 100
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Knowledge ROI Dashboard</h1>
            <p className="text-gray-600 mb-8">Measure the business impact of your editorial and merchant knowledge assets.</p>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm tracking-wider border-b">
                            <th className="px-6 py-4">Asset Type</th>
                            <th className="px-6 py-4">Merchant</th>
                            <th className="px-6 py-4 text-right">Revenue</th>
                            <th className="px-6 py-4 text-right">Clicks</th>
                            <th className="px-6 py-4 text-right">CTR</th>
                            <th className="px-6 py-4 text-right">Conversions</th>
                            <th className="px-6 py-4 text-right">Last Verified</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contents.map((c) => {
                            const ctr = c.visitors > 0 ? (c.clicks / c.visitors) * 100 : 0;
                            return (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {c.type.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {c.store.name}
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                                        ₹{c.revenue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                        {c.clicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-600">
                                        {ctr.toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 text-right text-indigo-600 font-medium">
                                        {c.conversions.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                                        {c.lastVerified ? c.lastVerified.toLocaleDateString() : "Never"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {contents.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-white shadow rounded-lg mt-4">
                    No knowledge assets found.
                </div>
            )}
        </div>
    );
}
