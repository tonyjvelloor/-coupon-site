import { prisma } from "@/lib/db";
import { connectorRegistry } from "@/lib/import-engine/registry";
import { ImpactConnector } from "@/lib/import-engine/connectors/impact";
import { CJConnector } from "@/lib/import-engine/connectors/cj";
import { CuelinksConnector } from "@/lib/import-engine/connectors/cuelinks/cuelinks.connector";

// Ensure connectors are loaded in API context
const isDev = process.env.NODE_ENV !== "production";
connectorRegistry.register(new ImpactConnector(isDev));
connectorRegistry.register(new CJConnector(isDev));
connectorRegistry.register(new CuelinksConnector());

interface BenchmarkStats {
  sourceId: string;
  name: string;
  totalRuns: number;
  totalRows: number;
  validRows: number;
  duplicates: number;
  avgQuality: number;
  avgLatencyMs: number;
  lastRunDate: Date | null;
  lastRunStatus: string;
}

export default async function ConnectorBenchmarksPage() {
  const registeredConnectors = connectorRegistry.list();
  
  // Aggregate stats per connector
  const benchmarks: BenchmarkStats[] = [];

  for (const connector of registeredConnectors) {
    const c = connector as any;
    const cid = c.sourceId || c.id || c.manifest?.id;
    const cname = c.name || c.manifest?.name || cid;

    const jobs = await prisma.importJob.findMany({
      where: { source: cid },
      orderBy: { createdAt: "desc" }
    });

    const totalRuns = jobs.length;
    let totalRows = 0;
    let validRows = 0;
    let duplicates = 0;
    let published = 0;
    let totalQuality = 0;
    let totalLatency = 0;
    let completedRuns = 0;

    for (const job of jobs) {
      totalRows += job.totalRows;
      validRows += job.validRows;
      duplicates += job.duplicates;
      published += job.published;
      if (job.status === "COMPLETED") {
        totalQuality += job.avgQuality;
        totalLatency += job.apiLatencyMs || job.processingTimeMs || 0;
        completedRuns++;
      }
    }

    benchmarks.push({
      sourceId: cid,
      name: cname,
      totalRuns,
      totalRows,
      validRows,
      duplicates,
      published,
      avgQuality: completedRuns > 0 ? totalQuality / completedRuns : 0,
      avgLatencyMs: completedRuns > 0 ? totalLatency / completedRuns : 0,
      lastRunDate: jobs[0]?.createdAt || null,
      lastRunStatus: jobs[0]?.status || "Never Run"
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Connector Benchmarks</h1>
        <div className="text-sm text-gray-500">
          Compare API performance and data quality across networks
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connector</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Runs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Success</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Automation Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Quality</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duplicates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Latency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {benchmarks.map((b) => {
              const successRate = b.totalRows > 0 ? ((b.validRows / b.totalRows) * 100).toFixed(1) : "0.0";
              const autoRate = b.totalRows > 0 ? ((b.published / b.totalRows) * 100).toFixed(1) : "0.0";
              const dupRate = b.totalRows > 0 ? ((b.duplicates / b.totalRows) * 100).toFixed(1) : "0.0";
              const latencySec = (b.avgLatencyMs / 1000).toFixed(2);
              
              return (
                <tr key={b.sourceId}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.totalRuns}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {successRate}% <span className="text-xs text-gray-400">({b.validRows}/{b.totalRows})</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium text-blue-600">{autoRate}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.avgQuality.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dupRate}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{latencySec} s</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${b.lastRunStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        b.lastRunStatus === 'FAILED' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {b.lastRunStatus}
                    </span>
                    {b.lastRunDate && (
                      <div className="text-xs text-gray-500 mt-1">{b.lastRunDate.toLocaleDateString()}</div>
                    )}
                  </td>
                </tr>
              );
            })}
            
            {benchmarks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No connectors registered or benchmarks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
