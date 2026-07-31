"use client";

import React from 'react';
import { Sparkles, Tag, TrendingUp, CreditCard, GraduationCap, Gift, Wallet } from 'lucide-react';

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
            case "coupon": return <Tag className="w-5 h-5 text-brand-indigo" />;
            case "cashback": return <TrendingUp className="w-5 h-5 text-brand-indigo" />;
            case "bank": return <CreditCard className="w-5 h-5 text-brand-indigo" />;
            case "student": return <GraduationCap className="w-5 h-5 text-brand-indigo" />;
            case "giftcard": return <Gift className="w-5 h-5 text-brand-indigo" />;
            default: return <Wallet className="w-5 h-5 text-brand-indigo" />;
        }
    };

    return (
        <section className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-premium-sm">
            <h2 className="text-xl font-display-sm font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <Sparkles className="text-brand-indigo w-5 h-5" /> Maximize Your Savings
            </h2>
            
            <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-[23px] top-4 bottom-12 w-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
                
                {activeSteps.map((step, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-premium-md hover:border-brand-indigo/30 transition-all cursor-default" onClick={() => console.log("Analytics: onViewStrategyStep", { step: step.type })}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800">
                                {getIconForType(step.type)}
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">{step.title}</span>
                        </div>
                        {step.savings ? (
                            <span className="font-bold text-brand-emerald font-display-sm md:text-lg">
                                ₹{step.savings.toLocaleString()}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
            
            {totalSavings > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Final Savings</span>
                    <span className="text-3xl font-display-md font-bold text-brand-emerald">
                        ₹{totalSavings.toLocaleString()}
                    </span>
                </div>
            )}
        </section>
    );
}
