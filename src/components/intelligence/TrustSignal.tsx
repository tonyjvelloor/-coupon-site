import React from 'react';
import { Icon } from '../ui/Icon';

export type SignalType = 
    | 'verified' 
    | 'recently_checked' 
    | 'trending' 
    | 'high_confidence' 
    | 'exclusive' 
    | 'cashback' 
    | 'new' 
    | 'limited_time';

export interface TrustSignalProps {
    type: SignalType;
    label?: string;
    className?: string;
}

export function TrustSignal({ type, label, className = '' }: TrustSignalProps) {
    const signalConfig: Record<SignalType, { icon: string; defaultLabel: string; styleClass: string }> = {
        verified: { icon: 'verified', defaultLabel: 'Verified', styleClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        recently_checked: { icon: 'update', defaultLabel: 'Recently Checked', styleClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        trending: { icon: 'trending_up', defaultLabel: 'Trending', styleClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
        high_confidence: { icon: 'task_alt', defaultLabel: 'High Confidence', styleClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
        exclusive: { icon: 'stars', defaultLabel: 'Exclusive', styleClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
        cashback: { icon: 'payments', defaultLabel: 'Cashback', styleClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
        new: { icon: 'fiber_new', defaultLabel: 'New', styleClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
        limited_time: { icon: 'timer', defaultLabel: 'Limited Time', styleClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    };

    const config = signalConfig[type];

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.styleClass} ${className}`}>
            <Icon name={config.icon} className="text-[14px]" variant="fill" />
            {label || config.defaultLabel}
        </span>
    );
}
