"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({ task }: { task: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const proposal = task.generatedData as any;
  const proposalData = proposal?.data || {};

  // For field selection: true means apply this field
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    Object.keys(proposalData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/intelligence/${task.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedFields })
      });
      if (!res.ok) throw new Error("Failed to approve");
      router.refresh();
      router.push("/admin/intelligence");
    } catch (e) {
      console.error(e);
      alert("Failed to apply");
      setLoading(false);
    }
  };

  if (!proposal) {
    return <div className="text-gray-500">No generated data available.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Confidence: {proposal.confidence}%
          </div>
        </div>
        <p className="text-sm text-gray-700 italic border-l-4 border-gray-300 pl-4 mb-4">
          "{proposal.reasoning}"
        </p>
      </div>

      <h3 className="font-bold text-sm mb-3 border-b pb-2">Proposed Fields (Select to apply)</h3>
      
      <div className="space-y-4 mb-8 h-80 overflow-auto">
        {Object.entries(proposalData).map(([key, value]) => (
          <div key={key} className="flex gap-4 p-3 bg-gray-50 rounded border">
            <input 
              type="checkbox" 
              className="mt-1"
              checked={selectedFields[key]}
              onChange={(e) => setSelectedFields({...selectedFields, [key]: e.target.checked})}
              disabled={task.status !== "PENDING_REVIEW"}
            />
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{key}</label>
              <div className="text-sm mt-1 text-gray-900 break-all">{String(value)}</div>
            </div>
          </div>
        ))}
      </div>

      {task.status === "PENDING_REVIEW" && (
        <div className="flex gap-4 pt-4 border-t">
          <button 
            onClick={handleApprove}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Applying..." : "Approve & Apply"}
          </button>
        </div>
      )}
    </div>
  );
}
