"use client";

import React from 'react';
import { ShieldCheck, CheckCircle2, UserCheck, FileText } from 'lucide-react';

export interface TrustCenterProps {
    storeName: string;
    lastCheckedText: string;
}

export function TrustCenter({ storeName, lastCheckedText }: TrustCenterProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-premium-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-indigo" /> Why Trust This Page
            </h3>
            
            <div className="space-y-5 mb-5">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-emerald w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Offers checked {lastCheckedText}</div>
                        <div className="text-xs text-slate-500 mt-0.5">We continuously verify active codes.</div>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <UserCheck className="text-brand-indigo w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Merchant Verified</div>
                        <div className="text-xs text-slate-500 mt-0.5">Direct partnership with {storeName}.</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FileText className="text-slate-400 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">Policies Verified</div>
                        <div className="text-xs text-slate-500 mt-0.5">Shipping & Returns checked weekly.</div>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => console.log("Analytics: onTrustCenterExpanded")}
                className="w-full text-center text-xs font-bold text-slate-600 dark:text-slate-400 py-2 mt-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
                Read our verification process
            </button>
        </div>
    );
}
