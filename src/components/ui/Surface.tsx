import React from 'react';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
    elevation?: 'surface' | 'raised' | 'floating' | 'overlay';
    variant?: 'default' | 'dim' | 'bright';
    children: React.ReactNode;
}

export function Surface({ 
    elevation = 'surface', 
    variant = 'default',
    className = '',
    children,
    ...props
}: SurfaceProps) {
    
    let bgClass = "bg-surface-white dark:bg-surface-900";
    if (variant === 'dim') bgClass = "bg-surface-50 dark:bg-surface-950";
    if (variant === 'bright') bgClass = "bg-white dark:bg-surface-800";
    
    const shadowClass = `shadow-${elevation}`;
    
    return (
        <div 
            className={`rounded-2xl border border-surface-200 dark:border-surface-800 ${bgClass} ${shadowClass} transition-shadow duration-normal ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
