import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from './Card';
import { Icon } from './Icon';

export interface MerchantCardProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate?: string | null;
        offerCount: number;
        verified?: boolean;
        lastVerified?: string;
        rating?: number; // Added rating
        bestSavings?: string; // Added best savings
    };
    className?: string;
    priority?: boolean;
}

export function MerchantCard({ store, className = "", priority = false }: MerchantCardProps) {
    const isVerified = store.verified !== false; 
    const rating = store.rating || 4.8;
    const bestSavings = store.bestSavings || "₹500";
    
    return (
        <Card interactive className={`h-full border-surface-200 dark:border-surface-800 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}>
            <Link href={`/stores/${store.slug}`} className="flex flex-col h-full group p-5">
                
                {/* Header: Logo and Title */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {store.logo ? (
                            <Image
                                src={store.logo}
                                alt={store.name}
                                width={48}
                                height={48}
                                className="object-contain p-1"
                                loading={priority ? undefined : "lazy"}
                                priority={priority}
                            />
                        ) : (
                            <span className="font-bold text-xl text-surface-400 dark:text-surface-500">{store.name.charAt(0)}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-center flex-grow">
                        <div className="flex items-center gap-1">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-surface-100 line-clamp-1">{store.name}</h3>
                            {isVerified && (
                                <Icon name="verified" className="text-verified shrink-0 text-[14px]" variant="fill" />
                            )}
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs mt-0.5">
                            <Icon name="star" variant="fill" className="text-[12px]" />
                            <Icon name="star" variant="fill" className="text-[12px]" />
                            <Icon name="star" variant="fill" className="text-[12px]" />
                            <Icon name="star" variant="fill" className="text-[12px]" />
                            <Icon name="star_half" variant="fill" className="text-[12px]" />
                            <span className="text-surface-500 font-medium ml-1">{rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Core Metrics */}
                <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                        <Icon name="sell" className="text-[14px]" />
                        <span className="font-bold text-slate-900 dark:text-white">{store.offerCount} Offers</span>
                        {store.cashbackRate && (
                            <>
                                <span className="text-surface-300 mx-1">•</span>
                                <span className="font-bold text-green-600 dark:text-green-400">{store.cashbackRate}</span>
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                        <Icon name="savings" className="text-[14px]" />
                        <span>Best Savings: <span className="font-bold text-slate-900 dark:text-white font-headline-sm">{bestSavings}</span></span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-500">
                        <Icon name="update" className="text-[12px]" />
                        <span>Updated {store.lastVerified || '5 mins ago'}</span>
                    </div>
                </div>

                {/* View Deals CTA */}
                <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-sm font-bold text-primary dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                    View Deals
                    <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                </div>

            </Link>
        </Card>
    );
}
