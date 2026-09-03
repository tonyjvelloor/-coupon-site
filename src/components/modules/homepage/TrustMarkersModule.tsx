"use client";

import React from "react";

export function TrustMarkersModule() {
    return (
        <section className="max-w-max-width mx-auto px-gutter-desktop mb-space-3xl relative z-20 -mt-10">
            <div className="bg-surface-card rounded-2xl shadow-md p-space-lg grid grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Stat 1 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-verified-emerald-bg flex items-center justify-center text-verified-emerald shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">verified</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-headline-md text-headline-md font-extrabold text-on-surface">18,421</span>
                            <span className="text-verified-emerald font-bold text-xs">Live</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-text-muted">Working codes</p>
                    </div>
                </div>
                
                {/* Stat 2 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-deal-amber-bg flex items-center justify-center text-deal-amber shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">electric_bolt</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">99.2%</span>
                        <p className="font-body-sm text-body-sm text-text-muted">Success rate</p>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-brand-indigo-light flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">storefront</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">3,900+</span>
                        <p className="font-body-sm text-body-sm text-text-muted">Top stores</p>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-hot-coral-bg flex items-center justify-center text-hot-coral shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">savings</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">₹27L+</span>
                        <p className="font-body-sm text-body-sm text-text-muted">Saved this week</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
