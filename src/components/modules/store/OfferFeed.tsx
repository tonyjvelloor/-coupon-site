"use client";

import React from 'react';
import { OfferCard } from "@/components/ui/OfferCard";

export interface OfferFeedProps {
    store: any;
    offers: any[]; // The remaining offers (excluding bestDeal if we rendered it above)
}

export function OfferFeed({ store, offers }: OfferFeedProps) {
    if (!offers || offers.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white">
                    Active Offers
                </h3>
                <span className="bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 text-xs font-bold px-2 py-1 rounded">
                    {offers.length} verified
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((coupon) => (
                    <div 
                        key={coupon.id} 
                        onClick={() => console.log("Analytics: onOfferExpanded", { dealId: coupon.id })}
                    >
                        <OfferCard
                            coupon={{
                                ...coupon,
                                affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                successRate: 94 + Math.floor(Math.random() * 6), // Mock success rate
                            }}
                            storeName={store.name}
                            storeLogo={store.logo}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
