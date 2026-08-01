"use client";

import React from 'react';
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";

export interface OfferFeedProps {
    store: any;
    offers: any[]; // The remaining offers (excluding bestDeal if we rendered it above)
}

export function OfferFeed({ store, offers }: OfferFeedProps) {
    if (!offers || offers.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-heading text-slate-900 dark:text-white">
                    More Working Offers
                </h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-overline px-2.5 py-1 rounded-full">
                    {offers.length} verified
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((coupon, index) => {
                    // Let's add some mock intelligent badging to the first two items for now
                    let badgeLabel = undefined;
                    if (index === 0) badgeLabel = "Most Popular";
                    else if (index === 1 && coupon.type === "coupon") badgeLabel = "Highest Savings";

                    return (
                        <div 
                            key={coupon.id} 
                            onClick={() => console.log("Analytics: onOfferExpanded", { dealId: coupon.id })}
                        >
                            <PremiumOfferCard
                                coupon={{
                                    ...coupon,
                                    affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                }}
                                storeName={store.name}
                                storeLogo={store.logo}
                                badgeLabel={badgeLabel}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
