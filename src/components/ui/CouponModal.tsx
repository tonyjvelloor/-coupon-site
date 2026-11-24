"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { X, Copy, Check, ExternalLink, Sparkles, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { voteCouponAction } from "@/app/actions/coupon";
import confetti from "canvas-confetti";
import { formatDistanceToNow } from "date-fns";

interface CouponModalProps {
  coupon: {
    id: string;
    title: string;
    code?: string;
    description?: string;
    affiliateUrl: string;
    storeName: string;
    storeLogo?: string;
    source?: string;
    successRate?: number;
    successCount?: number;
    failureCount?: number;
    usageCount?: number;
    lastVerifiedAt?: Date | string | null;
  };
  onClose: () => void;
}

function buildMonetizedOutUrl(rawUrl: string, couponId: string, source: string): string {
  if (!rawUrl) return "/stores";
  if (rawUrl.startsWith("/out?")) return rawUrl;
  if (rawUrl.startsWith("/")) return rawUrl;
  return `/out?url=${encodeURIComponent(rawUrl)}&couponId=${encodeURIComponent(couponId)}&source=${encodeURIComponent(source)}`;
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const [openedStore, setOpenedStore] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  const source = coupon.source || "coupon-modal";
  const outUrl = buildMonetizedOutUrl(coupon.affiliateUrl, coupon.id, source);

  const handleVote = async (type: "up" | "down") => {
    if (vote) return;
    setVote(type);
    trackEvent("coupon_voted", { couponId: coupon.id, type });
    await voteCouponAction(coupon.id, type === "up");
  };

  const totalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
  const verifiedRate =
    totalVotes >= 3
      ? Math.round(((coupon.successCount || 0) / totalVotes) * 100)
      : null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCopyAndOpen = (e: React.MouseEvent, shouldOpenTab: boolean = true) => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code).catch(() => {});
      setCopied(true);

      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 36,
        spread: 55,
        origin: { x, y },
        colors: ["#10b981", "#34d399", "#059669"],
        disableForReducedMotion: true,
        zIndex: 150,
      });

      trackEvent("modal_coupon_copied", { couponId: coupon.id, source });
      setTimeout(() => setCopied(false), 3000);
    }

    if (shouldOpenTab && !openedStore) {
      setOpenedStore(true);
      trackEvent("modal_continue_clicked", { storeName: coupon.storeName, source });
      // Open monetized /out redirect in a new tab so the copied code stays visible here
      window.open(outUrl, "_blank", "noopener,noreferrer");
    }
  };

  const storeLogo = coupon.storeLogo || "";

  return (
    <div className="fixed inset-0 z-[100] flex sm:items-center items-end justify-center sm:p-4 px-0 pb-0 pt-12">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white sm:border border-slate-200 sm:rounded-2xl rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] max-w-md w-full overflow-hidden z-10 flex flex-col sm:animate-scale-up animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="px-6 pt-9 pb-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 mb-4 rounded-xl border border-slate-100 flex items-center justify-center shadow-sm relative overflow-hidden bg-white">
            <SafeImage
              src={storeLogo}
              alt={coupon.storeName}
              fill
              className="object-contain p-2"
              unoptimized
              fallbackText={coupon.storeName}
              fallbackClassName="text-lg font-bold text-slate-500"
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {coupon.code ? "Promo Code Ready" : "Verified Deal Activated"}
          </h2>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">
            {coupon.title}
          </p>

          {/* Factual Status Strip (zero fabricated metrics) */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center gap-4 py-2.5 px-3 mb-5 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified {coupon.lastVerifiedAt ? formatDistanceToNow(new Date(coupon.lastVerifiedAt), { addSuffix: true }).replace("about ", "") : "Today"}
            </span>
            {verifiedRate !== null && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700">
                  {verifiedRate}% worked ({totalVotes} votes)
                </span>
              </>
            )}
          </div>

          {/* Code Section */}
          {coupon.code ? (
            <div className="w-full mb-5">
              <button
                type="button"
                onClick={(e) => handleCopyAndOpen(e, true)}
                className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all active:scale-[0.98] ${
                  copied
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-indigo-300 bg-indigo-50/40 hover:border-indigo-500 hover:bg-indigo-50"
                }`}
              >
                <span className="font-mono text-2xl font-extrabold text-slate-900 tracking-wider mb-1.5 select-all">
                  {coupon.code}
                </span>

                <div className="flex items-center gap-2 text-xs font-bold">
                  {copied ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Check className="w-4 h-4" /> Copied! Paste at {coupon.storeName} checkout
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-indigo-700">
                      <Copy className="w-4 h-4" /> Copy code &amp; open {coupon.storeName}
                    </span>
                  )}
                </div>
              </button>
              {openedStore && (
                <p className="text-xs text-slate-500 mt-2">
                  Opened {coupon.storeName} in a new tab. Keep this window open if you need to re-copy the code.
                </p>
              )}
            </div>
          ) : (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-emerald-600 mb-1.5" />
              <span className="font-bold text-sm text-emerald-800">
                No code needed — discount applies via link
              </span>
            </div>
          )}

          {/* Feedback Voting UI */}
          {(copied || openedStore || !coupon.code) && (
            <div className="w-full flex flex-col items-center mt-1 mb-2">
              <p className="text-xs text-slate-600 font-semibold mb-2.5">Did this offer work for you?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleVote("up")}
                  disabled={vote !== null}
                  className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    vote === "up"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  } ${vote === "down" ? "opacity-50 grayscale" : ""}`}
                >
                  <span>👍</span> Worked
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("down")}
                  disabled={vote !== null}
                  className={`px-3.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    vote === "down"
                      ? "bg-slate-100 border-slate-300 text-slate-800"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  } ${vote === "up" ? "opacity-50 grayscale" : ""}`}
                >
                  <span>👎</span> Didn&apos;t work
                </button>
              </div>
              {vote && (
                <p className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Thanks for verifying this offer!
                </p>
              )}
            </div>
          )}

          {/* Stacking Tip linking to Bank Card Finder */}
          <div className="w-full h-px bg-slate-100 my-4" />
          <div className="w-full bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-left flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Tip:</strong> Stack HDFC, ICICI, SBI, or Axis instant card discounts at checkout.
              </p>
            </div>
            <Link
              href="/tools/card-finder"
              onClick={onClose}
              className="shrink-0 text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-0.5"
            >
              Cards <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="p-4 pb-safe sm:pb-4 bg-slate-50 border-t border-slate-100 mt-auto">
          <a
            href={outUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setOpenedStore(true);
              trackEvent("modal_continue_clicked", { storeName: coupon.storeName, source });
            }}
            className="w-full flex items-center justify-center gap-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm active:scale-[0.98]"
          >
            Continue to {coupon.storeName}
            <ExternalLink className="w-4 h-4 text-emerald-100" />
          </a>
        </div>
      </div>
    </div>
  );
}
