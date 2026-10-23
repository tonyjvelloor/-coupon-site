"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Flame, Gift, Tag } from "lucide-react";

export function DiwaliFestiveBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-6 md:p-8 text-white shadow-xl shadow-orange-500/15 border border-amber-300/30">
            {/* Background Festive Glow & Decor */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-10 w-48 h-48 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-amber-100 border border-white/20">
                        <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                        <span>Diwali Dhamaka 2026 Special</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        Celebrate Diwali with Verified Festive Coupons & Up to 90% Off
                    </h2>

                    <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
                        Hand-tested coupon codes for <strong>Ajio</strong>, <strong>Tata CLiQ</strong>, <strong>Amazon</strong>, <strong>Flipkart</strong>, <strong>IGP Gifts</strong>, and top Indian brands. Stack promo codes with 10% instant bank discounts for maximum savings!
                    </p>

                    {/* Quick Pill Deals */}
                    <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/20 backdrop-blur-sm px-2.5 py-1 text-amber-200 border border-white/10">
                            <Tag className="w-3 h-3 text-yellow-300" />
                            Ajio: Code <strong>ALLSTARSDIWALI400</strong> (Extra ₹400 Off)
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/20 backdrop-blur-sm px-2.5 py-1 text-amber-200 border border-white/10">
                            <Gift className="w-3 h-3 text-yellow-300" />
                            IGP: Diwali Hampers from ₹445
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/20 backdrop-blur-sm px-2.5 py-1 text-amber-200 border border-white/10">
                            <Tag className="w-3 h-3 text-yellow-300" />
                            Tata CLiQ: Code <strong>LUXNEW</strong> (Flat 12% Off)
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                    <Link
                        href="/blog/diwali-sale-2026-top-offers-indian-brands"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-orange-700 shadow-lg shadow-black/10 transition-all hover:bg-amber-50 hover:scale-[1.02] active:scale-95"
                    >
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span>Diwali 2026 Mega Guide</span>
                        <ArrowRight className="w-4 h-4 text-orange-600" />
                    </Link>

                    <Link
                        href="/events/diwali-sale-2026"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black/25 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-black/35 hover:scale-[1.02]"
                    >
                        <span>View Live Diwali Deals</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
