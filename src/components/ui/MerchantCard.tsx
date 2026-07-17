import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface MerchantCardProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate?: string | null;
        offerCount: number;
        verified?: boolean;
        lastVerified?: string;
        rating?: number;
        bestSavings?: string;
    };
    className?: string;
    priority?: boolean;
}

export function MerchantCard({ store, className = "", priority = false }: MerchantCardProps) {
    return (
        <Link 
            href={`/stores/${store.slug}`} 
            className={`premium-card bg-surface-white dark:bg-inverse-surface rounded-2xl border border-surface-variant/20 p-6 flex flex-col group cursor-pointer h-full ${className}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-xl border border-surface-variant/20 p-2 bg-white flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative">
                    {store.logo ? (
                        <Image
                            src={store.logo}
                            alt={store.name}
                            fill
                            className="object-contain p-2"
                            loading={priority ? undefined : "lazy"}
                            priority={priority}
                        />
                    ) : (
                        <Image
                            src={`https://icon.horse/icon/${store.slug.replace(/-/g, '')}.com`}
                            alt={store.name}
                            fill
                            className="object-contain p-2"
                            unoptimized
                        />
                    )}
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-md text-label-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>local_offer</span>
                    {store.offerCount} Active
                </div>
            </div>
            
            <h3 className="font-title-md font-bold text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">{store.name}</h3>
            
            <p className="font-body-md text-label-md text-success-green font-bold mb-4">
                {store.bestSavings || "Up to 80% Off"}
            </p>
            
            <div className="mt-auto pt-4 border-t border-surface-variant/20 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {/* Simulated users for social proof */}
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-inverse-surface" src="https://i.pravatar.cc/100?img=1"/>
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-inverse-surface" src="https://i.pravatar.cc/100?img=2"/>
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-inverse-surface" src="https://i.pravatar.cc/100?img=3"/>
                </div>
                <span className="font-label-md text-label-sm text-on-surface-variant dark:text-surface-variant">4k+ saved this week</span>
            </div>
        </Link>
    );
}
