"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, ArrowRight } from 'lucide-react';

export interface DiscoveryRailProps {
    competitors: any[];
    /** slug of the current store, used to build /compare links */
    currentStoreSlug?: string;
}

export function DiscoveryRail({ competitors, currentStoreSlug }: DiscoveryRailProps) {
    if (!competitors || competitors.length === 0) return null;

    // Sort: cashback stores first
    const sortedCompetitors = [...competitors].sort((a, b) => {
        if (a.savings?.includes('Cashback') && !b.savings?.includes('Cashback')) return -1;
        if (!a.savings?.includes('Cashback') && b.savings?.includes('Cashback')) return 1;
        return 0;
    });

    return (
        <section className="pt-12 mt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    Similar Stores & Alternatives
                </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedCompetitors.map((store) => {
                    const compareSlug = currentStoreSlug
                        ? `${currentStoreSlug}-vs-${store.slug}`
                        : null;

                    return (
                        <div key={store.id} className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-indigo/30 hover:shadow-premium-sm transition-all overflow-hidden">
                            <Link
                                href={`/stores/${store.slug}`}
                                className="flex items-center gap-4 p-4 flex-1 group"
                            >
                                <div className="w-12 h-12 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 overflow-hidden shrink-0">
                                    {store.logo ? (
                                        <Image unoptimized src={store.logo} alt={`${store.name} coupons`} width={36} height={36} className="object-contain" />
                                    ) : (
                                        <span className="font-bold text-lg text-slate-400">{store.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-indigo transition-colors text-sm">{store.name}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-brand-emerald font-semibold mt-0.5">
                                        <Tag className="w-3 h-3" />
                                        {store.savings || 'Verified Offers'}
                                    </div>
                                </div>
                            </Link>
                            {compareSlug && (
                                <Link
                                    href={`/compare/${compareSlug}`}
                                    className="flex items-center justify-center gap-1 py-2 text-xs font-medium text-slate-500 hover:text-brand-indigo border-t border-slate-100 dark:border-slate-800 transition-colors"
                                >
                                    Compare <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

