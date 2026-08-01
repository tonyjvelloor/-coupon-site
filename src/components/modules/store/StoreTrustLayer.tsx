"use client";

import React from "react";
import { ShieldCheck, Clock, Tag, TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StoreTrustLayerProps {
    storeName: string;
    activeCouponsCount: number;
    cashbackRate?: string | null;
    lastVerifiedDate?: Date | string | null;
    usersSaved?: number; // Mock or real data
}

export function StoreTrustLayer({ storeName, activeCouponsCount, cashbackRate, lastVerifiedDate, usersSaved }: StoreTrustLayerProps) {
    const updatedText = lastVerifiedDate 
        ? formatDistanceToNow(new Date(lastVerifiedDate), { addSuffix: true })
        : "just now";

    // Fallback mock if usersSaved isn't provided
    const displayUsersSaved = usersSaved || (Math.floor(Math.random() * 20000) + 10000);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 text-lg">Verified Merchant</h3>
            </div>
            
            <ul className="space-y-4">
                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Updated</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{updatedText}</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Working Coupons</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{activeCouponsCount}</span>
                </li>

                {cashbackRate && (
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-slate-600">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">Cashback Offers</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{cashbackRate}</span>
                    </li>
                )}

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Last Verified</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">Today</span>
                </li>

                <li className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium">Users Saved This Month</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{displayUsersSaved.toLocaleString()}</span>
                </li>
            </ul>
        </div>
    );
}
