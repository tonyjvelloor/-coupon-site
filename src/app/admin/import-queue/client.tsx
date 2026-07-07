"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportQueueClient({ offers, stores }: { offers: any[], stores: any[] }) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedStores, setSelectedStores] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleAction = async (id: string, action: "publish" | "reject", storeId?: string) => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/admin/import-queue/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId })
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to ${action}: ${data.error}`);
      }
    } catch (error) {
      alert(`Error performing ${action}`);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant Resolution</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offers.map((offer) => {
            const data = typeof offer.normalizedData === 'string' ? JSON.parse(offer.normalizedData) : offer.normalizedData;
            
            const currentSelectedStore = selectedStores[offer.id] || offer.suggestedStoreId || "";

            return (
              <tr key={offer.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{data.title}</div>
                  {data.code && <div className="text-xs font-mono bg-gray-100 inline-block px-1 rounded mt-1">{data.code}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 mb-1">Imported: <span className="font-medium text-gray-900">{data.merchantName}</span></div>
                  
                  {offer.suggestedStoreId && (
                    <div className="mb-2 p-2 bg-blue-50 rounded text-xs border border-blue-100">
                      <div className="font-semibold text-blue-800">Suggested: {offer.suggestedStoreName}</div>
                      <div className="text-blue-600 mt-1">
                        Confidence: {typeof offer.resolutionConfidence === 'object' ? offer.resolutionConfidence?.fuzzy || offer.resolutionConfidence?.domain || offer.resolutionConfidence?.alias || 0 : 0}% 
                        <span className="mx-1">•</span> 
                        Reason: {offer.resolutionReason}
                      </div>
                    </div>
                  )}

                  <select 
                    value={currentSelectedStore}
                    onChange={(e) => setSelectedStores({...selectedStores, [offer.id]: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">-- Auto-create new Store --</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xl font-bold text-gray-900">{offer.finalQualityScore}</div>
                  <div className="text-xs text-gray-500 mt-1">Dup Risk: {offer.duplicateRisk}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleAction(offer.id, "publish", currentSelectedStore || undefined)}
                    disabled={processing === offer.id}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded disabled:opacity-50"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleAction(offer.id, "reject")}
                    disabled={processing === offer.id}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
