import React from 'react';

export type IconType = 'material' | 'lucide';
export type IconVariant = 'outline' | 'fill';

export interface IconProps {
    name: string;
    variant?: IconVariant;
    className?: string;
    type?: IconType;
}

/**
 * Primitive Icon component.
 * Abstracting this allows us to swap underlying icon libraries globally.
 */
export function Icon({ name, variant = 'outline', className = '', type = 'material' }: IconProps) {
    if (type === 'material') {
        const fillStyle = variant === 'fill' ? { fontVariationSettings: "'FILL' 1" } : undefined;
        return (
            <span 
                className={`material-symbols-outlined ${className}`} 
                style={fillStyle}
                aria-hidden="true"
            >
                {name}
            </span>
        );
    }
    
    // Future expansion: Support for mapping string names to Lucide components
    if (type === 'lucide') {
        console.warn('Lucide dynamic rendering by string name requires a map. Fallback to material.');
    }
    
    return null;
}
