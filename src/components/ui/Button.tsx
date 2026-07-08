import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        const baseClass = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
        
        const variants = {
            primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-surface hover:shadow-raised focus-visible:outline-primary-500",
            secondary: "bg-surface-100 text-surface-900 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-50 dark:hover:bg-surface-700 focus-visible:outline-surface-400",
            outline: "border-2 border-surface-200 bg-transparent hover:bg-surface-50 text-surface-900 dark:border-surface-700 dark:hover:bg-surface-800 dark:text-surface-50 focus-visible:outline-surface-400",
            ghost: "bg-transparent hover:bg-surface-50 text-surface-700 dark:hover:bg-surface-800 dark:text-surface-300 focus-visible:outline-surface-400",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        };

        const widthClass = fullWidth ? "w-full" : "";

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
