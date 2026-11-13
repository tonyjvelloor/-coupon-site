"use client";

import React from 'react';
import { Sparkles, Tag, TrendingUp, CreditCard, GraduationCap, Gift, Wallet } from 'lucide-react';

export interface SavingStep {
    type: "coupon" | "cashback" | "bank" | "student" | "giftcard" | "reward" | "emi";
    title: string;
    badge?: string;
    available: boolean;
}

export interface SavingsStrategyProps {
    store: any;
    bestDeal: any;
}

export function SavingsStrategy({ store, bestDeal }: SavingsStrategyProps) {
    if (!bestDeal && !store.cashbackRate) return null;

    const pipeline: SavingStep[] = [];

    if (bestDeal) {
        pipeline.push({
            type: "coupon",
            title: bestDeal.code ? `Apply Promo Code "${bestDeal.code}"` : `Activate ${store.name} Featured Deal`,
            badge: bestDeal.discountValue || undefined,
            available: true,
        });
    }

    if (store.cashbackRate) {
        pipeline.push({
            type: "cashback",
            title: `Check Partner Reward / Cashback Terms`,
            badge: store.cashbackRate,
            available: true,
        });
    }

    if (bestDeal?.bank) {
        pipeline.push({
            type: "bank",
            title: `Pay with Eligible ${bestDeal.bank} Card`,
            badge: "Bank Offer",
            available: true,
        });
    }

    const activeSteps = pipeline.filter((step) => step.available);

    const getIconForType = (type: string) => {
        switch (type) {
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
            <h2 className="text-heading text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <Sparkles className="text-brand-indigo w-5 h-5" /> Recommended Checkout Stacking Order
            </h2>

            <div className="space-y-4 relative">
                <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>

                {activeSteps.map((step, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800">
                                {getIconForType(step.type)}
                            </div>
                            <span className="text-body font-semibold text-slate-900 dark:text-white">{step.title}</span>
                        </div>
                        {step.badge && (
                            <span className="text-sm font-bold text-brand-emerald bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full self-start md:self-center">
                                {step.badge}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
