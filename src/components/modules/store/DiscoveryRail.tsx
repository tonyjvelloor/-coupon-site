"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'lucide-react';

export interface DiscoveryRailProps {
    competitors: any[];
}

export function DiscoveryRail({ competitors }: DiscoveryRailProps) {
    if (!competitors || competitors.length === 0) return null;

    // Intent-based sorting: Prioritize stores that have a cashback rate
    const sortedCompetitors = [...competitors].sort((a, b) => {
        if (a.cashbackRate && !b.cashbackRate) return -1;
        if (!a.cashbackRate && b.cashbackRate) return 1;
        return 0;
    });

    return (
        <section className="pt-12 mt-12 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-display-sm font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                You may also like
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {sortedCompetitors.map((store) => (
                    <Link 
                        key={store.id} 
                        href={`/stores/${store.slug}`}
                        onClick={() => console.log("Analytics: onDiscoveryStoreClicked", { targetStore: store.slug })}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-indigo/30 hover:shadow-premium-sm transition-all group"
                    >
                        <div className="w-14 h-14 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 overflow-hidden shrink-0">
                            {store.logo ? (
                                <Image unoptimized src={store.logo} alt={`${store.name} coupons and cashback`} width={40} height={40} className="object-contain" />
                            ) : (
                                <span className="font-bold text-xl text-slate-400">{store.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-indigo transition-colors text-base">{store.name}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-brand-emerald font-medium mt-0.5">
                                <Tag className="w-3.5 h-3.5" /> Offers Available
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
