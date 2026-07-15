import React from 'react';
import { ConfidenceExplanation } from './ConfidenceExplanation';

interface StoreHealthSnapshotProps {
    healthScore: number;
    healthText: string;
    metrics: {
        offers: number;
        guides: number;
        policies: number;
        freshness: string;
        confidence: number;
    };
}

export function StoreHealthSnapshot({ healthScore, healthText, metrics }: StoreHealthSnapshotProps) {
    return (
        <div className="bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-6">
                Merchant Snapshot
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                
                {/* Left: Health Score */}
                <div className="flex-shrink-0 flex flex-col gap-1 w-48">
                    <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                        Merchant Health
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black font-metric-xl text-slate-900 dark:text-white">
                            {healthScore}
                        </span>
                        <span className="text-lg font-bold text-verified">
                            {healthText}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-100 dark:bg-surface-800 rounded-full mt-3 overflow-hidden">
                        <div 
                            className="h-full bg-verified rounded-full" 
                            style={{ width: `${Math.max(0, Math.min(100, healthScore))}%` }} 
                        />
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px h-16 bg-surface-200 dark:bg-surface-800 mx-4" />
                <div className="block lg:hidden w-full h-px bg-surface-200 dark:bg-surface-800 my-2" />

                {/* Right: Data Points Grid */}
                <div className="flex-grow grid grid-cols-2 sm:grid-cols-5 gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Offers</span>
                        <span className="text-xl font-bold font-metric-xl text-slate-900 dark:text-white">{metrics.offers}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Guides</span>
                        <span className="text-xl font-bold font-metric-xl text-slate-900 dark:text-white">{metrics.guides}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Policies</span>
                        <span className="text-xl font-bold font-metric-xl text-slate-900 dark:text-white">{metrics.policies}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">Freshness</span>
                        <span className="text-xl font-bold font-metric-xl text-slate-900 dark:text-white">{metrics.freshness}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            Confidence
                        </span>
                        <ConfidenceExplanation score={metrics.confidence} />
                    </div>
                </div>
            </div>
        </div>
    );
}
