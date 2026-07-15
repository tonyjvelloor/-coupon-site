"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from "@/components/ui/Icon";

export interface DiscoveryRailProps {
    competitors: any[];
}

export function DiscoveryRail({ competitors }: DiscoveryRailProps) {
    if (!competitors || competitors.length === 0) return null;

    return (
        <section className="pt-12 mt-12 border-t border-surface-200 dark:border-surface-800">
            <h3 className="text-xl font-headline-md font-bold text-slate-900 dark:text-white mb-6">
                You may also like
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {competitors.map((store) => (
                    <Link 
                        key={store.id} 
                        href={`/stores/${store.slug}`}
                        onClick={() => console.log("Analytics: onDiscoveryStoreClicked", { targetStore: store.slug })}
                        className="flex items-center gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg border border-surface-100 dark:border-surface-800 flex items-center justify-center bg-white overflow-hidden shrink-0">
                            {store.logo ? (
                                <Image src={store.logo} alt={store.name} width={40} height={40} className="object-contain" />
                            ) : (
                                <span className="font-bold text-lg text-surface-400">{store.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{store.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                <Icon name="local_offer" className="text-[12px]" /> Offers Available
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
