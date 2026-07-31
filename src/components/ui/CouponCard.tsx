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
        <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-slate-200 dark:border-slate-800 hover:border-brand-indigo/30 transition-all duration-300 shadow-premium-sm hover:shadow-premium-md flex flex-col h-full relative group">
            
            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] pointer-events-none" />

            {/* Save button */}
            <div className="absolute top-4 right-4 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col relative z-10">
                {/* Store info row */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 relative bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {storeLogo ? (
                            <Image src={storeLogo} alt={storeName} fill className="object-contain p-2" />
                        ) : (
                            <span className="text-xl font-display-sm font-bold text-slate-400">{storeName.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">{storeName}</span>
                        <div className="flex items-center gap-2 mt-1">
                            {coupon.isVerified && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                            )}
                            {coupon.expiresAt && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                    <Clock className="w-3 h-3" /> Ends {new Date(coupon.expiresAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Discount value */}
                {coupon.discountValue && (
                    <div className="text-3xl font-display-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
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
                <h3 className="text-base font-semibold text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {coupon.title}
                </h3>

                {/* Success rate badge */}
                <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-bold text-brand-indigo dark:text-indigo-400 bg-brand-indigo/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {localSuccessRate}% Success
                    </span>
                </div>

                {/* Spacer to push action to bottom */}
                <div className="mt-auto"></div>
            </div>

            {/* Action Area */}
            <div className="px-6 pb-6 relative z-10">
                {hasCouponCode ? (
                    /* ── Coupon Code: Modern Split Button ── */
                    <button
                        onClick={handleRevealAndCopy}
                        className="w-full flex items-stretch h-[52px] shrink-0 rounded-xl overflow-hidden bg-brand-indigo text-white shadow-premium-sm hover:shadow-premium-md transition-all active:scale-[0.98] group/btn"
                    >
                        {/* Code display (half-masked or full) */}
                        <div className="flex-1 flex items-center justify-center bg-white/10 px-4">
                            <span className="font-mono font-bold text-base tracking-widest">
                                {revealed ? coupon.code : maskCode(coupon.code!)}
                            </span>
                        </div>
                        {/* Copy button side */}
                        <div className={`flex items-center gap-2 px-5 font-bold text-sm transition-all shrink-0 ${
                            copied ? 'bg-emerald-500' : 'bg-transparent'
                        }`}>
                            {copied ? (
                                <><Check className="w-4 h-4" /> Copied!</>
                            ) : revealed ? (
                                <><Copy className="w-4 h-4" /> Copy</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Reveal</>
                            )}
                        </div>
                    </button>
                ) : activated ? (
                    /* ── Deal Activated State ── */
                    <div className="w-full flex flex-col items-center py-3.5 px-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 rounded-xl text-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Activated!</span>
                        </div>
                        <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                            Discount applies automatically.
                        </p>
                    </div>
                ) : (
                    /* ── Get Deal Button ── */
                    <button
                        onClick={handleGetDeal}
                        className="w-full h-[52px] shrink-0 flex items-center justify-center gap-2 bg-brand-indigo hover:bg-brand-indigo/90 active:scale-[0.98] text-white rounded-xl font-bold text-base transition-all shadow-premium-sm"
                    >
                        <span>Get Deal</span>
                        <ExternalLink className="w-5 h-5" />
                    </button>
                )}

                {/* Trust Feedback (after interaction) */}
                {showFeedback && (
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Did this work?
                            </span>
                            {voteStatus ? (
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Thanks! ❤️</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleVote(true)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
                                        title="Yes, it worked"
                                    >
                                        👍
                                    </button>
                                    <button
                                        onClick={() => handleVote(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                                        title="No, it didn't work"
                                    >
                                        👎
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
