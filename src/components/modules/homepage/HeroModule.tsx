"use client";

import React from "react";
import Link from "next/link";
import { SearchBox } from "@/components/ui/SearchBox";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroModule() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black text-white overflow-hidden py-20 md:py-28 transition-colors duration-300">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-indigo/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center text-center">
        
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-100">
            Over 10,000+ verified offers daily
          </span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl md:text-6xl font-headline-lg font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6">
          Smart shopping starts with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            verified savings.
          </span>
        </h1>

        <p className="font-body-lg text-slate-300 max-w-2xl text-base md:text-lg mb-12 leading-relaxed">
          Join 2M+ smart shoppers getting exclusive coupons, massive cashbacks, and hidden deals across thousands of stores.
        </p>

        {/* Dynamic Search Box */}
        <div className="w-full max-w-2xl bg-white/5 dark:bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-md shadow-2xl mb-10">
          <SearchBox 
            placeholder="Search Amazon, Flipkart, Myntra, Swiggy..." 
            className="w-full text-slate-800"
          />
        </div>

        {/* Quick Links / Popular Searches */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Trending Now:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Amazon", slug: "amazon" },
              { name: "Myntra", slug: "myntra" },
              { name: "Swiggy", slug: "swiggy" }
            ].map((store) => (
              <Link
                key={store.slug}
                href={`/stores/${store.slug}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full transition-all text-xs font-bold text-white flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>{store.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
