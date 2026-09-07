'use client';
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
    src: string | null | undefined;
    fallbackText?: string;
    fallbackClassName?: string;
}

export function SafeImage({ src, fallbackText, fallbackClassName, alt, ...props }: SafeImageProps) {
    const [hasError, setHasError] = useState(false);

    if (!src || src.trim() === '' || hasError) {
        return (
            <div className={`flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800 ${fallbackClassName || ''}`}>
                {fallbackText ? (
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase">
                        {fallbackText.charAt(0)}
                    </span>
                ) : (
                    <span className="material-symbols-outlined text-slate-300">image</span>
                )}
            </div>
        );
    }

    return (
        <Image
            {...props}
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
        />
    );
}
