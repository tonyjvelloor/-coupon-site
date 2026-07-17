"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";

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

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // Disable background scrolling when modal is open
    document.body.style.overflow = "hidden";
    
    // Close on Escape key press
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCopy = () => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const storeLogo = coupon.storeLogo || `https://icon.horse/icon/${coupon.storeName.toLowerCase().replace(/\s+/g, '')}.com`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-inverse-surface border border-surface-variant/20 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up z-10 flex flex-col">
        {/* Header with Close */}
        <div className="flex justify-end p-4 absolute right-0 top-0 z-20">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-on-background/10 text-slate-500 dark:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Logo container */}
          <div className="w-20 h-20 rounded-2xl bg-white border border-surface-variant/30 relative flex items-center justify-center shadow-lg p-2 overflow-hidden mb-5">
            <Image
              src={storeLogo}
              alt={coupon.storeName}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>

          <h2 className="font-headline-lg text-2xl font-bold text-slate-900 dark:text-white leading-snug max-w-sm mb-2">
            {coupon.title}
          </h2>
          
          <p className="text-sm font-medium text-brand-indigo dark:text-primary mb-6">
            at {coupon.storeName}
          </p>

          {coupon.code ? (
            <div className="w-full bg-slate-50 dark:bg-on-background/10 border-2 border-dashed border-brand-indigo/30 rounded-2xl p-5 mb-6 flex flex-col items-center">
              <span className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider mb-2">
                Copy code & apply at checkout
              </span>
              <div className="flex items-center gap-3 w-full max-w-sm bg-white dark:bg-inverse-surface rounded-xl border border-surface-variant/30 px-4 py-3 justify-between shadow-sm">
                <span className="font-mono text-xl font-bold text-slate-800 dark:text-white tracking-wider select-all">
                  {coupon.code}
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    copied
                      ? "bg-success-green text-white"
                      : "bg-brand-indigo text-white hover:bg-brand-indigo-dark active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-success-green/5 dark:bg-success-green/10 border border-success-green/20 rounded-2xl p-5 mb-6">
              <p className="text-success-green font-bold text-sm mb-1">
                🎉 No coupon code required!
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                The discount will be automatically applied when you click the button below and shop at {coupon.storeName}.
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="w-full text-left bg-slate-50 dark:bg-on-background/5 rounded-2xl p-5 mb-6">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              How it works:
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold shrink-0">1</span>
                <span>Copy the discount code (if available) shown above.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold shrink-0">2</span>
                <span>We have opened the store site in a new tab.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold shrink-0">3</span>
                <span>Shop and paste the code at checkout to secure your discount!</span>
              </li>
            </ul>
          </div>

          {/* Action CTA */}
          <a
            href={coupon.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-sm flex items-center justify-center gap-2 py-3 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl font-bold transition-all shadow-md shadow-brand-indigo/20 active:scale-95 mb-6"
          >
            <span>Go to {coupon.storeName}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Feedback section */}
          <div className="border-t border-surface-variant/10 w-full pt-5 flex flex-col items-center">
            {voted ? (
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 animate-fade-in">
                ❤️ Thank you for keeping CouponHub verified!
              </p>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Did this discount work?
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVoted("up")}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-surface-variant/30 text-slate-500 dark:text-slate-300 hover:text-success-green hover:border-success-green transition-all"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setVoted("down")}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-surface-variant/30 text-slate-500 dark:text-slate-300 hover:text-error-red hover:border-error-red transition-all"
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
