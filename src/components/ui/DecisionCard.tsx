"use client";

import React, { useState } from 'react';
import { Card, CardContent } from './Card';
import { Icon } from './Icon';
import SaveDealButton from './SaveDealButton';
import ShareDealButton from './ShareDealButton';
import { formatDistanceToNow } from 'date-fns';
import { trackEvent } from '@/lib/analytics';

export interface DecisionCardProps {
    coupon: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountType: string;
        discountValue: string | null;
        affiliateUrl: string;
        isVerified: boolean;
        isExclusive: boolean;
        bank?: string | null;
        expiresAt?: Date | string | null;
        successRate?: number;
        successCount?: number;
        failureCount?: number;
        createdAt?: Date | string | null;
        lastVerifiedAt?: Date | string | null;
    };
    storeName?: string;
    storeLogo?: string | null;
    isBestDeal?: boolean;
}

export function DecisionCard({ coupon, storeName, isBestDeal = false }: DecisionCardProps) {
    const [copied, setCopied] = useState(false);
    const [hasRevealedFeedback, setHasRevealedFeedback] = useState(false);
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

    const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
    const initialRate = initialTotalVotes > 0 
        ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100) 
        : coupon.successRate;
    
    const [localSuccessRate, setLocalSuccessRate] = useState<number | null | undefined>(initialRate);
    
    const verifiedTimeAgo = coupon.lastVerifiedAt 
        ? formatDistanceToNow(new Date(coupon.lastVerifiedAt), { addSuffix: true }) 
        : (coupon.createdAt ? formatDistanceToNow(new Date(coupon.createdAt), { addSuffix: true }) : "recently");

    const isExpiringSoon = coupon.expiresAt 
        ? new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 
        : false;

    const handleAction = () => {
        if (coupon.type === "coupon" && coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            trackEvent('coupon_copied', { couponId: coupon.id });
        } else {
            trackEvent('deal_clicked', { couponId: coupon.id });
        }
        setHasRevealedFeedback(true);
        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=decision-card`;
        window.open(outUrl, "_blank");
    };

    const handleVote = async (isUpvote: boolean) => {
        if (voteStatus) return; // Prevent double voting
        setVoteStatus(isUpvote ? 'up' : 'down');
        
        trackEvent('trust_vote', { couponId: coupon.id, vote: isUpvote ? 'up' : 'down' });
        
        try {
            const res = await fetch(`/api/coupons/${coupon.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isUpvote })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.successRate !== null) {
                    setLocalSuccessRate(data.successRate);
                }
            }
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    return (
        <Card className={`relative group transition-all duration-300 ${isBestDeal ? 'border-primary-500 shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-1' : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 bg-white dark:bg-surface-800 hover:-translate-y-1'}`}>
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
                <ShareDealButton dealId={coupon.id} title={coupon.title} storeName={storeName} />
                <SaveDealButton dealId={coupon.id} />
            </div>

            <CardContent className="p-5 flex flex-col gap-4">
                
                {isBestDeal && (
                    <div className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest mb-1">
                        <Icon name="star" className="text-[16px]" variant="fill" /> Best Deal
                    </div>
                )}

                {/* 1. Primary Value Proposition */}
                <div className="flex flex-col pr-8">
                    {coupon.discountValue && (
                        <div className={`text-3xl font-bold font-headline-lg leading-tight ${isBestDeal ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                            {coupon.discountValue}
                        </div>
                    )}
                    <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 line-clamp-2 leading-snug mt-1">
                        {coupon.title}
                    </h3>
                </div>

                {/* 2. Scanning Order: Discount, Cashback, Code, Expiry, Verified, Terms */}
                <div className="flex flex-wrap gap-2">
                    {coupon.bank && (
                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-[11px] font-bold tracking-wider border border-green-200 dark:border-green-800">
                            <Icon name="payments" className="text-[14px]" /> +{coupon.bank}
                        </div>
                    )}
                    
                    {coupon.expiresAt && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${isExpiringSoon ? 'bg-urgency-light text-urgency-dark dark:bg-urgency-dark dark:text-urgency-light' : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
                            <Icon name="timer" className="text-[14px]" /> 
                            {isExpiringSoon ? "Ends Soon" : `Ends ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                        </div>
                    )}

                    {coupon.isVerified && (
                        <div className="flex items-center gap-1 bg-verified-light dark:bg-verified-dark text-verified-high dark:text-verified-low px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                            <Icon name="verified" className="text-[14px]" /> Verified
                        </div>
                    )}

                    {localSuccessRate !== undefined && localSuccessRate !== null && (
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                            <Icon name="trending_up" className="text-[14px]" /> {localSuccessRate}% Success
                        </div>
                    )}
                </div>

                {/* 3. Action Area (Sticky on Mobile via Group Hover/Touch) */}
                <div className="mt-2 relative">
                    {coupon.type === "coupon" && coupon.code ? (
                        <div className="flex items-stretch h-12 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                            <div className="flex-1 bg-surface-50 dark:bg-surface-900 flex items-center justify-center font-mono font-bold text-slate-900 dark:text-white text-lg tracking-widest border-r border-surface-200 dark:border-surface-700">
                                {coupon.code}
                            </div>
                            <button 
                                onClick={handleAction}
                                className={`px-6 font-bold text-sm transition-colors ${copied ? 'bg-verified text-white' : 'bg-primary text-white hover:bg-primary-600'}`}
                            >
                                {copied ? "Copied!" : "Copy & Go"}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleAction}
                            className="w-full h-12 bg-slate-900 dark:bg-primary hover:bg-slate-800 dark:hover:bg-primary-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                        >
                            Get Deal <Icon name="arrow_forward" className="text-[16px]" />
                        </button>
                    )}

                    {/* Trust Feedback Modal (Revealed on click) */}
                    {hasRevealedFeedback && (
                        <div className="mt-3 p-3 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                Did this work?
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleVote(true)}
                                    disabled={voteStatus !== null}
                                    className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 transition-colors ${voteStatus === 'up' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-surface-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 disabled:opacity-50'}`}
                                >
                                    👍 Yes
                                </button>
                                <button 
                                    onClick={() => handleVote(false)}
                                    disabled={voteStatus !== null}
                                    className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1 transition-colors ${voteStatus === 'down' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-surface-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50'}`}
                                >
                                    👎 No
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Terms */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-surface-100 dark:border-surface-700">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-surface-500">
                        <Icon name="history" className="text-[14px]" /> Verified {verifiedTimeAgo}
                    </div>
                    <button className="text-[11px] font-medium text-surface-400 hover:text-primary transition-colors underline decoration-dotted">
                        Terms
                    </button>
                </div>
                
            </CardContent>
        </Card>
    );
}
