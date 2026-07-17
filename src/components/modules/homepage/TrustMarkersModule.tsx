"use client";

import React from "react";

export function TrustMarkersModule() {
    return (
        <section className="border-b border-surface-variant/20 bg-surface-container-low dark:bg-inverse-surface py-6 relative z-20 transition-colors duration-300">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-success-green/20 flex items-center justify-center text-success-green">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>verified_user</span>
                    </div>
                    <div>
                        <p className="font-title-md font-bold text-on-surface dark:text-white leading-tight">100% Human Verified</p>
                        <p className="font-label-md text-label-sm text-on-surface-variant dark:text-surface-variant">Every coupon tested today</p>
                    </div>
                </div>
                
                <div className="hidden lg:flex flex-1 items-center justify-center border-x border-surface-variant/20 px-8">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                        </span>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
                            <span className="font-bold text-on-surface dark:text-white">Live:</span> User 'Amit_K' just saved ₹450 on Myntra
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <div className="flex gap-1 text-success-green">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                        </div>
                        <p className="font-label-md text-label-sm text-on-surface-variant dark:text-surface-variant">4.8/5 on Trustpilot</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
