"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, ShieldCheck, Clock, Info, Sparkles } from "lucide-react";
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

/** Masks the second half of a code: "FIRST10" → "FIRS•••" */
function maskCode(code: string): string {
    const visibleLen = Math.ceil(code.length / 2);
    return code.slice(0, visibleLen) + "•".repeat(code.length - visibleLen);
}

export default function CouponCard({ coupon, storeName, storeLogo }: CouponCardProps) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activated, setActivated] = useState(false);
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

    const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
    const initialRate = initialTotalVotes > 0
        ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100)
        : (coupon.successRate || 95);

    const [localSuccessRate, setLocalSuccessRate] = useState<number>(initialRate);

    const hasCouponCode = coupon.type === "coupon" && coupon.code;

    const handleRevealAndCopy = () => {
        setRevealed(true);
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        trackEvent('coupon_copied', { couponId: coupon.id });
        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=coupon-card-copy`;
        window.open(outUrl, "_blank");
    };

    const handleGetDeal = () => {
        setActivated(true);
        trackEvent('deal_clicked', { couponId: coupon.id });
        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=coupon-card-deal`;
        window.open(outUrl, "_blank");
    };

    const handleVote = async (isUpvote: boolean) => {
        if (voteStatus) return;
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
                if (data.successRate !== null) setLocalSuccessRate(data.successRate);
            }
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    const showFeedback = revealed || activated;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col h-full relative group">
            {/* Save button */}
            <div className="absolute top-3 right-3 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Store info row */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 relative bg-white rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                        {storeLogo ? (
                            <Image src={storeLogo} alt={storeName} fill className="object-contain p-1.5" />
                        ) : (
                            <span className="text-sm font-bold text-gray-400">{storeName.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate block">{storeName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            {coupon.isVerified && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                                </span>
                            )}
                            {coupon.expiresAt && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3 h-3" /> ENDS {new Date(coupon.expiresAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Discount value */}
                {coupon.discountValue && (
                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1 leading-tight">
                        {/^\d+$/.test(coupon.discountValue) ? (
                            Number(coupon.discountValue) <= 100
                                ? `${coupon.discountValue}% Off`
                                : `₹${coupon.discountValue} Off`
                        ) : (
                            coupon.discountValue
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                    {coupon.title}
                </h3>

                {/* Success rate badge */}
                <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        📈 {localSuccessRate}% SUCCESS
                    </span>
                </div>

                {/* Spacer to push action to bottom */}
                <div className="mt-auto"></div>
            </div>

            {/* Action Area */}
            <div className="px-5 pb-5">
                {hasCouponCode ? (
                    /* ── Coupon Code: Half-reveal + Copy ── */
                    <button
                        onClick={handleRevealAndCopy}
                        className="w-full flex items-stretch rounded-xl overflow-hidden border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400 transition-all group/btn"
                    >
                        {/* Code display (half-masked or full) */}
                        <div className="flex-1 flex items-center justify-center py-3 px-4 bg-indigo-50/50 dark:bg-indigo-950/30 relative">
                            <span className="font-mono font-bold text-base text-gray-800 dark:text-white tracking-widest">
                                {revealed ? coupon.code : maskCode(coupon.code!)}
                            </span>
                            {!revealed && (
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-100/80 dark:from-indigo-900/60 to-transparent" />
                            )}
                        </div>
                        {/* Copy button side */}
                        <div className={`flex items-center gap-1.5 px-5 py-3 font-bold text-sm text-white transition-all shrink-0 ${
                            copied
                                ? 'bg-emerald-500'
                                : 'bg-indigo-600 group-hover/btn:bg-indigo-700'
                        }`}>
                            {copied ? (
                                <><Check className="w-4 h-4" /> Copied!</>
                            ) : revealed ? (
                                <><Copy className="w-4 h-4" /> Copy</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Copy Code</>
                            )}
                        </div>
                    </button>
                ) : activated ? (
                    /* ── Deal Activated State ── */
                    <div className="w-full flex flex-col items-center py-4 px-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl text-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-base">Coupon Activated!</span>
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400/80">
                            Discount applied automatically. Shop on {storeName} to save!
                        </p>
                    </div>
                ) : (
                    /* ── Get Deal Button ── */
                    <button
                        onClick={handleGetDeal}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md hover:shadow-emerald-500/10"
                    >
                        <span>Get Deal</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}

                {/* Trust Feedback (after interaction) */}
                {showFeedback && (
                    <div className="mt-3 flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Did this work?
                        </span>
                        {voteStatus ? (
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Thanks! ❤️</span>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleVote(true)}
                                    className="px-3 py-1 rounded-md text-xs font-bold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-950 dark:hover:text-emerald-400 transition-colors"
                                >
                                    👍 Yes
                                </button>
                                <button
                                    onClick={() => handleVote(false)}
                                    className="px-3 py-1 rounded-md text-xs font-bold bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                                >
                                    👎 No
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-center gap-1 mt-2.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <Info className="w-3 h-3" />
                    Verified recently
                </div>
            </div>
        </div>
    );
}
