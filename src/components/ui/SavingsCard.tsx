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
                return { icon: 'payments', color: 'text-emerald-600 dark:text-emerald-400' };
            case 'bank':
                return { icon: 'credit_card', color: 'text-indigo-600 dark:text-indigo-400' };
            case 'student':
                return { icon: 'school', color: 'text-violet-600 dark:text-violet-400' };
            case 'reward':
                return { icon: 'stars', color: 'text-orange-500 dark:text-orange-400' };
            default:
                return { icon: 'savings', color: 'text-emerald-600 dark:text-emerald-400' };
        }
    };

    const config = getTypeConfig();

    return (
        <Link
            href={`/stores/${savings.storeSlug}`}
            className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/60 p-5 flex flex-col group cursor-pointer h-full hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 ${className}`}
        >
            <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-lg border border-gray-100 dark:border-gray-700 p-2 bg-white flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative">
                    {savings.logo ? (
                        <Image
                            src={savings.logo}
                            alt={savings.storeName}
                            fill
                            className="object-contain p-2"
                            loading="lazy"
                        />
                    ) : (
                        <span className="font-bold text-xl text-gray-400">{savings.storeName.charAt(0)}</span>
                    )}
                </div>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${config.color}`}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        {config.icon}
                    </span>
                </div>
            </div>

            <div className="mt-auto">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{savings.storeName}</h3>
                <div className="flex items-baseline gap-1.5">
                    <span className={`font-bold text-xl ${config.color}`}>
                        {savings.value}
                    </span>
                    {savings.label && (
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            {savings.label}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
