"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Check } from "lucide-react";

export function BulkGenerateDescriptionsButton({ missingCount }: { missingCount: number }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/stores/bulk-generate-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overwrite: false })
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        alert("Failed to generate store descriptions. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while generating descriptions.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
        <Check className="w-4 h-4" />
        Generated!
      </span>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating {missingCount} Descriptions...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          Fix Store Descriptions ({missingCount})
        </>
      )}
    </button>
  );
}
