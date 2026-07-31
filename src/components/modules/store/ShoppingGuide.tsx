"use client";

import React from 'react';
import { SmartShoppingBlocks } from "@/components/ui/SmartShoppingBlocks";
import { Lightbulb, ArrowRight } from 'lucide-react';

export interface ShoppingGuideProps {
    storeName: string;
    contents: any[];
}

export function ShoppingGuide({ storeName, contents }: ShoppingGuideProps) {
    if (!contents || contents.length === 0) return null;

    return (
        <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
            {/* Stubbed Shopping Context (Feature request: "Prime Day starts tomorrow -> Prices usually drop 18%") */}
            <div 
                className="mb-8 bg-brand-indigo/5 dark:bg-brand-indigo/10 border border-brand-indigo/10 dark:border-brand-indigo/20 rounded-2xl p-6 cursor-pointer hover:shadow-premium-sm transition-all"
                onClick={() => console.log("Analytics: onShoppingContextClicked")}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-indigo/10 dark:bg-brand-indigo/20 flex items-center justify-center text-brand-indigo shrink-0 mt-1">
                        <Lightbulb className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 uppercase tracking-wider text-brand-indigo">Shopping Intelligence</h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span>Big Sale expected soon</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span>Prices usually drop 15-20%</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <span className="text-brand-indigo font-bold">Consider waiting</span>
                        </div>
                    </div>
                </div>
            </div>

            <SmartShoppingBlocks storeName={storeName} contents={contents} />
        </section>
    );
}
