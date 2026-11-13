"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Flame, Calculator, Tag } from "lucide-react";

export function SeasonalSpotlightBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-6 md:p-8 text-white shadow-xl shadow-indigo-900/15 border border-indigo-400/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-10 w-48 h-48 bg-fuchsia-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-indigo-100 border border-white/20">
                        <Flame className="w-3.5 h-3.5 text-amber-300" />
                        <span>November 2026 Sale Tracker</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Black Friday, Nykaa Pink Friday &amp; Cyber Monday 2026 Guides
                    </h2>

                    <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                        Compare upcoming markdowns across <strong>Nykaa</strong>, <strong>Myntra</strong>, <strong>Amazon India</strong>, <strong>Flipkart</strong>, and <strong>Croma</strong>. Learn how bank instant-discount caps and No-Cost EMI GST affect your actual savings.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                        <Link
                            href="/events/nykaa-pink-friday-sale-2026"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 hover:bg-black/40 px-2.5 py-1.5 text-pink-200 border border-white/10 transition-colors"
                        >
                            <Tag className="w-3 h-3 text-pink-300" />
                            Nykaa Pink Friday 2026
                        </Link>
                        <Link
                            href="/events/black-friday-sale-india-2026"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 hover:bg-black/40 px-2.5 py-1.5 text-indigo-100 border border-white/10 transition-colors"
                        >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            Black Friday India 2026
                        </Link>
                        <Link
                            href="/tools/card-vs-cashback-calculator"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 hover:bg-black/40 px-2.5 py-1.5 text-emerald-200 border border-white/10 transition-colors"
                        >
                            <Calculator className="w-3 h-3 text-emerald-300" />
                            Bank vs. Cashback Calculator
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                    <Link
                        href="/blog/black-friday-sale-india-2026-best-deals-coupons"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-950 shadow-lg shadow-black/15 transition-all hover:bg-indigo-50"
                    >
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Black Friday 2026 Guide</span>
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </Link>

                    <Link
                        href="/events/cyber-monday-deals-india-2026"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/20"
                    >
                        <span>Cyber Monday India Deals</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
