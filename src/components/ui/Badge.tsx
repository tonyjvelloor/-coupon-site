import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'verified' | 'intelligence' | 'urgency';
    children: React.ReactNode;
}

export function Badge({ 
    variant = 'default',
    className = '',
    children,
    ...props 
}: BadgeProps) {
    const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap";
    
    const variants = {
        default: "bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200",
        success: "bg-success-light text-success-dark dark:bg-success-dark dark:text-success-light",
        warning: "bg-warning-light text-warning-dark dark:bg-warning-dark dark:text-warning-light",
        error: "bg-error-light text-error-dark dark:bg-error-dark dark:text-error-light",
        verified: "bg-verified-light text-verified-dark dark:bg-verified-dark dark:text-verified-light",
        intelligence: "bg-intelligence-light text-intelligence-dark dark:bg-intelligence-dark dark:text-intelligence-light",
        urgency: "bg-urgency-light text-urgency-dark dark:bg-urgency-dark dark:text-urgency-light",
    };

    return (
        <span className={`${baseClass} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
}
