"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";

export interface TrustCenterProps {
    storeName: string;
    lastCheckedText: string;
}

export function TrustCenter({ storeName, lastCheckedText }: TrustCenterProps) {
    return (
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-2xl p-6 border border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 mb-6 flex items-center gap-2">
                <Icon name="shield" /> Why Trust This Page
            </h3>
            
            <div className="space-y-4 mb-4">
                <div className="flex items-start gap-3">
                    <Icon name="check_circle" className="text-verified-high dark:text-verified-low text-[20px] shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Offers checked {lastCheckedText}</div>
                        <div className="text-xs text-surface-500 mt-0.5">We continuously verify active codes.</div>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <Icon name="verified_user" className="text-verified-high dark:text-verified-low text-[20px] shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Merchant Verified</div>
                        <div className="text-xs text-surface-500 mt-0.5">Direct partnership with {storeName}.</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Icon name="policy" className="text-verified-high dark:text-verified-low text-[20px] shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Policies Verified</div>
                        <div className="text-xs text-surface-500 mt-0.5">Shipping & Returns checked weekly.</div>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => console.log("Analytics: onTrustCenterExpanded")}
                className="w-full text-center text-xs font-bold text-primary py-2 mt-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
                Read our verification process
            </button>
        </div>
    );
}
