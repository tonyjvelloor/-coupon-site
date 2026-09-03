import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, TrendingUp, Users } from 'lucide-react';

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
            className={`store-card group bg-surface-card rounded-2xl p-space-md shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative h-full ${className}`}
        >
            <div className="flex items-start justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-sm">
                    {/* Brand Logo Wrapper matching new layout but keeping real Image */}
                    <div className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center p-2 shadow-sm flex-shrink-0 relative overflow-hidden bg-white">
                        {store.logo && store.logo.trim() !== '' ? (
                            <Image unoptimized src={store.logo}
                                alt={store.name}
                                fill
                                className="object-contain p-2"
                                loading={priority ? undefined : "lazy"}
                                priority={priority}
                            />
                        ) : (
                            <span className="text-xl font-bold text-slate-400 uppercase font-mono">
                                {store.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1">{store.name}</h3>
                            <span className="material-symbols-outlined text-verified-emerald text-[16px]" title="Verified Official Merchant">verified</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-text-muted">Top Store</span>
                    </div>
                </div>
                {/* Active tag */}
                <span className="inline-flex items-center gap-1 font-label-badge text-label-badge px-space-xs py-1 rounded-full bg-brand-indigo-light text-primary font-semibold flex-shrink-0">
                    <span className="material-symbols-outlined text-[12px]">local_offer</span> {store.offerCount} Active
                </span>
            </div>

            {/* Offer Highlight Banner */}
            <div className="bg-surface-container-low rounded-xl p-space-sm mb-space-md">
                <div className="flex items-baseline gap-1">
                    <span className="text-verified-emerald font-extrabold text-xl">{store.bestSavings || "Up to 80% OFF"}</span>
                    <span className="font-label-badge text-label-badge text-secondary font-bold">Max Savings</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">Top offers applied at checkout</p>
            </div>

            {/* Footer / Social Proof & Action */}
            <div className="flex items-center justify-between pt-space-xs">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                        <div className="inline-block h-6 w-6 rounded-full bg-deal-amber text-on-surface font-label-badge text-[10px] flex items-center justify-center font-bold ring-2 ring-white">RS</div>
                        <div className="inline-block h-6 w-6 rounded-full bg-primary text-white font-label-badge text-[10px] flex items-center justify-center font-bold ring-2 ring-white">AP</div>
                        <div className="inline-block h-6 w-6 rounded-full bg-secondary text-white font-label-badge text-[10px] flex items-center justify-center font-bold ring-2 ring-white">MK</div>
                    </div>
                    <span className="font-body-sm text-body-sm text-text-muted font-medium">4k+ saved</span>
                </div>
                <button className="coupon-action-btn inline-flex items-center gap-1 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-btn text-label-btn px-space-sm py-1.5 rounded-lg transition-colors" type="button">
                    <span>View Offers</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
            </div>
        </Link>
    );
}
