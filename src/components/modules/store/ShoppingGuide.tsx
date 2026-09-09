"use client";

import React from 'react';
import { SmartShoppingBlocks } from "@/components/ui/SmartShoppingBlocks";
import { Lightbulb, ArrowRight } from 'lucide-react';

export interface ShoppingGuideProps {
    storeName: string;
    storeSlug?: string;
    bestDeal?: any;
    contents: any[];
}

export function ShoppingGuide({ storeName, storeSlug, bestDeal, contents }: ShoppingGuideProps) {
    if (!contents || contents.length === 0) return null;

    const saleContent = contents.find(c => c.type === 'SALE')?.content;

    return (
        <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
            {saleContent && (
                <div 
                    className="mb-8 bg-brand-indigo/5 dark:bg-brand-indigo/10 border border-brand-indigo/10 dark:border-brand-indigo/20 rounded-2xl p-6 hover:shadow-premium-sm transition-all"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-indigo/10 dark:bg-brand-indigo/20 flex items-center justify-center text-brand-indigo shrink-0 mt-1">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 uppercase tracking-wider text-brand-indigo">Shopping Intelligence</h4>
                            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <span>Upcoming Event:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{saleContent}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                <span className="text-brand-indigo font-bold">Stack coupons with bank cards for peak savings</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SmartShoppingBlocks storeName={storeName} storeSlug={storeSlug} bestDeal={bestDeal} contents={contents} />
        </section>
    );
}
