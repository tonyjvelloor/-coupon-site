"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";

export interface AdditionalSavingsProps {
    store: any;
    hasStudent: boolean;
}

export function AdditionalSavings({ store, hasStudent }: AdditionalSavingsProps) {
    
    // Determine what's available
    const savingsOptions = [
        { 
            id: 'cashback', 
            icon: 'payments', 
            color: 'text-green-500', 
            title: 'Cashback', 
            available: !!store.cashbackRate, 
            desc: store.cashbackRate || 'Not available'
        },
        { 
            id: 'student', 
            icon: 'school', 
            color: 'text-primary', 
            title: 'Student Discount', 
            available: hasStudent, 
            desc: hasStudent ? 'Available' : 'Check UNiDAYS'
        },
        { 
            id: 'cards', 
            icon: 'credit_card', 
            color: 'text-blue-500', 
            title: 'Card Offers', 
            available: true, 
            desc: 'Bank specific'
        },
        { 
            id: 'giftcards', 
            icon: 'card_giftcard', 
            color: 'text-purple-500', 
            title: 'Gift Cards', 
            available: true, 
            desc: 'Up to 5% off'
        }
    ];

    return (
        <section className="bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-headline-md font-bold text-slate-900 dark:text-white mb-6">More Savings Available</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savingsOptions.map(option => (
                    <div 
                        key={option.id}
                        onClick={() => console.log("Analytics: onAdditionalSavingsClicked", { type: option.id })}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-colors ${
                            option.available 
                                ? 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm' 
                                : 'bg-surface-100 dark:bg-surface-800 border-transparent opacity-70'
                        }`}
                    >
                        <Icon name={option.icon} className={`text-3xl mb-2 ${option.available ? option.color : 'text-surface-400'}`} />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{option.title}</span>
                        <span className={`text-xs mt-1 font-medium ${option.available ? 'text-primary-600 dark:text-primary-400' : 'text-surface-500'}`}>
                            {option.desc}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
