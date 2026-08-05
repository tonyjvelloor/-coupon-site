import React, { useState } from 'react';
import { TrustSignal } from './TrustSignal';
import { IntelligenceMetric } from '../ui/IntelligenceMetric';
import { Icon } from '../ui/Icon';

export interface IntelligenceCouponCardProps {
    discountValue: string;
    discountType: string; // e.g. "OFF", "CASHBACK"
    title: string;
    code?: string;
    isVerified: boolean;
    lastVerified: string; // e.g. "Today" or "2h ago"
    expiresAt: string;
    confidenceScore: number;
    cashbackInfo?: string;
    hasTerms?: boolean;
    id?: string;
    affiliateUrl?: string;
    storeName?: string;
    storeId?: string | null;
}

/** Masks the second half of a code: "FIRST10" → "FIRS•••" */
function maskCode(code: string): string {
    const visibleLen = Math.ceil(code.length / 2);
    return code.slice(0, visibleLen) + "•".repeat(code.length - visibleLen);
}

/**
 * Optimizes for decision speed by prioritizing:
 * Verified -> Discount -> Cashback -> Code -> Last Verified -> Expires -> Confidence -> Terms
 */
export function IntelligenceCouponCard({
    discountValue,
    discountType,
    title,
    code,
    isVerified,
    lastVerified,
    expiresAt,
    confidenceScore,
    cashbackInfo,
    hasTerms,
    id = "unknown",
    affiliateUrl = "#",
    storeName = "Store",
    storeId
}: IntelligenceCouponCardProps) {
    const [copied, setCopied] = useState(false);
    const [activated, setActivated] = useState(false);

    const handleAction = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            setActivated(true);
        }
        const storeParam = storeId ? `&storeId=${storeId}` : '';
        const outUrl = `/out?url=${encodeURIComponent(affiliateUrl)}&couponId=${id}&source=intelligence-card${storeParam}`;
        window.open(outUrl, "_blank");
    };
    return (
        <div className="glass-card premium-card rounded-2xl p-card-padding flex flex-col md:flex-row gap-4 md:items-center">
            {/* Left: Primary Offer Details */}
            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    {isVerified && <TrustSignal type="verified" />}
                    {cashbackInfo && <TrustSignal type="cashback" label={cashbackInfo} />}
                    <TrustSignal type="high_confidence" label={`${confidenceScore}% Success`} />
                </div>
                
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-metric-xl text-primary font-bold">{discountValue}</span>
                        <span className="text-sm font-label-bold text-on-surface-variant uppercase tracking-wider">{discountType}</span>
                    </div>
                    <h3 className="font-headline-md text-base mt-1 text-on-surface line-clamp-2">{title}</h3>
                </div>

                <div className="flex items-center gap-4 mt-1">
                    <IntelligenceMetric 
                        layout="inline"
                        icon="verified"
                        value={lastVerified}
                        label="Checked"
                    />
                    <IntelligenceMetric 
                        layout="inline"
                        icon="event"
                        value={expiresAt}
                        label="Expires"
                        valueClassName="text-urgency-orange font-bold"
                    />
                </div>
            </div>

            {/* Right: Call to Action & Code */}
            <div className="flex flex-col items-center justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-surface-200 dark:border-surface-300 pt-4 md:pt-0 md:pl-4">
                {code ? (
                    <button 
                        onClick={handleAction}
                        className="w-full relative group overflow-hidden border-2 border-primary-200 border-dashed rounded-lg p-3 text-center bg-primary-50 dark:bg-primary-900/20 hover:border-primary-500 transition-colors"
                    >
                        <span className="font-metric-xl text-lg tracking-widest text-primary font-bold">
                            {copied ? code : maskCode(code)}
                        </span>
                        {!copied && (
                            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-primary-50 dark:from-primary-900/40 to-transparent" />
                        )}
                        <div className={`absolute inset-0 flex items-center justify-center font-label-bold text-sm text-white transition-opacity ${copied ? 'bg-verified opacity-100' : 'bg-primary opacity-0 group-hover:opacity-100'}`}>
                            {copied ? "Copied!" : "Click to Copy"}
                        </div>
                    </button>
                ) : activated ? (
                    <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 rounded-lg text-center shadow-sm">
                        <Icon name="check_circle" className="text-[18px] text-green-600 dark:text-green-400" />
                        <span className="font-bold text-green-700 dark:text-green-400 text-sm">Coupon Activated!</span>
                    </div>
                ) : (
                    <button 
                        onClick={handleAction}
                        className="w-full btn-primary text-sm py-3 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Get Deal <Icon name="arrow_forward" className="text-[16px]" />
                    </button>
                )}
                {hasTerms && (
                    <button className="text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                        View Terms <Icon name="expand_more" className="text-[14px]" />
                    </button>
                )}
            </div>
        </div>
    );
}
