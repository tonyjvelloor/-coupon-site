import React from 'react';
import { Surface, SurfaceProps } from './Surface';

export interface CardProps extends SurfaceProps {
    interactive?: boolean;
}

export function Card({ interactive = false, className = '', children, ...props }: CardProps) {
    const interactiveClass = interactive ? 'hover:shadow-raised cursor-pointer transition-all duration-normal hover:-translate-y-0.5' : '';
    
    return (
        <Surface className={`overflow-hidden flex flex-col ${interactiveClass} ${className}`} {...props}>
            {children}
        </Surface>
    );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-6 py-4 border-b border-surface-100 dark:border-surface-800 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`p-6 flex-grow ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-6 py-4 bg-surface-50 dark:bg-surface-950 border-t border-surface-100 dark:border-surface-800 ${className}`} {...props}>
            {children}
        </div>
    );
}
