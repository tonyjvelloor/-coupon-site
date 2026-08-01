import React from 'react';
import { ShieldCheck, Wallet, Clock } from 'lucide-react';

/**
 * Ensures consistent visual language across all cards and UI elements.
 * 
 * Savings = Large Emerald Bold
 * Verified = Blue Badge
 * Cashback = Green Pill
 * Expiring = Amber
 */

export function SavingsBadge({ value, className = "" }: { value: string, className?: string }) {
    const displayValue = /^\d+$/.test(value) 
        ? (Number(value) <= 100 ? `SAVE ${value}%` : `SAVE ₹${value}`)
        : (value.toUpperCase().startsWith('SAVE') ? value : `SAVE ${value}`);

    return (
        <div className={`text-display-l text-brand-emerald font-display font-bold uppercase tracking-tight leading-none ${className}`}>
            {displayValue}
        </div>
    );
}

export function VerifiedBadge({ className = "" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1 bg-brand-indigo/10 text-brand-indigo px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${className}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
        </div>
    );
}

export function CashbackPill({ value, className = "" }: { value: string, className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1 text-[11px] font-bold text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded-full ${className}`}>
            <Wallet className="w-3.5 h-3.5" />
            {value}
        </div>
    );
}

export function ExpiringTag({ className = "" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ${className}`}>
            <Clock className="w-3.5 h-3.5" />
            Expiring Soon
        </div>
    );
}
