"use client";

import React from "react";
import Link from "next/link";
import { SearchBox } from "@/components/ui/SearchBox";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroModule() {
  return (
    <section className="relative bg-[#0A0A0A] dark:bg-black text-white overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 border-b border-white/5">
      {/* Premium Deep Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-indigo/20 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-purple/10 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center text-center">
        
        {/* Verification Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-8 animate-fade-in-up shadow-premium-sm">
          <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
            24,051 users saved money today
          </span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-5xl md:text-7xl font-display-lg font-bold tracking-tight max-w-4xl leading-[1.1] mb-6 animate-fade-in-up [animation-delay:100ms] opacity-0">
          Smart shopping starts with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient bg-[length:200%_auto]">
            verified savings.
          </span>
        </h1>

        <p className="font-body-lg text-slate-400 max-w-2xl text-lg mb-12 leading-relaxed animate-fade-in-up [animation-delay:200ms] opacity-0">
          Stop wasting time on expired codes. Search for any store, product, or category and instantly unlock maximum cashback and working coupons.
        </p>

        {/* The Command Center */}
        <div className="w-full max-w-3xl bg-white/5 p-2 rounded-[24px] border border-white/10 backdrop-blur-xl shadow-premium-glow mb-10 animate-fade-in-up [animation-delay:300ms] opacity-0 group focus-within:border-brand-indigo/50 focus-within:bg-white/10 transition-all duration-300">
          <SearchBox 
            placeholder="Search Amazon, Flipkart, Myntra, Swiggy..." 
            className="w-full text-white bg-transparent outline-none h-14 px-4 text-lg placeholder:text-slate-500"
          />
        </div>

        {/* Quick Links / Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm animate-fade-in-up [animation-delay:400ms] opacity-0">
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
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all text-xs font-semibold text-slate-300 flex items-center gap-1.5 active:scale-95"
              >
                <span>{store.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
