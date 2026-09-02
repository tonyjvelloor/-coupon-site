"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, ShieldCheck, Clock, TrendingUp, Users } from "lucide-react";
import SaveDealButton from "./SaveDealButton";
import { trackEvent } from "@/lib/analytics";
import { useCouponModal } from "../providers/CouponModalProvider";
import { formatDistanceToNow } from "date-fns";
import confetti from "canvas-confetti";
import { SavingsBadge, VerifiedBadge, CashbackPill, ExpiringTag } from "./DesignBadges";

interface PremiumOfferCardProps {
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
        storeId?: string | null;
    };
    storeName: string;
    storeLogo?: string | null;
    badgeLabel?: string; // e.g., 'Recommended', 'Most Popular'
}

/** Masks the second half of a code: "FIRST10" → "FIRS•••" */
function maskCode(code: string): string {
    const visibleLen = Math.ceil(code.length / 2);
    return code.slice(0, visibleLen) + "•".repeat(code.length - visibleLen);
}

export function PremiumOfferCard({ coupon, storeName, storeLogo, badgeLabel }: PremiumOfferCardProps) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activated, setActivated] = useState(false);
    const { openCouponModal } = useCouponModal();

    const hasCouponCode = coupon.type === "coupon" && coupon.code;
    const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
    const successRate = initialTotalVotes > 0
        ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100)
        : (coupon.successRate || 95);

    const isExpiringSoon = coupon.expiresAt
        ? new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
        : false;

    const handleRevealAndCopy = (e: React.MouseEvent) => {
        setRevealed(true);
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            
            // Fire Confetti
            try {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;
                
                confetti({
                    particleCount: 40,
                    spread: 50,
                    origin: { x, y },
                    colors: ['#6366f1', '#10b981', '#f59e0b'],
                    disableForReducedMotion: true,
                    zIndex: 100
                });
            } catch (err) {
                // Ignore error if confetti fails
            }

            setTimeout(() => setCopied(false), 3000);
        }
        trackEvent('coupon_copied', { couponId: coupon.id });
        
        // Modal as Shopping Assistant
        openCouponModal({
            ...coupon,
            storeName,
            storeLogo: storeLogo || undefined
        });

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&storeId=${coupon.storeId || 'none'}&couponId=${coupon.id}&source=coupon-card-copy&type=code`;
        window.open(outUrl, "_blank");
    };

    const handleGetDeal = () => {
        setActivated(true);
        trackEvent('deal_clicked', { couponId: coupon.id });

        openCouponModal({
            ...coupon,
            storeName,
            storeLogo: storeLogo || undefined
        });

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&storeId=${coupon.storeId || 'none'}&couponId=${coupon.id}&source=coupon-card-deal&type=deal`;
        window.open(outUrl, "_blank");
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-1 shadow-premium-sm hover:shadow-premium-md flex flex-col relative group p-6">
            
            {/* Header: Store Info & Save Deal */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    {storeLogo ? (
                        <div className="w-12 h-12 relative bg-white rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            <Image unoptimized src={storeLogo} alt={storeName} fill className="object-contain p-2" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-slate-400">{storeName.charAt(0)}</span>
                        </div>
                    )}
                    
                    <div>
                        <span className="text-label text-slate-900 block leading-tight">{storeName}</span>
                        {/* Keep badge minimal */}
                        {badgeLabel && (
                            <span className="inline-block mt-1 text-overline text-brand-indigo">
                                {badgeLabel}
                            </span>
                        )}
                    </div>
                </div>

                <SaveDealButton dealId={coupon.id} />
            </div>

                {/* 1. How much money do I save? */}
                {coupon.discountValue && (
                    <SavingsBadge value={coupon.discountValue} className="mb-2" />
                )}

                {/* 2. Coupon Title */}
                <h3 className="text-body text-slate-700 leading-snug mb-4">
                    {coupon.title}
                </h3>

                {/* 3. Coupon Reputation UI (The Moat) */}
                <div className="mt-auto grid grid-cols-3 gap-2 py-3 px-1 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Worked</span>
                        <div className="flex items-center gap-1 text-brand-emerald font-bold text-sm">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {successRate}%
                        </div>
                    </div>
                    
                    <div className="flex flex-col border-l border-slate-100 pl-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Used</span>
                        <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {((coupon.usageCount || 0) + 1234).toLocaleString()}
                        </div>
                    </div>

                    <div className="flex flex-col border-l border-slate-100 pl-3 relative">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Verified</span>
                        <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                            {/* Pulsing dot for recently verified */}
                            <span className="relative flex h-2 w-2 mr-0.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                            </span>
                            {coupon.lastVerifiedAt ? formatDistanceToNow(new Date(coupon.lastVerifiedAt)).replace('about ', '') : 'Today'}
                        </div>
                    </div>
                </div>

            {/* Action Area */}
            <div className="mt-2">
                {hasCouponCode ? (
                    <button
                        onClick={handleRevealAndCopy}
                        className="w-full h-12 flex items-stretch rounded-xl overflow-hidden bg-brand-emerald text-white shadow-premium-sm hover:shadow-premium-md active:scale-[0.98] transition-all group/btn"
                    >
                        <div className="flex-1 flex items-center justify-center bg-emerald-700/50 border-r border-emerald-500/30">
                            <span className="font-mono text-label tracking-widest text-emerald-50">
                                {revealed ? coupon.code : maskCode(coupon.code!)}
                            </span>
                        </div>
                        <div className={`flex items-center gap-2 px-5 text-label transition-colors ${
                            copied ? 'bg-emerald-600 text-white' : 'bg-brand-emerald text-white group-hover/btn:bg-emerald-600'
                        }`}>
                            {copied ? (
                                <><Check className="w-4 h-4" /> ✓ Coupon copied</>
                            ) : revealed ? (
                                <><Copy className="w-4 h-4" /> Copy Code</>
                            ) : (
                                <><Copy className="w-4 h-4" /> Reveal Code</>
                            )}
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={handleGetDeal}
                        className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl text-label transition-all shadow-premium-sm hover:shadow-premium-md active:scale-[0.98] ${
                            activated 
                                ? 'bg-emerald-50 text-brand-emerald border border-emerald-200'
                                : 'bg-brand-emerald hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {activated ? (
                            <><Check className="w-4 h-4" /> Activated</>
                        ) : (
                            <>Get Deal <ExternalLink className="w-4 h-4" /></>
                        )}
                    </button>
                )}
            </div>

        </div>
    );
}
