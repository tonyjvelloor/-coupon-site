"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface SavingsCalculatorProps {
    baseSavings: number;
    cashbackSavings: number;
    cardSavings: number;
}

export function SavingsCalculator({ baseSavings, cashbackSavings, cardSavings }: SavingsCalculatorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartValue, setCartValue] = useState(10000);

    // Simplified dynamic calculation for v1
    // Assume baseSavings is 10%, cashback is 5%, card is 2.5% up to a limit
    const calculatedBase = Math.round(cartValue * 0.10);
    const calculatedCashback = Math.round(cartValue * 0.05);
    const calculatedCard = Math.round(cartValue * 0.025);
    const totalSaved = calculatedBase + calculatedCashback + calculatedCard;

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-between p-4 mt-2 bg-surface-50 hover:bg-surface-100 rounded-xl border border-surface-200 text-slate-900 transition font-medium"
            >
                <span className="flex items-center gap-2"><Icon name="calculate" className="text-surface-500"/> Calculate exact savings</span>
                <Icon name="expand_more" />
            </button>
        );
    }

    return (
        <div className="mt-2 bg-white rounded-xl border border-surface-200 overflow-hidden shadow-sm">
            <button 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-4 bg-surface-50 border-b border-surface-200 text-slate-900 transition font-medium hover:bg-surface-100"
            >
                <span className="flex items-center gap-2"><Icon name="calculate" className="text-surface-500"/> Calculator</span>
                <Icon name="expand_less" />
            </button>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Cart Value (₹)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 font-bold">₹</span>
                        <input 
                            type="number" 
                            value={cartValue}
                            onChange={(e) => setCartValue(Number(e.target.value) || 0)}
                            className="w-full pl-8 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-surface-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-surface-600 font-medium">Coupon Discount (10%)</span>
                        <span className="font-bold text-slate-900">₹{calculatedBase.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-surface-600 font-medium">Cashback (5%)</span>
                        <span className="font-bold text-slate-900">₹{calculatedCashback.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-surface-600 font-medium">Card Offer (2.5%)</span>
                        <span className="font-bold text-slate-900">₹{calculatedCard.toLocaleString()}</span>
                    </div>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-surface-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Total Saved</span>
                    <span className="text-2xl font-black text-green-600">₹{totalSaved.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
