"use client";

import React from "react";
import Link from "next/link";
import { SearchBox } from "@/components/ui/SearchBox";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroModule({ variant = "control" }: { variant?: string }) {
  const isVariantB = variant === "variant_b";

  return (
    <section className="relative bg-slate-50 text-slate-900 overflow-hidden py-24 border-b border-slate-200">
      {/* Subtle Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 rounded-[100%] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-50/50 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center text-center">
        
        {/* Verification Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 mb-8 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-brand-emerald" />
          <span className="text-overline text-slate-600">
            Updated throughout the day
          </span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-display-xl text-slate-900 max-w-4xl mb-6 tracking-tight font-bold">
          {isVariantB ? (
            <>
              Find working coupons{" "}
              <span className="text-brand-emerald">in seconds.</span>
            </>
          ) : (
            <>
              Never pay full price{" "}
              <span className="text-brand-emerald">again.</span>
            </>
          )}
        </h1>

        <p className="text-body text-slate-500 max-w-2xl mb-12">
          {isVariantB 
            ? "Don't waste time with expired codes. Search for any store, product, or category and instantly unlock working coupons and maximum cashback." 
            : "Search for any store, product, or category and instantly unlock working coupons, cashback, and the smartest ways to save."
          }
        </p>

        {/* The Command Center */}
        <div className="w-full max-w-3xl bg-white p-2 rounded-2xl border border-slate-200 shadow-premium-md mb-10 group focus-within:border-brand-indigo/50 focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-200">
          <SearchBox 
            placeholder="Search Amazon, Flipkart, Myntra, Swiggy..." 
            className="w-full text-slate-900 bg-transparent outline-none h-14 px-4 text-lg placeholder:text-slate-400"
          />
        </div>

        {/* Quick Links / Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-caption">
          <span className="font-medium text-slate-500">Trending:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Amazon", slug: "amazon" },
              { name: "Myntra", slug: "myntra" },
              { name: "Swiggy", slug: "swiggy" }
            ].map((store) => (
              <Link
                key={store.slug}
                href={`/stores/${store.slug}`}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-indigo rounded-full transition-all text-caption text-slate-700 flex items-center gap-1.5 active:scale-95 shadow-sm hover:shadow"
              >
                <span>{store.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-indigo transition-colors" />
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
