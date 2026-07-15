import { prisma } from "@/lib/db";
import { ConnectorIntelligenceEngine } from "@/lib/import-engine/intelligence";

export default async function BusinessHealthPage() {
    const connectors = await prisma.connectorSource.findMany({
        orderBy: { name: "asc" }
    });

    const intelligenceEngine = new ConnectorIntelligenceEngine();
    const scores = await intelligenceEngine.calculateScores();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Connector Business Health</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="px-6 py-4">Connector</th>
                            <th className="px-6 py-4">Overall Score</th>
                            <th className="px-6 py-4">Revenue (Percentile)</th>
                            <th className="px-6 py-4">Avg Quality</th>
                            <th className="px-6 py-4">Publish Rate</th>
                            <th className="px-6 py-4">Recommendations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {connectors.map((c) => {
                            const scoreData = scores[c.id];
                            return (
                                <tr key={c.id} className="hover:bg-gray-50 border-b border-gray-100">
                                    <td className="px-6 py-4 font-medium">{c.name} <span className="text-xs text-gray-400">({c.version})</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`text-xl font-bold ${scoreData?.finalScore >= 90 ? 'text-green-600' : scoreData?.finalScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {scoreData?.finalScore || 0}/100
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-green-600 font-semibold">{scoreData?.revenue.toFixed(0)}th</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium">{c.avgQuality.toFixed(1)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{(c.publishRate * 100).toFixed(1)}%</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {scoreData?.recommendations.length ? (
                                            <ul className="list-disc pl-4 text-red-600">
                                                {scoreData.recommendations.map((rec, i) => (
                                                    <li key={i}>{rec}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-green-600">Optimal Performance</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
