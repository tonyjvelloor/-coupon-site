"use client";

import React from 'react';
import { SmartShoppingBlocks } from "@/components/ui/SmartShoppingBlocks";
import { Icon } from "@/components/ui/Icon";

export interface ShoppingGuideProps {
    storeName: string;
    contents: any[];
}

export function ShoppingGuide({ storeName, contents }: ShoppingGuideProps) {
    if (!contents || contents.length === 0) return null;

    return (
        <section className="pt-12 border-t border-surface-200 dark:border-surface-800">
            {/* Stubbed Shopping Context (Feature request: "Prime Day starts tomorrow -> Prices usually drop 18%") */}
            <div 
                className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => console.log("Analytics: onShoppingContextClicked")}
            >
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0 mt-1">
                        <Icon name="tips_and_updates" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Shopping Intelligence</h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                            <span>Big Sale expected soon</span>
                            <Icon name="arrow_forward" className="text-[14px] text-surface-400" />
                            <span>Prices usually drop 15-20%</span>
                            <Icon name="arrow_forward" className="text-[14px] text-surface-400" />
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Consider waiting</span>
                        </div>
                    </div>
                </div>
            </div>

            <SmartShoppingBlocks storeName={storeName} contents={contents} />
        </section>
    );
}
