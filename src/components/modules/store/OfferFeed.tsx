"use client";

import React, { useState, useMemo } from 'react';
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { Tag, Sparkles, CreditCard, ShieldCheck, ArrowUpDown } from "lucide-react";

export interface OfferFeedProps {
    store: any;
    offers: any[]; // The remaining offers (excluding bestDeal if we rendered it above)
}

type FilterType = 'all' | 'codes' | 'deals' | 'bank';
type SortType = 'recommended' | 'discount' | 'newest';

export function OfferFeed({ store, offers }: OfferFeedProps) {
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('recommended');

    if (!offers || offers.length === 0) return null;

    // Helper functions for categorization
    const isCode = (c: any) => Boolean(c.code && c.code.trim().length > 0);
    const isDeal = (c: any) => !isCode(c);
    const isBankOffer = (c: any) => {
        const text = `${c.title || ''} ${c.description || ''} ${c.bank || ''}`.toLowerCase();
        return /hdfc|icici|sbi|axis|kotak|citi|bank|card|credit|debit|emi|upi/i.test(text);
    };

    // Calculate counts
    const codesCount = useMemo(() => offers.filter(isCode).length, [offers]);
    const dealsCount = useMemo(() => offers.filter(isDeal).length, [offers]);
    const bankCount = useMemo(() => offers.filter(isBankOffer).length, [offers]);

    // Filter offers
    const filteredOffers = useMemo(() => {
        let result = [...offers];

        if (filter === 'codes') {
            result = result.filter(isCode);
        } else if (filter === 'deals') {
            result = result.filter(isDeal);
        } else if (filter === 'bank') {
            result = result.filter(isBankOffer);
        }

        // Apply sorting
        if (sortBy === 'discount') {
            result.sort((a, b) => {
                const parseDiscount = (val?: string | null) => {
                    if (!val) return 0;
                    const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
                    return isNaN(num) ? 0 : num;
                };
                return parseDiscount(b.discountValue) - parseDiscount(a.discountValue);
            });
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        }

        return result;
    }, [offers, filter, sortBy]);

    return (
        <section id="offers" className="space-y-6 scroll-mt-28">
            {/* Header & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>All Verified Offers</span>
                        <span className="bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            {offers.length} Active
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Hand-tested coupon codes and promotional deals for {store.name}
                    </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortType)}
                        className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 cursor-pointer"
                        aria-label="Sort offers"
                    >
                        <option value="recommended">Recommended</option>
                        <option value="discount">Highest Discount</option>
                        <option value="newest">Newest Added</option>
                    </select>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
                <button
                    onClick={() => setFilter('all')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                        filter === 'all'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                >
                    <span>All Offers</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${filter === 'all' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        {offers.length}
                    </span>
                </button>

                {codesCount > 0 && (
                    <button
                        onClick={() => setFilter('codes')}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                            filter === 'codes'
                                ? 'bg-brand-indigo text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Coupon Codes</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${filter === 'codes' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {codesCount}
                        </span>
                    </button>
                )}

                {dealsCount > 0 && (
                    <button
                        onClick={() => setFilter('deals')}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                            filter === 'deals'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Deals & Sales</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${filter === 'deals' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {dealsCount}
                        </span>
                    </button>
                )}

                {bankCount > 0 && (
                    <button
                        onClick={() => setFilter('bank')}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                            filter === 'bank'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bank & Card Discounts</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${filter === 'bank' ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {bankCount}
                        </span>
                    </button>
                )}
            </div>

            {/* Offer Cards Grid */}
            {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                        let assignedMen = false;
                        let assignedWomen = false;
                        let assignedCodes = false;

                        return filteredOffers.map((coupon, index) => {
                            let badgeLabel = undefined;
                            if (index === 0 && filter === 'all') badgeLabel = "Most Popular";
                            else if (index === 1 && coupon.type === "coupon") badgeLabel = "Highest Savings";

                            const titleLower = (coupon.title || "").toLowerCase();
                            const urlLower = (coupon.affiliateUrl || "").toLowerCase();
                            let anchorId: string | undefined = undefined;

                            if (!assignedMen && (urlLower.includes("-men") || /\bmen\b|\bmen's\b/i.test(titleLower))) {
                                anchorId = "men";
                                assignedMen = true;
                            } else if (!assignedWomen && (urlLower.includes("-women") || /\bwomen\b|\bwomen's\b/i.test(titleLower))) {
                                anchorId = "women";
                                assignedWomen = true;
                            } else if (!assignedCodes && Boolean(coupon.code && coupon.code.trim().length > 0)) {
                                anchorId = "promo-code";
                                assignedCodes = true;
                            }

                            return (
                                <div key={coupon.id} id={anchorId} className={anchorId ? "scroll-mt-28" : undefined}>
                                    <PremiumOfferCard
                                        coupon={{
                                            ...coupon,
                                            affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                        }}
                                        storeName={store.name}
                                        storeLogo={store.logo}
                                        badgeLabel={badgeLabel}
                                    />
                                </div>
                            );
                        });
                    })()}
                </div>
            ) : (
                <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        No {filter === 'codes' ? 'coupon codes' : filter === 'deals' ? 'deals' : 'bank offers'} found
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                        All available offers are active under the full store list.
                    </p>
                    <button
                        onClick={() => setFilter('all')}
                        className="text-xs font-bold text-brand-indigo hover:underline"
                    >
                        View All {offers.length} Offers
                    </button>
                </div>
            )}
        </section>
    );
}
