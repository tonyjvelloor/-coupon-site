import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from './Card';
import { Icon } from './Icon';

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
                return { icon: 'payments', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
            case 'bank':
                return { icon: 'credit_card', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' };
            case 'student':
                return { icon: 'school', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' };
            case 'reward':
                return { icon: 'stars', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' };
            default:
                return { icon: 'savings', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
        }
    };
    
    const config = getTypeConfig();

    return (
        <Card interactive className={`h-full border-surface-200 dark:border-surface-800 hover:border-primary dark:hover:border-primary transition-colors duration-300 ${className}`}>
            <Link href={`/stores/${savings.storeSlug}`} className="flex flex-col h-full group p-4 sm:p-5">
                
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {savings.logo ? (
                            <Image
                                src={savings.logo}
                                alt={savings.storeName}
                                width={48}
                                height={48}
                                className="object-contain p-1"
                                loading="lazy"
                            />
                        ) : (
                            <span className="font-bold text-xl text-surface-400 dark:text-surface-500">{savings.storeName.charAt(0)}</span>
                        )}
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}>
                        <Icon name={config.icon} className="text-[18px]" />
                    </div>
                </div>
                
                <div className="mt-auto">
                    <h3 className="font-bold text-slate-900 dark:text-surface-100 text-sm mb-1">{savings.storeName}</h3>
                    <div className="flex items-baseline gap-1.5">
                        <span className={`font-headline-md font-bold text-2xl ${config.color}`}>
                            {savings.value}
                        </span>
                        {savings.label && (
                            <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                                {savings.label}
                            </span>
                        )}
                    </div>
                </div>

            </Link>
        </Card>
    );
}
