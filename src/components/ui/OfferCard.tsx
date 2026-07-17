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

export function OfferCard({ coupon, storeName, storeLogo, isBestDeal = false, className = "" }: OfferCardProps) {
    const [copied, setCopied] = useState(false);
    const { openCouponModal } = useCouponModal();
    
    const isExpiringSoon = coupon.expiresAt 
        ? new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 
        : false;

    const handleAction = (e: React.MouseEvent) => {
        // Route through redirection engine
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

        if (coupon.type === "coupon" && coupon.code) {
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
                    colors: ['#3b82f6', '#10b981', '#f59e0b'],
                    disableForReducedMotion: true,
                    zIndex: 100
                });
            } catch (err) {
                // Ignore if confetti fails
            }

            setTimeout(() => setCopied(false), 2000);
            trackEvent('coupon_copied', { couponId: coupon.id });
        } else {
            trackEvent('deal_clicked', { couponId: coupon.id });
        }
    };

    return (
        <Card className={`relative group transition-all duration-300 hover:-translate-y-1 ${isBestDeal ? 'border-primary-500 shadow-md shadow-primary-500/10 hover:shadow-primary-500/20' : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 bg-white dark:bg-surface-800'} ${className}`}>
            
            {/* Header Area for Secondary Info */}
            <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-2">
                    {storeLogo ? (
                        <Image src={storeLogo} alt={storeName || "Store"} width={20} height={20} className="object-contain" loading="lazy" />
                    ) : storeName ? (
                        <span className="font-bold text-xs text-surface-500">{storeName}</span>
                    ) : <div />}
                    
                    {isBestDeal && (
                        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary dark:text-primary-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Best Deal
                        </span>
                    )}
                </div>
                
                <div className="z-10 flex items-center gap-1">
                    <ShareDealButton dealId={coupon.id} title={coupon.title} storeName={storeName} />
                    <SaveDealButton dealId={coupon.id} />
                </div>
            </div>

            <CardContent className="p-5 flex flex-col gap-4">
                
                {/* 1. Primary Value Proposition (Dominates) */}
                <div className="flex flex-col">
                    {coupon.discountValue ? (
                        <>
                            <div className={`text-4xl font-bold font-headline-lg leading-none mb-1 ${isBestDeal ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                {coupon.discountValue}
                            </div>
                            <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 line-clamp-1">
                                {coupon.title}
                            </h3>
                        </>
                    ) : (
                        <h3 className="text-xl font-bold font-headline-md text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {coupon.title}
                        </h3>
                    )}
                </div>

                {/* 2. Tags: Verified, Ends Tomorrow */}
                <div className="flex flex-wrap gap-2">
                    {coupon.type === "coupon" && (
                        <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            <Icon name="local_offer" className="text-[12px]" /> Coupon
                        </div>
                    )}
                    
                    {coupon.isVerified && (
                        <div className="flex items-center gap-1 bg-verified-light dark:bg-verified-dark text-verified-high dark:text-verified-low px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            <Icon name="verified" className="text-[12px]" /> Verified
                        </div>
                    )}

                    {coupon.expiresAt && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isExpiringSoon ? 'bg-urgency-light text-urgency-dark dark:bg-urgency-dark dark:text-urgency-light' : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}`}>
                            <Icon name="timer" className="text-[12px]" /> 
                            {isExpiringSoon ? "Ends Tomorrow" : `Ends ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                        </div>
                    )}
                </div>

                {/* 3. Action Area (Copy Code) */}
                <div className="mt-2">
                    {coupon.type === "coupon" && coupon.code ? (
                        <div className="flex items-stretch h-12 border-2 border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden shadow-sm group-hover:border-primary/50 transition-colors">
                            <div className="flex-1 bg-surface-50 dark:bg-surface-900 flex items-center justify-center font-mono font-bold text-slate-900 dark:text-white text-lg tracking-widest border-r border-surface-200 dark:border-surface-700 border-dashed">
                                {coupon.code}
                            </div>
                            <button 
                                onClick={handleAction}
                                className={`px-6 font-bold text-sm transition-all duration-300 ${copied ? 'bg-verified text-white scale-105' : 'bg-primary text-white hover:bg-primary-600'}`}
                            >
                                {copied ? "Copied!" : "Copy Code"}
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
                </div>
                
            </CardContent>
        </Card>
    );
}
