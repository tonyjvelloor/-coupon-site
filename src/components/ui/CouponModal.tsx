"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, ThumbsUp, ThumbsDown, ExternalLink, Sparkles } from "lucide-react";

interface CouponModalProps {
  coupon: {
    id: string;
    title: string;
    code?: string;
    description?: string;
    affiliateUrl: string;
    storeName: string;
    storeLogo?: string;
  };
  onClose: () => void;
}

/** Masks the second half of a code */
function maskCode(code: string): string {
  const visibleLen = Math.ceil(code.length / 2);
  return code.slice(0, visibleLen) + "•".repeat(code.length - visibleLen);
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

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

  const handleRevealAndCopy = () => {
    setRevealed(true);
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const storeLogo = coupon.storeLogo || `https://icon.horse/icon/${coupon.storeName.toLowerCase().replace(/\s+/g, '')}.com`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10 flex flex-col animate-scale-up">
        {/* Close */}
        <div className="flex justify-end p-3 absolute right-0 top-0 z-20">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-10 pb-7 flex flex-col items-center text-center">
          {/* Store logo */}
          <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 relative flex items-center justify-center shadow-sm p-2 overflow-hidden mb-4">
            <Image
              src={storeLogo}
              alt={coupon.storeName}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug max-w-sm mb-1">
            {coupon.title}
          </h2>

          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            at {coupon.storeName}
          </p>

          {coupon.code ? (
            /* ── Coupon Code: Half-reveal → Full reveal ── */
            <div className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl p-5 mb-5">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 block">
                Copy code & apply at checkout
              </span>

              <div className="flex items-center gap-2 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 justify-between">
                <span className="font-mono text-xl font-bold text-gray-900 dark:text-white tracking-wider select-all">
                  {revealed || copied ? coupon.code : maskCode(coupon.code)}
                </span>
                <button
                  onClick={handleRevealAndCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shrink-0 ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                  }`}
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy Code</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ── Coupon Activated (No Code Needed) ── */
            <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-5 mb-5 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-emerald-500" />
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">Coupon Activated!</span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400/80">
                No code needed. The discount will be automatically applied when you shop at {coupon.storeName}.
              </p>
            </div>
          )}

          {/* How it works */}
          <div className="w-full text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
            <h4 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
              How it works
            </h4>
            <ol className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 text-[10px]">1</span>
                <span>{coupon.code ? "Copy the code above" : "We've activated the deal for you"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 text-[10px]">2</span>
                <span>The store is open in a new tab</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 text-[10px]">3</span>
                <span>{coupon.code ? "Paste the code at checkout to save!" : "Shop and the discount is applied automatically!"}</span>
              </li>
            </ol>
          </div>

          {/* CTA */}
          <a
            href={coupon.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] mb-5"
          >
            <span>Go to {coupon.storeName}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Feedback */}
          <div className="border-t border-gray-100 dark:border-gray-800 w-full pt-4 flex flex-col items-center">
            {voted ? (
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                ❤️ Thanks for keeping CouponHub verified!
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Did this work?
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setVoted("up")}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-emerald-500 hover:border-emerald-300 transition-all"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setVoted("down")}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-300 transition-all"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
