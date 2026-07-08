import React from 'react';
import Image from 'next/image';
import { TrustSignal } from './TrustSignal';
import { IntelligenceMetric } from '../ui/IntelligenceMetric';
import { Icon } from '../ui/Icon';

export interface MerchantCardProps {
    name: string;
    logoUrl: string;
    isVerified: boolean;
    lastUpdated: string; // e.g. "18 minutes ago"
    metrics: {
        activeOffers: number;
        offerSuccessRate: number;
        buyingGuides: number;
    };
    policies: {
        shipping: boolean;
        returns: boolean;
        paymentMethods: boolean;
    };
}

/**
 * Acts as a Merchant Health Snapshot exposing platform intelligence,
 * verifying that the merchant's data is actively maintained.
 */
export function MerchantCard({ name, logoUrl, isVerified, lastUpdated, metrics, policies }: MerchantCardProps) {
    return (
        <div className="glass-card premium-card rounded-2xl p-card-padding flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="store-logo w-16 h-16 rounded-xl border border-surface-200 bg-white dark:bg-surface-900 shrink-0 relative">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={name} fill className="object-contain p-2" />
                        ) : (
                            <Icon name="storefront" className="text-3xl text-surface-300" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-headline-md text-lg text-on-surface">{name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {isVerified && <TrustSignal type="verified" label="Verified Merchant" />}
                            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                                <Icon name="history" className="text-[14px]" />
                                Updated {lastUpdated}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-200 dark:border-surface-300">
                <IntelligenceMetric 
                    layout="inline"
                    icon="local_offer"
                    value={metrics.activeOffers}
                    label="Offers"
                />
                <IntelligenceMetric 
                    layout="inline"
                    icon="thumb_up"
                    value={`${metrics.offerSuccessRate}%`}
                    label="Success"
                    valueClassName="text-green-600 dark:text-green-400"
                />
                <IntelligenceMetric 
                    layout="inline"
                    icon="menu_book"
                    value={metrics.buyingGuides}
                    label="Guides"
                />
            </div>

            {/* Policies */}
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold tracking-wide text-on-surface-variant uppercase">
                {policies.shipping && (
                    <span className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                        <Icon name="local_shipping" className="text-[14px]" /> Shipping
                    </span>
                )}
                {policies.returns && (
                    <span className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                        <Icon name="assignment_return" className="text-[14px]" /> Returns
                    </span>
                )}
                {policies.paymentMethods && (
                    <span className="flex items-center gap-1 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                        <Icon name="credit_card" className="text-[14px]" /> Payments
                    </span>
                )}
            </div>
        </div>
    );
}
