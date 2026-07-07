import { prisma } from "@/lib/db";

export default async function ResolverMetricsPage() {
  const allOffers = await prisma.importedOffer.findMany({
    select: {
      id: true,
      status: true,
      resolvedStoreId: true,
      suggestedStoreId: true,
      resolutionSource: true,
      confidenceScore: true,
      importJob: { select: { id: true, published: true } } // This isn't perfect for manual override tracking, but we can look at the offer's status
    }
  });

  const totalOffers = allOffers.length;
  
  let autoResolved = 0;
  let suggested = 0;
  let manualOverrides = 0; // We'd ideally track this in an AuditLog, but we can't easily query it here. We'll leave it as a placeholder.
  let unknown = 0;
  let totalConfidence = 0;

  const sources = {
    Exact: 0,
    Alias: 0,
    Domain: 0,
    Fuzzy: 0,
    Unknown: 0
  };

  for (const offer of allOffers) {
    if (offer.resolvedStoreId) autoResolved++;
    else if (offer.suggestedStoreId) suggested++;
    else unknown++;

    if (offer.resolutionSource) {
      if (sources.hasOwnProperty(offer.resolutionSource)) {
        sources[offer.resolutionSource as keyof typeof sources]++;
      } else {
        sources.Unknown++;
      }
    } else {
      sources.Unknown++;
    }

    totalConfidence += offer.confidenceScore || 0;
  }

  const autoResRate = totalOffers > 0 ? ((autoResolved / totalOffers) * 100).toFixed(1) : "0.0";
  const suggestedRate = totalOffers > 0 ? ((suggested / totalOffers) * 100).toFixed(1) : "0.0";
  const avgConfidence = totalOffers > 0 ? (totalConfidence / totalOffers).toFixed(1) : "0.0";

  const aliasCount = await prisma.merchantAlias.count();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Merchant Resolver Metrics</h1>
        <div className="text-sm text-gray-500">
          Tracking the intelligence of the import pipeline
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Auto Resolution Rate" value={`${autoResRate}%`} subtitle={`${autoResolved} of ${totalOffers} offers`} />
        <MetricCard title="Suggested Resolution" value={`${suggestedRate}%`} subtitle={`${suggested} of ${totalOffers} offers`} />
        <MetricCard title="Alias Knowledge Base" value={aliasCount.toString()} subtitle="Total learned merchant aliases" />
        <MetricCard title="Average Confidence" value={`${avgConfidence}%`} subtitle="Across all processed offers" />
        <MetricCard title="Unknown Merchants" value={unknown.toString()} subtitle="Required full manual assignment" />
        <MetricCard title="Manual Overrides" value="Tracking Soon" subtitle="Requires AuditLog integration" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Resolution Sources</h2>
        <div className="space-y-4">
          <SourceBar label="Exact Match" count={sources.Exact} total={totalOffers} color="bg-green-500" />
          <SourceBar label="Learned Alias" count={sources.Alias} total={totalOffers} color="bg-blue-500" />
          <SourceBar label="Domain Match" count={sources.Domain} total={totalOffers} color="bg-purple-500" />
          <SourceBar label="Fuzzy Logic" count={sources.Fuzzy} total={totalOffers} color="bg-orange-500" />
          <SourceBar label="Unknown / Failed" count={sources.Unknown} total={totalOffers} color="bg-red-500" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: { title: string, value: string | number, subtitle: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-2 text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}

function SourceBar({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>{label}</span>
        <span>{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
