"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";

interface InteractiveDealCardProps {
    storeName: string;
    dealTitle: string;
    couponCode?: string | null;
    discountBadge?: string;
    affiliateUrl: string;
    verifiedText?: string;
}

export function InteractiveDealCard({
    storeName,
    dealTitle,
    couponCode,
    discountBadge,
    affiliateUrl,
    verifiedText = "Verified for Diwali 2026",
}: InteractiveDealCardProps) {
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        if (couponCode) {
            navigator.clipboard.writeText(couponCode).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="not-prose my-6 rounded-2xl border-2 border-amber-200/80 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-yellow-50/40 p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            {discountBadge || "Diwali Special"}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ {verifiedText}
                        </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 leading-snug">
                        {dealTitle}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                        Store: <span className="font-semibold text-slate-700">{storeName}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {couponCode ? (
                        <button
                            onClick={handleAction}
                            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-lg active:scale-95"
                        >
                            <span className="font-mono tracking-wider bg-black/15 px-2 py-0.5 rounded border border-white/20">
                                {couponCode}
                            </span>
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-200 animate-bounce" />
                                    <span>Copied & Applied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
                                    <span>Copy & Go</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleAction}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
                        >
                            <span>Claim Offer</span>
                            <ExternalLink className="w-4 h-4 text-amber-400" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
