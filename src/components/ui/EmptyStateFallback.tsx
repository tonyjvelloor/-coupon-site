"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Info, ArrowRight, Store, RefreshCw } from "lucide-react";

interface EmptyStateFallbackProps {
  title?: string;
  description?: string;
  type?: "category" | "store";
}

export function EmptyStateFallback({
  title = "No active offers found",
  description = "We couldn't find any active deals or coupons right now, but check out these highly recommended alternatives!",
  type = "category"
}: EmptyStateFallbackProps) {
  
  // High conversion trending stores as fallbacks
  const fallbackStores = [
    { name: "Amazon", slug: "amazon", discount: "Up to 80% Off" },
    { name: "Flipkart", slug: "flipkart", discount: "Flat 10% Instant Discount" },
    { name: "Myntra", slug: "myntra", discount: "Extra Rs. 400 Off" },
    { name: "Swiggy", slug: "swiggy", discount: "50% Off Food & Dineout" }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Primary Message */}
      <div className="w-full text-center py-12 px-6 bg-slate-50 dark:bg-on-background/5 rounded-3xl border border-dashed border-surface-variant/30 flex flex-col items-center mb-10 max-w-3xl">
        <div className="w-12 h-12 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo mb-4">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-4">
          <Link 
            href="/stores" 
            className="inline-flex items-center gap-2 bg-brand-indigo hover:bg-brand-indigo-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
          >
            <Store className="w-4 h-4" />
            <span>Browse All Stores</span>
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-white dark:bg-inverse-surface hover:bg-slate-50 dark:hover:bg-on-background/10 text-slate-700 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-surface-variant/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Offers</span>
          </button>
        </div>
      </div>

      {/* Alternative Recommendations Grid */}
      <div className="w-full max-w-4xl text-left">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
          🔥 Trending Stores Today
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fallbackStores.map((store) => {
            const storeLogo = `https://icon.horse/icon/${store.slug}.com`;
            return (
              <Link
                key={store.slug}
                href={`/stores/${store.slug}`}
                className="bg-white dark:bg-inverse-surface rounded-2xl border border-surface-variant/30 p-5 hover:border-brand-indigo/50 hover:shadow-lg transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-surface-variant/20 bg-white relative flex items-center justify-center overflow-hidden mb-3">
                    <Image
                      src={storeLogo}
                      alt={store.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-indigo transition-colors mb-1">
                    {store.name}
                  </h5>
                  <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-4">
                    {store.discount}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-indigo dark:text-primary flex items-center gap-1 mt-auto">
                  <span>View Coupons</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
