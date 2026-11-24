"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Sparkles, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface MobileStickyDealBarProps {
  storeId: string;
  storeName: string;
  couponId: string;
  title: string;
  discountBadge: string;
  code: string | null;
  affiliateUrl: string;
}

export function MobileStickyDealBar({
  storeId,
  storeName,
  couponId,
  title,
  discountBadge,
  code,
  affiliateUrl,
}: MobileStickyDealBarProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  const outUrl = `/out?url=${encodeURIComponent(affiliateUrl)}&storeId=${encodeURIComponent(
    storeId
  )}&couponId=${encodeURIComponent(couponId)}&source=mobile-sticky-bar&type=${
    code ? "code" : "deal"
  }`;

  const handleAction = () => {
    if (code) {
      navigator.clipboard?.writeText(code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      trackEvent("mobile_sticky_code_copied", { couponId, storeName });
    } else {
      trackEvent("mobile_sticky_deal_clicked", { couponId, storeName });
    }
    window.open(outUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-3 pb-2 pointer-events-none">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl border border-slate-700/80 px-3.5 py-2.5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate">Top {storeName} Offer · {discountBadge}</span>
          </div>
          <p className="text-xs font-semibold text-slate-100 truncate mt-0.5">
            {code ? `Code: ${code}` : title}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAction}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs shadow-sm transition-all"
        >
          {code ? (
            copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy &amp; Go
              </>
            )
          ) : (
            <>
              Get Deal <ExternalLink className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss top offer bar"
          className="shrink-0 p-1 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
