"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from "@/components/ui/Icon";
import { OfferCard } from "@/components/ui/OfferCard";
import { formatDistanceToNow } from 'date-fns';
import { useShoppingProfile } from "@/components/providers/UserProvider";
import confetti from 'canvas-confetti';

import { useCouponModal } from '@/components/providers/CouponModalProvider';

export interface StoreHeroProps {
    store: any; // e.g. from getMerchantBySlug
    activeCoupons: any[];
    bestDeal: any;
}

export function StoreHero({ store, activeCoupons, bestDeal }: StoreHeroProps) {
    const [copied, setCopied] = useState(false);
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const { openCouponModal } = useCouponModal();

    const { isStoreSaved, saveStore, removeStore, addRecentStore } = useShoppingProfile();
    const isSaved = store?.slug ? isStoreSaved(store.slug) : false;

    useEffect(() => {
        if (store) {
            addRecentStore({ slug: store.slug, name: store.name, logo: store.logo });
        }
        
        const handleScroll = () => {
            // Show sticky CTA when scrolling past the hero area on mobile
            if (window.scrollY > 300) {
                setShowStickyCTA(true);
            } else {
                setShowStickyCTA(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const lastCheckedText = activeCoupons.length > 0 
        ? formatDistanceToNow(new Date(Math.max(...activeCoupons.map((c: any) => new Date(c.createdAt).getTime()))), { addSuffix: true }) 
        : "today";
        
    const bestSavings = bestDeal?.discountValue || "SPECIAL OFFER";

    const handleCopyCoupon = (e: React.MouseEvent) => {
        // Analytics track stub
        console.log("Analytics: onCopyCoupon", { store: store.name, dealId: bestDeal?.id });
        
        const outUrl = bestDeal 
            ? `/out?url=${encodeURIComponent(bestDeal.affiliateUrl)}&couponId=${bestDeal.id}&source=store-hero`
            : "";

        if (bestDeal) {
            window.open(outUrl, "_blank");

            openCouponModal({
                id: bestDeal.id,
                title: bestDeal.title,
                code: bestDeal.code || undefined,
                description: bestDeal.description || undefined,
                affiliateUrl: outUrl,
                storeName: store.name,
                storeLogo: store.logo || undefined,
            });
        }

        if (bestDeal?.code) {
            navigator.clipboard.writeText(bestDeal.code);
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
                // ignore
            }

            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="relative bg-white dark:bg-black border-b border-surface-200 dark:border-surface-800">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    
                    {/* Left: Merchant Context */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-inverse-surface flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                {store.logo ? (
                                    <Image src={store.logo} alt={store.name} width={64} height={64} className="object-contain p-1" />
                                ) : (
                                    <Image src={`https://icon.horse/icon/${store.slug.replace(/-/g, '')}.com`} alt={store.name} width={64} height={64} className="object-contain p-1" unoptimized />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-slate-900 dark:text-white">
                                    {store.name} Coupons
                                </h1>
                                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-sm mt-1">
                                    <Icon name="star" variant="fill" className="text-[14px]" />
                                    <Icon name="star" variant="fill" className="text-[14px]" />
                                    <Icon name="star" variant="fill" className="text-[14px]" />
                                    <Icon name="star" variant="fill" className="text-[14px]" />
                                    <Icon name="star_half" variant="fill" className="text-[14px]" />
                                    <span className="text-surface-600 dark:text-surface-400 font-medium ml-1">4.8 (Verified)</span>
                                </div>
                            </div>
                        </div>

                        {/* Save Store Button & Evidence & Metrics */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm pt-2">
                            <button 
                                onClick={() => isSaved ? removeStore(store.slug) : saveStore(store.slug)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${
                                    isSaved 
                                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800' 
                                    : 'bg-white dark:bg-surface-900 text-slate-700 dark:text-white border-surface-200 dark:border-surface-700 hover:border-primary hover:text-primary'
                                }`}
                            >
                                <Icon name={isSaved ? "favorite" : "favorite_border"} className={`text-[18px] ${isSaved ? 'text-primary' : ''}`} variant={isSaved ? 'fill' : 'outline'} />
                                {isSaved ? "Saved" : "Save Store"}
                            </button>
                            <div className="w-px h-6 bg-surface-200 dark:bg-surface-800 mx-1 hidden sm:block"></div>
                            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                                <Icon name="local_offer" className="text-[16px] text-surface-400" /> {activeCoupons.length} Working Offers
                            </span>
                            {store.cashbackRate && (
                                <span className="flex items-center gap-1 font-bold text-green-600 dark:text-green-400">
                                    <Icon name="payments" className="text-[16px]" /> {store.cashbackRate} Cashback
                                </span>
                            )}
                            <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                                <Icon name="savings" className="text-[16px] text-surface-400" /> Save {bestSavings}
                            </span>
                            <span className="text-surface-500 dark:text-surface-500 flex items-center gap-1">
                                <Icon name="update" className="text-[16px]" /> Updated {lastCheckedText}
                            </span>
                        </div>
                    </div>

                    {/* Right: Best Deal Directly in Hero */}
                    <div className="flex-1 w-full max-w-md lg:max-w-lg shrink-0">
                        {bestDeal ? (
                            <div className="relative">
                                <div className="absolute -top-3 left-4 z-10">
                                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                        ⭐ Best Offer Today
                                    </span>
                                </div>
                                <OfferCard
                                    isBestDeal={true}
                                    coupon={{
                                        ...bestDeal,
                                        affiliateUrl: bestDeal.affiliateUrl || `/go/${bestDeal.id}`,
                                        successRate: 98,
                                    }}
                                    className="border-primary-200 dark:border-primary-900/50 shadow-lg shadow-primary-500/5"
                                />
                            </div>
                        ) : (
                            <div className="bg-surface-50 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-800 text-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active codes right now</h3>
                                <p className="text-surface-600 dark:text-surface-400">We check for new {store.name} deals continuously.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            {bestDeal && (
                <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Best Deal</span>
                            <span className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{bestDeal.discountValue || "Save Big"}</span>
                        </div>
                        <button 
                            onClick={handleCopyCoupon}
                            className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${copied ? 'bg-verified text-white scale-105' : 'bg-primary text-white hover:bg-primary-600'}`}
                        >
                            {copied ? "Copied!" : "Get Deal"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
