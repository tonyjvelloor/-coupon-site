"use client";

import React from "react";

export function TrustMarkersModule() {
    return (
        <section className="relative z-20 -mt-8 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-container-max mx-auto bg-white border border-slate-200 shadow-premium-sm rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* Marker 1 */}
                <div className="flex items-center gap-4 flex-1 justify-center md:justify-start lg:justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <span className="material-symbols-outlined font-light" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>check_circle</span>
                    </div>
                    <div>
                        <p className="font-title-md font-bold text-slate-900 leading-tight">18,421</p>
                        <p className="font-label-md text-sm text-slate-500 font-normal">Coupons verified today</p>
                    </div>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-slate-100"></div>

                {/* Marker 2 */}
                <div className="flex items-center gap-4 flex-1 justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-brand-indigo border border-indigo-100">
                        <span className="material-symbols-outlined font-light" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>savings</span>
                    </div>
                    <div>
                        <p className="font-title-md font-bold text-slate-900 leading-tight">₹27L+</p>
                        <p className="font-label-md text-sm text-slate-500 font-normal">Saved by users this week</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-100"></div>

                {/* Marker 3 */}
                <div className="flex items-center gap-4 flex-1 justify-center md:justify-end lg:justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                        <span className="material-symbols-outlined font-light" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>storefront</span>
                    </div>
                    <div>
                        <p className="font-title-md font-bold text-slate-900 leading-tight">3,900+</p>
                        <p className="font-label-md text-sm text-slate-500 font-normal">Stores supported</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
