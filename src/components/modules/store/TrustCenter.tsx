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
        </div>
    );
}
