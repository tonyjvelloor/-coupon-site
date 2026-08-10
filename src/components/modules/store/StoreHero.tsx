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
    
    const [activeShoppers, setActiveShoppers] = useState(12);
    
    useEffect(() => {
        setActiveShoppers(Math.floor(Math.random() * 18) + 8);
    }, []);

    const handleCopyCoupon = (e: React.MouseEvent) => {
        // Analytics track stub
        console.log("Analytics: onCopyCoupon", { store: store.name, dealId: bestDeal?.id });
        
        const outUrl = bestDeal 
            ? `/out?url=${encodeURIComponent(bestDeal.affiliateUrl)}&couponId=${bestDeal.id}&storeId=${store.id}&source=store-hero`
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
                    colors: ['#6366f1', '#10b981', '#f59e0b'],
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
        <section className="relative bg-white border-b border-slate-200">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    
                    {/* Left: Merchant Context */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-premium-sm">
                                {store.logo ? (
                                    <Image unoptimized src={store.logo} alt={`${store.name} store logo`} width={64} height={64} className="object-contain p-1" />
                                ) : (
                                    <span className="text-heading text-slate-400">{store.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-display-l text-slate-900">
                                    {store.name} Coupons
                                </h1>
                                
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-slate-600">
                                    <span className="flex items-center gap-1.5 font-medium text-brand-emerald">
                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                        Verified Merchant
                                    </span>
                                    <span className="hidden md:inline text-slate-300">•</span>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                        Updated {lastCheckedText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shopping Confidence Block */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mt-4">
                            <div className="w-8 h-8 rounded-full bg-brand-emerald/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-brand-emerald text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                            <div>
                                <p className="font-bold text-emerald-900 leading-tight mb-1">
                                    You can probably save {bestSavings} today
                                </p>
                                <p className="text-sm text-emerald-700">
                                    Based on {activeCoupons.length} active coupons and {activeShoppers} shoppers who saved here today.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button 
                                onClick={() => isSaved ? removeStore(store.slug) : saveStore(store.slug)}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-label transition-all border shadow-sm active:scale-95 ${
                                    isSaved 
                                    ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' 
                                    : 'bg-white text-slate-700 border-slate-300 hover:border-brand-indigo hover:text-brand-indigo'
                                }`}
                            >
                                <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-brand-indigo text-brand-indigo scale-110' : 'group-hover:scale-110'}`} />
                                {isSaved ? "Saved" : "Save Store"}
                            </button>
                            
                            {store.cashbackRate && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-emerald/10 text-brand-emerald rounded-full text-label border border-brand-emerald/20">
                                    <span className="material-symbols-outlined text-[16px]">payments</span>
                                    {store.cashbackRate} Cashback
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Best Deal Directly in Hero */}
                    <div className="flex-1 w-full max-w-md lg:max-w-lg shrink-0">
                        {bestDeal ? (
                            <div className="relative">
                                <div className="absolute -top-3 left-6 z-10">
                                    <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        ⭐ Best Offer Today
                                    </span>
                                </div>
                                <PremiumOfferCard
                                    coupon={{
                                        ...bestDeal,
                                        affiliateUrl: bestDeal.affiliateUrl || `/go/${bestDeal.id}`,
                                        successRate: 98,
                                    }}
                                    storeName={store.name}
                                    storeLogo={store.logo}
                                    badgeLabel="Highest Savings"
                                />
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center shadow-premium-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No active codes right now</h3>
                                <p className="text-slate-500">We check for new {store.name} deals continuously.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            {bestDeal && (
                <div className={`md:hidden fixed bottom-16 pb-safe left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-30 transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-[150%]'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo">Best Deal</span>
                            <span className="font-bold text-slate-900 text-lg leading-tight">{bestDeal.discountValue || "Save Big"}</span>
                        </div>
                        <button 
                            onClick={handleCopyCoupon}
                            className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${copied ? 'bg-brand-emerald text-white scale-105' : 'bg-brand-emerald text-white hover:bg-emerald-600 shadow-premium-sm'}`}
                        >
                            {copied ? "Copied!" : "Get Deal"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
