import React from 'react';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col';
    gap?: 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: boolean;
    children: React.ReactNode;
}

export function Stack({ 
    direction = 'col',
    gap = 16,
    align = 'stretch',
    justify = 'start',
    wrap = false,
    className = '',
    children,
    ...props
}: StackProps) {
    
    const dirClass = direction === 'col' ? 'flex-col' : 'flex-row';
    const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';
    
    const gapMap: Record<number, string> = {
        4: 'gap-4', 8: 'gap-8', 12: 'gap-12', 16: 'gap-16', 
        24: 'gap-24', 32: 'gap-32', 48: 'gap-48', 64: 'gap-64', 96: 'gap-96'
    };
    const gapClass = gapMap[gap] || 'gap-16';

    const alignMap = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch'
    };
    
    const justifyMap = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around'
    };

    return (
        <div 
            className={`flex ${dirClass} ${wrapClass} ${gapClass} ${alignMap[align]} ${justifyMap[justify]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
