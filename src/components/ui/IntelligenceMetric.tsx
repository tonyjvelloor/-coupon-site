import React from 'react';
import { Icon } from './Icon';

export type MetricLayout = 'vertical' | 'horizontal' | 'inline';

export interface IntelligenceMetricProps {
    icon: string;
    label: string;
    value: string | React.ReactNode;
    layout?: MetricLayout;
    className?: string;
    iconClassName?: string;
    valueClassName?: string;
    labelClassName?: string;
    iconVariant?: 'outline' | 'fill';
}

/**
 * Reusable component for exposing commerce intelligence metrics.
 * Follows the principle: "Beautiful empty cards don't create value."
 */
export function IntelligenceMetric({ 
    icon, 
    label, 
    value, 
    layout = 'horizontal',
    className = '',
    iconClassName = 'text-primary',
    valueClassName = 'text-on-surface',
    labelClassName = 'text-on-surface-variant',
    iconVariant = 'outline'
}: IntelligenceMetricProps) {
    
    if (layout === 'vertical') {
        // Large block layout (e.g. Hero stats)
        return (
            <div className={`flex flex-col items-center justify-center text-center ${className}`}>
                <div className={`text-2xl font-bold font-headline-md ${valueClassName}`}>
                    {value}
                </div>
                <div className={`text-body-sm font-body-sm flex items-center gap-1 mt-1 ${labelClassName}`}>
                    <Icon name={icon} className={`text-[16px] ${iconClassName}`} variant={iconVariant} />
                    {label}
                </div>
            </div>
        );
    }

    if (layout === 'inline') {
        // Very compact inline layout (e.g. inside a coupon card row)
        return (
            <div className={`flex items-center gap-1 text-[11px] ${className}`}>
                <Icon name={icon} className={`text-[14px] ${iconClassName}`} variant={iconVariant} />
                <span className={`font-medium ${valueClassName}`}>{value}</span>
                <span className={labelClassName}>{label}</span>
            </div>
        );
    }

    // Default horizontal layout (e.g. Merchant card details)
    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            <Icon name={icon} className={`text-[18px] ${iconClassName}`} variant={iconVariant} />
            <div className="flex flex-col">
                <span className={`font-bold leading-none ${valueClassName}`}>{value}</span>
                <span className={`text-[10px] uppercase tracking-wider mt-0.5 ${labelClassName}`}>{label}</span>
            </div>
        </div>
    );
}
