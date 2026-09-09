"use client";

import React from 'react';
import { ShieldCheck, Clock, Tag, CheckCircle2, BadgePercent, FileCheck } from 'lucide-react';

export interface TrustCenterProps {
    storeName: string;
    lastCheckedText: string;
    activeCouponsCount?: number;
    cashbackRate?: string | null;
}

export function TrustCenter({ storeName, lastCheckedText, activeCouponsCount = 0, cashbackRate }: TrustCenterProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-premium-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                <h3 className="text-section text-slate-900">Verification & Trust Center</h3>
            </div>
            
            <ul className="space-y-4">
                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                        <span className="text-body font-medium">Status</span>
                    </div>
                    <span className="text-label text-brand-emerald font-semibold">Active & Monitored</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span className="text-body font-medium">Live Offers</span>
                    </div>
                    <span className="text-label text-slate-900 font-semibold">{activeCouponsCount} available</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-body font-medium">Last Checked</span>
                    </div>
                    <span className="text-label text-slate-900 font-medium">{lastCheckedText}</span>
                </li>

                <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-600">
                        <FileCheck className="w-4 h-4 text-slate-500" />
                        <span className="text-body font-medium">Source</span>
                    </div>
                    <span className="text-label text-slate-900 font-medium">Direct & Network Feeds</span>
                </li>

                {cashbackRate && (
                    <li className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2.5 text-slate-600">
                            <BadgePercent className="w-4 h-4 text-brand-indigo" />
                            <span className="text-body font-medium">Cashback Available</span>
                        </div>
                        <span className="text-label text-brand-indigo font-bold">{cashbackRate}</span>
                    </li>
                )}
            </ul>

            {/* Verification Protocol */}
            <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Our Verification Standards</h4>
                <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-brand-emerald font-bold text-xs mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Hand-Tested
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">Coupon codes tested at {storeName} checkout</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-brand-indigo font-bold text-xs mb-0.5 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">Zero fee or registration required to use coupons</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
