import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface SavingsCardProps {
    savings: {
        id: string;
        storeName: string;
        storeSlug: string;
        logo: string | null;
        value: string;
        type: 'cashback' | 'bank' | 'student' | 'reward';
        label?: string;
    };
    className?: string;
}

export function SavingsCard({ savings, className = "" }: SavingsCardProps) {
    
    const getTypeConfig = () => {
        switch(savings.type) {
            case 'cashback':
                return { icon: 'payments', color: 'text-success-green' };
            case 'bank':
                return { icon: 'credit_card', color: 'text-primary' };
            case 'student':
                return { icon: 'school', color: 'text-brand-indigo' };
            case 'reward':
                return { icon: 'stars', color: 'text-brand-coral' };
            default:
                return { icon: 'savings', color: 'text-success-green' };
        }
    };
    
    const config = getTypeConfig();

    return (
        <Link 
            href={`/stores/${savings.storeSlug}`} 
            className={`premium-card bg-surface-white dark:bg-inverse-surface rounded-2xl border border-surface-variant/20 p-6 flex flex-col group cursor-pointer h-full ${className}`}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-xl border border-surface-variant/20 p-2 bg-white flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative">
                    {savings.logo ? (
                        <Image
                            src={savings.logo}
                            alt={savings.storeName}
                            fill
                            className="object-contain p-2"
                            loading="lazy"
                        />
                    ) : (
                        <span className="font-bold text-xl text-surface-400">{savings.storeName.charAt(0)}</span>
                    )}
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface-variant/10 ${config.color}`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        {config.icon}
                    </span>
                </div>
            </div>
            
            <div className="mt-auto">
                <h3 className="font-title-md font-bold text-on-surface dark:text-white mb-1 group-hover:text-primary transition-colors">{savings.storeName}</h3>
                <div className="flex items-baseline gap-1.5">
                    <span className={`font-display-sm font-bold text-2xl ${config.color}`}>
                        {savings.value}
                    </span>
                    {savings.label && (
                        <span className="font-label-md text-label-sm text-on-surface-variant dark:text-surface-variant uppercase tracking-wider">
                            {savings.label}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
