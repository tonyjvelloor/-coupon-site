import React from 'react';

export function Container({ 
    children, 
    className = '',
    as: Component = 'div'
}: { 
    children: React.ReactNode, 
    className?: string,
    as?: any
}) {
    return (
        <Component className={`max-w-7xl mx-auto px-4 lg:px-8 w-full ${className}`}>
            {children}
        </Component>
    );
}
