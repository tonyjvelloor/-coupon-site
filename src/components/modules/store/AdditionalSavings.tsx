"use client";

import React from 'react';
import { Banknote, GraduationCap, CreditCard, Gift } from 'lucide-react';

export interface AdditionalSavingsProps {
    store: any;
    hasStudent: boolean;
}

export function AdditionalSavings({ store, hasStudent }: AdditionalSavingsProps) {
    
    // Determine what's available
    const savingsOptions = [
        { 
            id: 'cashback', 
            icon: Banknote, 
            color: 'text-brand-emerald', 
            title: 'Cashback', 
            available: !!store.cashbackRate, 
            desc: store.cashbackRate || 'Not available'
        },
        { 
            id: 'student', 
            icon: GraduationCap, 
            color: 'text-brand-indigo', 
            title: 'Student Discount', 
            available: hasStudent, 
            desc: hasStudent ? 'Available' : 'Check UNiDAYS'
        },
        { 
            id: 'cards', 
            icon: CreditCard, 
            color: 'text-blue-500 dark:text-blue-400', 
            title: 'Card Offers', 
            available: true, 
            desc: 'Bank specific'
        },
        { 
            id: 'giftcards', 
            icon: Gift, 
            color: 'text-purple-500 dark:text-purple-400', 
            title: 'Gift Cards', 
            available: true, 
            desc: 'Up to 5% off'
        }
    ];

    return (
        <section className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-premium-sm">
            <h3 className="text-xl font-display-sm font-bold text-slate-900 dark:text-white mb-6">More Savings Available</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savingsOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                        <div 
                            key={option.id}
                            onClick={() => console.log("Analytics: onAdditionalSavingsClicked", { type: option.id })}
                            className={`flex flex-col items-center justify-center p-5 rounded-xl border text-center cursor-pointer transition-all ${
                                option.available 
                                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-indigo/30 hover:shadow-premium-md' 
                                    : 'bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-70 grayscale'
                            }`}
                        >
                            <IconComponent className={`w-8 h-8 mb-3 ${option.available ? option.color : 'text-slate-400'}`} />
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{option.title}</span>
                            <span className={`text-xs mt-1 font-medium ${option.available ? 'text-brand-indigo' : 'text-slate-500'}`}>
                                {option.desc}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
