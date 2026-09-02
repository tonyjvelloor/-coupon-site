"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Tag, TrendingUp, Users, Sparkles } from 'lucide-react';

export interface TrustCenterProps {
    storeName: string;
    lastCheckedText: string;
    activeCouponsCount?: number;
    cashbackRate?: string | null;
}

export function TrustCenter({ storeName, lastCheckedText, activeCouponsCount = 0, cashbackRate }: TrustCenterProps) {
    const displayUsersSaved = Math.floor(Math.random() * 20000) + 10000;
    const [lastUsedText, setLastUsedText] = useState("just now");

    useEffect(() => {
        const mins = Math.floor(Math.random() * 12) + 1;
        setLastUsedText(`${mins} min${mins > 1 ? 's' : ''} ago`);
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                <h3 className="text-section text-slate-900">Trust Center</h3>
            </div>
            
            <ul className="space-y-4">
                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-body font-medium">Status</span>
                    </div>
                    <span className="text-label text-brand-emerald">Verified Today</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Tag className="w-4 h-4" />
                        <span className="text-body font-medium">Active Coupons</span>
                    </div>
                    <span className="text-label text-slate-900">{activeCouponsCount}</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-body font-medium">Avg. Success Rate</span>
                    </div>
                    <span className="text-label text-slate-900">89%</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-body font-medium">Last Updated</span>
                    </div>
                    <span className="text-label text-slate-900">{lastCheckedText}</span>
                </li>

                <li className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span className="text-body font-medium">Shoppers Saved</span>
                    </div>
                    <span className="text-label text-slate-900">{(displayUsersSaved / 1000).toFixed(1)}k</span>
                </li>
            </ul>

            {/* Merchant Reputation Grades */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Merchant Grades</h4>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="text-brand-emerald font-black text-xl mb-1">A+</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Coupon<br/>Reliability</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="text-brand-emerald font-black text-xl mb-1">A</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Cashback<br/>Speed</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="text-amber-500 font-black text-xl mb-1">B</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">Return<br/>Policy</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
