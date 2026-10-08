"use client";

import React from "react";
import Link from "next/link";
import { SearchBox } from "@/components/ui/SearchBox";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroModule({ 
  copyVariant = "control", 
  layoutVariant = "control", 
  topDeals = [] 
}: { 
  copyVariant?: string; 
  layoutVariant?: string; 
  topDeals?: any[]; 
}) {
  const isVariantB = copyVariant === "variant_b";
  const showDeals = layoutVariant === "deals_in_hero" && topDeals.length > 0;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Subtle Ambient Glow Canvas Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl"></div>
        <div className="absolute top-6 right-1/4 w-96 h-80 bg-secondary-container/30 rounded-full blur-3xl"></div>
      </div>

      <section className="relative max-w-max-width mx-auto px-gutter-desktop pt-space-xl pb-space-2xl text-center">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-verified-emerald-bg text-secondary mb-space-lg shadow-sm">
          <span className="w-2 h-2 rounded-full bg-verified-emerald animate-pulse"></span>
          <span className="font-label-badge text-label-badge text-secondary font-bold uppercase tracking-wider">Updated Throughout The Day</span>
        </div>

        {/* Main Catchphrase Headline */}
        <h1 className="font-headline-hero text-headline-hero text-on-surface max-w-4xl mx-auto mb-space-md tracking-tight">
          {isVariantB ? "Find working coupons " : "Never pay full price "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-verified-emerald to-secondary">
            {isVariantB ? "in seconds." : "again."}
          </span>
        </h1>

        <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto mb-space-xl">
          {isVariantB 
            ? "Don't waste time with expired codes. Search for any store, product, or category and instantly unlock working coupons, verified cashback, and exclusive glitch deals."
            : "Search for any store, product, or category and instantly unlock working coupons, cashback, and the smartest ways to save."}
        </p>

        {/* Primary Floating Search Container */}
        <div className="max-w-2xl mx-auto mb-space-md">
          <div className="relative flex items-center bg-surface-card rounded-2xl shadow-xl p-2 transition-all group focus-within:shadow-2xl">
            <div className="flex items-center pl-space-md text-primary">
              <span className="material-symbols-outlined text-[26px]">search</span>
            </div>
            <SearchBox 
              placeholder="Search Amazon, Flipkart, Myntra, Swiggy, Nykaa..." 
              className="w-full bg-transparent px-space-sm py-3 font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </div>

        {/* Layout Variant B: Deals in Hero */}
        {showDeals ? (
          <div className="mt-8 max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">🔥 Trending Deals Right Now</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {topDeals.map(deal => (
                <Link 
                  key={deal.id} 
                  href={`/out?url=${encodeURIComponent(deal.affiliateUrl)}&couponId=${deal.id}&storeId=${deal.merchantIdentity.store.id}&source=hero_variant`}
                  target="_blank"
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-indigo/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {deal.merchantIdentity.store.logo ? (
                          <img src={deal.merchantIdentity.store.logo} alt={deal.merchantIdentity.store.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">{deal.merchantIdentity.store.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500 truncate">{deal.merchantIdentity.store.name}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight group-hover:text-brand-indigo transition-colors">{deal.title}</h3>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-verified-emerald bg-emerald-50 px-2 py-1 rounded-md">{deal.code ? "CODE" : "DEAL"}</span>
                    <span className="text-xs text-brand-indigo font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Get Deal <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Control Layout: Quick Filter Pills / Trending */
          <div className="flex flex-wrap items-center justify-center gap-space-xs font-body-sm text-body-sm text-text-muted">
            <span className="font-semibold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-deal-amber text-[16px]">local_fire_department</span> Trending:
            </span>
            {["Amazon", "Flipkart", "Myntra", "Swiggy", "AJIO", "Nykaa"].map(store => (
              <Link 
                key={store}
                href={`/stores/${store.toLowerCase()}`}
                className="trending-chip px-space-sm py-1 rounded-full bg-surface-card text-on-surface shadow-sm hover:bg-brand-indigo-light hover:text-primary transition-all"
              >
                {store}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
