"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { formatDistanceToNow } from 'date-fns';
import { useShoppingProfile } from "@/components/providers/UserProvider";
import confetti from 'canvas-confetti';
import { Heart, Tag, TrendingUp, ShieldCheck, Clock } from 'lucide-react';

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
        const handleScroll = () => setShowStickyCTA(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyCoupon = (e: React.MouseEvent) => {
        console.log("Analytics: onCopyCoupon", { store: store.name, dealId: bestDeal?.id });
        const outUrl = bestDeal ? `/out?url=${encodeURIComponent(bestDeal.affiliateUrl)}&couponId=${bestDeal.id}&storeId=${store.id}&source=store-hero` : "";

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
                confetti({ particleCount: 40, spread: 50, origin: { x, y }, colors: ['#4f46e5', '#10b981'], disableForReducedMotion: true, zIndex: 100 });
            } catch (err) {}
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="w-full bg-surface-card shadow-sm border-b border-surface-container">
            <div className="max-w-max-width mx-auto px-gutter-desktop py-space-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
                    {/* Store Brand Badge & Info */}
                    <div className="flex items-start gap-space-lg flex-1">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-slate-100 bg-white flex flex-col items-center justify-center p-space-sm shadow-md overflow-hidden relative">
                                {store.logo ? (
                                    <Image unoptimized src={store.logo} alt={`${store.name} store logo`} fill className="object-contain p-3" />
                                ) : (
                                    <span className="font-headline-hero text-headline-md tracking-widest text-slate-400 font-black leading-none select-none uppercase">{store.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-verified-emerald text-on-secondary w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                            </div>
                        </div>

                        {/* Store Title & Metrics */}
                        <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-space-xs mb-2">
                                <span className="bg-verified-emerald-bg text-verified-emerald font-label-badge text-label-badge px-space-xs py-0.5 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified Merchant
                                </span>
                                <span className="bg-brand-indigo-light text-primary font-label-badge text-label-badge px-space-xs py-0.5 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span> 99% Success
                                </span>
                            </div>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                                {store.name} Coupons & Promo Codes
                            </h1>
                            <p className="font-body-md text-body-md text-text-muted mt-1 max-w-2xl line-clamp-2">
                                Get the latest working discount codes and cashback offers for {store.name} at checkout.
                            </p>
                            <div className="flex flex-wrap items-center gap-space-sm mt-space-md">
                                <div className="flex items-center gap-2 bg-surface-container-low px-space-sm py-1 rounded-full text-text-muted font-body-sm text-body-sm">
                                    <span className="w-2 h-2 rounded-full bg-verified-emerald animate-pulse"></span>
                                    <span><strong>{activeCoupons.length} Active Offers</strong> today</span>
                                </div>
                                <span className="text-text-muted hidden sm:inline">•</span>
                                <div className="text-text-muted font-body-sm text-body-sm">
                                    Updated {formatDistanceToNow(new Date(), { addSuffix: true })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Actions & Cashback Card */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-space-sm flex-shrink-0">
                        <div className="w-full lg:w-72 bg-gradient-to-br from-primary-container to-brand-indigo-hover text-on-primary p-space-md rounded-2xl shadow-md flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="font-label-badge text-label-badge uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Best Offer Today</span>
                                <span className="material-symbols-outlined text-secondary-fixed text-[22px]">local_offer</span>
                            </div>
                            <div className="my-space-xs">
                                <div className="font-headline-md text-headline-md font-extrabold leading-tight line-clamp-1">{bestDeal?.discountValue || "Special Deal"}</div>
                                <p className="font-body-sm text-body-sm text-on-primary-container text-[12px] line-clamp-2">{bestDeal?.title || "Unlock top savings on your order."}</p>
                            </div>
                            <button onClick={handleCopyCoupon} className="w-full mt-space-xs bg-white hover:bg-surface-container text-primary font-label-btn text-label-btn py-2 px-space-md rounded-xl flex items-center justify-center gap-space-2xs transition-all shadow-sm">
                                <span>{copied ? "Copied!" : "Activate Deal"}</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-space-xs w-full justify-between sm:justify-end">
                            <button onClick={() => isSaved ? removeStore(store.slug) : saveStore(store.slug)} className={`font-label-btn text-label-btn px-space-md py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${isSaved ? "bg-surface-container border-primary text-primary" : "bg-surface-card border-border-subtle text-on-surface hover:bg-surface-container"}`}>
                                <span className="material-symbols-outlined text-[18px]">{isSaved ? "favorite" : "favorite_border"}</span>
                                <span>{isSaved ? "Saved" : "Save Store"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            {bestDeal && (
                <div className={`md:hidden fixed bottom-16 pb-safe left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-30 transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-[150%]'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo">Best Deal</span>
                            <span className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{bestDeal.discountValue || "Save Big"}</span>
                        </div>
                        <button 
                            onClick={handleCopyCoupon}
                            className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${copied ? 'bg-verified-emerald text-white scale-105' : 'bg-verified-emerald text-white hover:bg-emerald-600 shadow-premium-sm'}`}
                        >
                            {copied ? "Copied!" : "Get Deal"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
