"use client";

import React from "react";

export function TrustMarkersModule() {
    return (
        <section className="relative z-20 transition-colors duration-300 -mt-10 px-margin-mobile md:px-margin-desktop hidden md:block">
            <div className="max-w-container-max mx-auto bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-indigo-900/5 dark:shadow-none rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-shadow duration-500">
                <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>verified_user</span>
                    </div>
                    <div>
                        <p className="font-title-md font-bold text-gray-900 dark:text-white leading-tight tracking-tight">100% Human Verified</p>
                        <p className="font-label-md text-label-sm text-gray-500 dark:text-gray-400">Every coupon tested today</p>
                    </div>
                </div>
                
                <div className="hidden lg:flex flex-1 items-center justify-center border-x border-gray-100 dark:border-gray-800/60 px-8">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                        <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300">
                            <span className="font-bold text-gray-900 dark:text-white">Live:</span> User 'Amit_K' just saved ₹450 on Myntra
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="flex flex-col items-end">
                        <div className="flex gap-1 text-emerald-500">
                            <span className="material-symbols-outlined text-lg drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg drop-shadow-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                        </div>
                        <p className="font-label-md text-label-sm text-gray-500 dark:text-gray-400">4.8/5 on Trustpilot</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
