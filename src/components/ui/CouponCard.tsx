"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, ShieldCheck, Clock, Info } from "lucide-react";
import SaveDealButton from "./SaveDealButton";
import { trackEvent } from "@/lib/analytics";

interface CouponCardProps {
    coupon: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountValue: string | null;
        affiliateUrl: string;
        image?: string | null;
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
    storeName: string;
    storeLogo?: string | null;
}

export default function CouponCard({ coupon, storeName, storeLogo }: CouponCardProps) {
    const [showCode, setShowCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasRevealedFeedback, setHasRevealedFeedback] = useState(false);
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

    const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
    const initialRate = initialTotalVotes > 0 
        ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100) 
        : (coupon.successRate || 98); // Fallback static
    
    const [localSuccessRate, setLocalSuccessRate] = useState<number | null | undefined>(initialRate);

    const handleRevealCode = () => {
        setShowCode(true);
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        setHasRevealedFeedback(true);
        
        trackEvent('coupon_copied', { couponId: coupon.id });

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=coupon-card-copy`;
        window.open(outUrl, "_blank");
    };

    const handleGetDeal = () => {
        setHasRevealedFeedback(true);
        trackEvent('deal_clicked', { couponId: coupon.id });
        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=coupon-card-deal`;
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col h-full relative">
            <div className="absolute top-3 right-3 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 relative bg-gray-50 dark:bg-white rounded border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {storeLogo ? (
                            <Image src={storeLogo} alt={storeName} fill className="object-contain p-1" />
                        ) : (
                            <span className="text-lg font-bold text-gray-400">
                                {storeName.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{storeName}</span>
                        <div className="flex items-center gap-2 mt-1">
                            {coupon.isVerified && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified Today
                                </span>
                            )}
                            <span className="text-[11px] text-orange-600 flex items-center gap-1 font-bold">
                                <Clock className="w-3 h-3" />
                                {localSuccessRate}% Success
                            </span>
                        </div>
                    </div>
                </div>

                {coupon.discountValue && (
                    <div className="text-xl font-bold text-green-600 dark:text-green-500 mb-2">
                        {coupon.discountValue}
                    </div>
                )}

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {coupon.title}
                </h3>

                {coupon.expiresAt && (
                    <div className="text-xs text-red-600 font-medium mb-3">
                        Ends: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </div>
                )}
                
                <div className="mt-auto"></div>
            </div>

            <div className="px-4 pb-4">
                {coupon.type === "coupon" && coupon.code ? (
                    showCode ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded rounded-md">
                            <code className="flex-1 text-center font-mono font-bold text-gray-900 dark:text-white">
                                {coupon.code}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(coupon.code!);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleRevealCode}
                            className="w-full flex items-center justify-between p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-md font-semibold transition-colors"
                        >
                            <span>Show Coupon Code</span>
                        </button>
                    )
                ) : (
                    <button
                        onClick={handleGetDeal}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
                    >
                        <span>Get Deal</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}

                {/* Trust Feedback Modal (Revealed on click) */}
                {hasRevealedFeedback && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Did this work?
                        </span>
                        <div className="flex items-center gap-2 w-full">
                            <button 
                                onClick={() => handleVote(true)}
                                disabled={voteStatus !== null}
                                className={`flex-1 py-1.5 rounded-md text-sm font-bold flex items-center justify-center gap-1 transition-colors ${voteStatus === 'up' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-gray-200 hover:bg-green-50 hover:text-green-600 disabled:opacity-50'}`}
                            >
                                👍 Yes
                            </button>
                            <button 
                                onClick={() => handleVote(false)}
                                disabled={voteStatus !== null}
                                className={`flex-1 py-1.5 rounded-md text-sm font-bold flex items-center justify-center gap-1 transition-colors ${voteStatus === 'down' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50'}`}
                            >
                                👎 No
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-gray-400">
                    <Info className="w-3 h-3" />
                    We may earn a commission from links on this page.
                </div>
            </div>
        </div>
    );
}
