import React from 'react';
import { Icon } from './Icon';

export interface IntelligenceMetricProps {
    icon: string;
    label: string;
    value: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    freshness?: string;
    className?: string;
    variant?: 'default' | 'dense' | 'hero';
}

/**
 * The mandatory visual primitive for all data points.
 * Optimizes for Decision Density.
 */
export function IntelligenceMetric({ 
    icon, 
    label, 
    value, 
    trend,
    trendValue,
    freshness,
    variant = 'default',
    className = '',
}: IntelligenceMetricProps) {
    const renderTrendIcon = () => {
        if (!trend) return null;
        if (trend === 'up') return <Icon name="trending_up" className="text-success-600 dark:text-success-500" />;
        if (trend === 'down') return <Icon name="warning" className="text-warning-600 dark:text-warning-500" />;
        return <Icon name="trending_flat" className="text-surface-500" />;
    };

    if (variant === 'hero') {
        return (
            <div className={`flex flex-col gap-1 p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 ${className}`}>
                <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-1">
                    <Icon name={icon} className="text-[16px]" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                </div>
                
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-merchant-900 dark:text-merchant-50">{value}</span>
                    {trend && (
                        <div className="flex items-center gap-1">
                            {renderTrendIcon()}
                            {trendValue && <span className="text-xs font-medium text-surface-600 dark:text-surface-300">{trendValue}</span>}
                        </div>
                    )}
                </div>
                
                {freshness && (
                    <div className="flex items-center gap-1 mt-1 opacity-80">
                        <Icon name="history" className="text-[12px] text-surface-400" />
                        <span className="text-[11px] font-medium text-surface-500 dark:text-surface-400">{freshness}</span>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'dense') {
        return (
            <div className={`flex items-center justify-between gap-4 py-2 border-b border-surface-100 dark:border-surface-800 last:border-0 ${className}`}>
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                    <Icon name={icon} className="text-[16px]" />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-merchant-900 dark:text-merchant-50">{value}</span>
                    {freshness && <span className="text-[10px] text-surface-400 mt-0.5">{freshness}</span>}
                </div>
            </div>
        );
    }

    // Default 
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg bg-surface-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 shadow-surface ${className}`}>
            <div className="w-10 h-10 rounded-full bg-intelligence-50 dark:bg-intelligence-900/30 flex items-center justify-center text-intelligence-600 dark:text-intelligence-400 shrink-0">
                <Icon name={icon} className="text-[20px]" />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold text-merchant-900 dark:text-merchant-50 leading-tight">{value}</span>
                <span className="text-xs text-surface-500 uppercase tracking-wide font-semibold mt-0.5">{label}</span>
            </div>
        </div>
    );
}
