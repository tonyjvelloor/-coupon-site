"use client";

import React, { useState } from 'react';
import { Card, CardContent } from './Card';
import { Icon } from './Icon';
import SaveDealButton from './SaveDealButton';
import ShareDealButton from './ShareDealButton';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { trackEvent } from '@/lib/analytics';
import { useCouponModal } from '@/components/providers/CouponModalProvider';

export interface OfferCardProps {
    coupon: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountValue: string | null;
        affiliateUrl: string;
        isVerified: boolean;
        isExclusive: boolean;
        bank?: string | null;
        expiresAt?: Date | string | null;
        successRate?: number;
        createdAt?: Date | string | null;
    };
    storeName?: string;
    storeLogo?: string | null;
    isBestDeal?: boolean;
    className?: string;
}

/** Masks the second half of a code: "FIRST10" → "FIRS•••" */
function maskCode(code: string): string {
    const visibleLen = Math.ceil(code.length / 2);
    return code.slice(0, visibleLen) + "•".repeat(code.length - visibleLen);
}

export function OfferCard({ coupon, storeName, storeLogo, isBestDeal = false, className = "" }: OfferCardProps) {
    const [copied, setCopied] = useState(false);
    const [activated, setActivated] = useState(false);
    const { openCouponModal } = useCouponModal();

    const isExpiringSoon = coupon.expiresAt
        ? new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
        : false;

    const handleCopyCode = (e: React.MouseEvent) => {
        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=offer-card`;
        window.open(outUrl, "_blank");

        openCouponModal({
            id: coupon.id,
            title: coupon.title,
            code: coupon.code || undefined,
            description: coupon.description || undefined,
            affiliateUrl: outUrl,
            storeName: storeName || "Store",
            storeLogo: storeLogo || undefined,
        });

        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);

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
            } catch (_) { /* ignore */ }

            setTimeout(() => setCopied(false), 2500);
            trackEvent('coupon_copied', { couponId: coupon.id });
        }
    };

    const handleGetDeal = (e: React.MouseEvent) => {
        setActivated(true);

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&couponId=${coupon.id}&source=offer-card`;
        window.open(outUrl, "_blank");

        openCouponModal({
            id: coupon.id,
            title: coupon.title,
            description: coupon.description || undefined,
            affiliateUrl: outUrl,
            storeName: storeName || "Store",
            storeLogo: storeLogo || undefined,
        });

        trackEvent('deal_clicked', { couponId: coupon.id });
    };

    const hasCouponCode = coupon.type === "coupon" && coupon.code;

    return (
        <Card className={`relative group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isBestDeal ? 'border-indigo-400 dark:border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-gray-200 dark:border-gray-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/40'} bg-white dark:bg-gray-900 ${className}`}>

            {/* Header */}
            <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    {storeLogo ? (
                        <Image src={storeLogo} alt={storeName || "Store"} width={20} height={20} className="object-contain" loading="lazy" />
                    ) : storeName ? (
                        <span className="font-bold text-xs text-gray-500 dark:text-gray-400">{storeName}</span>
                    ) : <div />}

                    {isBestDeal && (
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Best Deal
                        </span>
                    )}
                </div>

                <div className="z-10 flex items-center gap-1">
                    <ShareDealButton dealId={coupon.id} title={coupon.title} storeName={storeName} />
                    <SaveDealButton dealId={coupon.id} />
                </div>
            </div>

            <CardContent className="p-5 flex flex-col gap-3">

                {/* Discount Value + Title */}
                <div className="flex flex-col">
                    {coupon.discountValue ? (
                        <>
                            <div className={`text-3xl font-extrabold leading-none mb-1 ${isBestDeal ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                                {coupon.discountValue}
                            </div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {coupon.title}
                            </h3>
                        </>
                    ) : (
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {coupon.title}
                        </h3>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {coupon.isVerified && (
                        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <Icon name="verified" className="text-[12px]" /> Verified
                        </div>
                    )}
                    {coupon.expiresAt && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isExpiringSoon ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <Icon name="timer" className="text-[12px]" />
                            {isExpiringSoon ? "Ending Soon" : `Ends ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                        </div>
                    )}
                    {coupon.successRate && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            📈 {coupon.successRate}% Success
                        </div>
                    )}
                </div>

                {/* Action Area */}
                <div className="mt-2">
                    {hasCouponCode ? (
                        /* ── Half-reveal coupon code + Copy button ── */
                        <button
                            onClick={handleCopyCode}
                            className="w-full flex items-stretch h-12 rounded-xl overflow-hidden border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400 transition-all group/btn"
                        >
                            {/* Masked code */}
                            <div className="flex-1 flex items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/30 relative px-4">
                                <span className="font-mono font-bold text-sm text-gray-800 dark:text-white tracking-widest">
                                    {copied ? coupon.code : maskCode(coupon.code!)}
                                </span>
                                {!copied && (
                                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-indigo-100/80 dark:from-indigo-900/60 to-transparent" />
                                )}
                            </div>
                            {/* Copy button */}
                            <div className={`flex items-center gap-1.5 px-5 font-bold text-sm text-white transition-all shrink-0 ${
                                copied ? 'bg-emerald-500' : 'bg-indigo-600 group-hover/btn:bg-indigo-700'
                            }`}>
                                {copied ? (
                                    <><Icon name="check" className="text-[16px]" /> Copied!</>
                                ) : (
                                    <><Icon name="content_copy" className="text-[16px]" /> Copy</>
                                )}
                            </div>
                        </button>
                    ) : activated ? (
                        /* ── Coupon Activated State ── */
                        <div className="w-full flex items-center justify-center gap-2 h-12 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl">
                            <Icon name="check_circle" className="text-[18px] text-emerald-500" />
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Coupon Activated!</span>
                        </div>
                    ) : (
                        /* ── Get Deal Button ── */
                        <button
                            onClick={handleGetDeal}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-emerald-500/10"
                        >
                            Get Deal <Icon name="arrow_forward" className="text-[16px]" />
                        </button>
                    )}
                </div>

                {/* Verified recently */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                        <Icon name="update" className="text-[12px]" /> Verified recently
                    </span>
                    {coupon.expiresAt && (
                        <span>Terms</span>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
