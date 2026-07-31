"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { OfferCard } from "@/components/ui/OfferCard";
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
        <section className="relative bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800/80">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    
                    {/* Left: Merchant Context */}
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-premium-sm">
                                {store.logo ? (
                                    <Image src={store.logo} alt={store.name} width={80} height={80} className="object-contain p-2" />
                                ) : (
                                    <span className="text-3xl font-display-sm font-bold text-slate-400">{store.name.charAt(0)}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-display-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                    {store.name} Coupons
                                </h1>
                                <div className="flex items-center gap-1 text-amber-500 text-sm mt-2">
                                    {"★★★★★".split('').map((star, i) => (
                                        <span key={i} className="text-base">{star}</span>
                                    ))}
                                    <span className="text-slate-500 font-medium ml-2 text-xs">4.8 (Verified)</span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics and Save Button */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
                            <button 
                                onClick={() => isSaved ? removeStore(store.slug) : saveStore(store.slug)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all border text-sm shadow-sm ${
                                    isSaved 
                                    ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' 
                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-brand-indigo hover:text-brand-indigo dark:hover:text-brand-indigo'
                                }`}
                            >
                                <Heart className={`w-4 h-4 ${isSaved ? 'fill-brand-indigo' : ''}`} />
                                {isSaved ? "Saved" : "Save Store"}
                            </button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                            <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                                <Tag className="w-4 h-4 text-slate-400" /> {activeCoupons.length} Working Offers
                            </span>
                            {store.cashbackRate && (
                                <span className="flex items-center gap-1.5 font-bold text-brand-emerald text-sm">
                                    <TrendingUp className="w-4 h-4" /> {store.cashbackRate} Cashback
                                </span>
                            )}
                            <span className="text-slate-500 flex items-center gap-1.5 text-sm font-medium">
                                <Clock className="w-4 h-4" /> Updated {lastCheckedText}
                            </span>
                        </div>
                    </div>

                    {/* Right: Best Deal Directly in Hero */}
                    <div className="flex-1 w-full max-w-md lg:max-w-lg shrink-0">
                        {bestDeal ? (
                            <div className="relative">
                                <div className="absolute -top-3 left-6 z-10">
                                    <span className="bg-brand-indigo text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-premium-sm flex items-center gap-1">
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
                                    className="border-brand-indigo/20 shadow-premium-md"
                                />
                            </div>
                        ) : (
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-premium-sm">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active codes right now</h3>
                                <p className="text-slate-500">We check for new {store.name} deals continuously.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            {bestDeal && (
                <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo">Best Deal</span>
                            <span className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{bestDeal.discountValue || "Save Big"}</span>
                        </div>
                        <button 
                            onClick={handleCopyCoupon}
                            className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-300 ${copied ? 'bg-brand-emerald text-white scale-105' : 'bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-premium-sm'}`}
                        >
                            {copied ? "Copied!" : "Get Deal"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
