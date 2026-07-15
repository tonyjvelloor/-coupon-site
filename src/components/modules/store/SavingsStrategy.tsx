"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";

export interface SavingStep {
    type: "coupon" | "cashback" | "bank" | "student" | "giftcard" | "reward" | "emi";
    title: string;
    savings?: number;
    available: boolean;
}

export interface SavingsStrategyProps {
    store: any;
    bestDeal: any;
}

export function SavingsStrategy({ store, bestDeal }: SavingsStrategyProps) {
    if (!bestDeal && !store.cashbackRate) return null;

    // 1. Build the dynamic pipeline
    const pipeline: SavingStep[] = [];

    // Step A: Coupon
    if (bestDeal) {
        const parsedSavings = bestDeal.discountValue ? parseInt(bestDeal.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
        pipeline.push({
            type: "coupon",
            title: `Use Coupon ${bestDeal.code ? `"${bestDeal.code}"` : 'Deal'}`,
            savings: parsedSavings > 0 ? parsedSavings : undefined,
            available: true
        });
    }

    // Step B: Cashback
    if (store.cashbackRate) {
        const parsedCashback = parseInt(store.cashbackRate.replace(/[^0-9]/g, '')) || 0;
        pipeline.push({
            type: "cashback",
            title: `Activate ${store.cashbackRate} Cashback`,
            savings: parsedCashback > 0 ? parsedCashback : undefined,
            available: true
        });
    }

    // Step C: Bank Offer (If coupon has a bank associated)
    if (bestDeal?.bank) {
        // Stubbing a mock savings value for bank just to show the pipeline math works, ideally this comes from DB
        pipeline.push({
            type: "bank",
            title: `Pay with ${bestDeal.bank} Card`,
            savings: 1500, 
            available: true
        });
    }

    // 2. Filter available and calculate total
    const activeSteps = pipeline.filter(step => step.available);
    const totalSavings = activeSteps.reduce((acc, step) => acc + (step.savings || 0), 0);

    const getIconForType = (type: string) => {
        switch(type) {
            case "coupon": return "local_offer";
            case "cashback": return "payments";
            case "bank": return "credit_card";
            case "student": return "school";
            case "giftcard": return "card_giftcard";
            default: return "savings";
        }
    };

    return (
        <section className="bg-primary-50 dark:bg-primary-900/10 border-2 border-primary-100 dark:border-primary-900 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-headline-md font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Icon name="magic_button" className="text-primary text-2xl" /> Maximize Your Savings
            </h2>
            
            <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-4 bottom-12 w-[2px] bg-primary-200 dark:bg-primary-800 z-0"></div>
                
                {activeSteps.map((step, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-2 bg-white dark:bg-surface-900 p-4 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800 hover:shadow-md transition-shadow cursor-default" onClick={() => console.log("Analytics: onViewStrategyStep", { step: step.type })}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary flex-shrink-0">
                                <Icon name={getIconForType(step.type)} className="text-[20px]" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{step.title}</span>
                        </div>
                        {step.savings ? (
                            <span className="font-bold text-green-600 dark:text-green-400 font-headline-sm">
                                ₹{step.savings.toLocaleString()}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
            
            {totalSavings > 0 && (
                <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-800 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">Final Savings</span>
                    <span className="text-3xl font-black font-headline-lg text-green-600 dark:text-green-400">
                        ₹{totalSavings.toLocaleString()}
                    </span>
                </div>
            )}
        </section>
    );
}
