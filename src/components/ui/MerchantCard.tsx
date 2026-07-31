import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, TrendingUp, Users } from 'lucide-react';

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
        rating?: number;
        bestSavings?: string;
    };
    className?: string;
    priority?: boolean;
}

export function MerchantCard({ store, className = "", priority = false }: MerchantCardProps) {
    return (
        <Link 
            href={`/stores/${store.slug}`} 
            className={`group relative bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col cursor-pointer h-full hover:border-brand-indigo/30 dark:hover:border-brand-indigo/50 shadow-premium-sm hover:shadow-premium-md transition-all duration-300 active:scale-[0.98] ${className}`}
        >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-16 h-16 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden relative shadow-sm">
                    {store.logo && store.logo.trim() !== '' ? (
                        <Image
                            src={store.logo}
                            alt={store.name}
                            fill
                            className="object-contain p-2"
                            loading={priority ? undefined : "lazy"}
                            priority={priority}
                        />
                    ) : (
                        <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 uppercase font-display-sm">
                            {store.name.charAt(0)}
                        </span>
                    )}
                </div>
                
                <div className="bg-brand-indigo/10 text-brand-indigo px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {store.offerCount} Active
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-indigo transition-colors relative z-10">
                {store.name}
            </h3>
            
            <div className="flex items-center gap-1.5 text-brand-emerald font-bold mb-5 relative z-10">
                <TrendingUp className="w-4 h-4" />
                <span>{store.bestSavings || "Up to 80% Off"}</span>
            </div>
            
            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
                <div className="flex -space-x-2">
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0F172A]" src="https://i.pravatar.cc/100?img=1"/>
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0F172A]" src="https://i.pravatar.cc/100?img=2"/>
                    <img alt="User" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0F172A]" src="https://i.pravatar.cc/100?img=3"/>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>4k+ saved</span>
                </div>
            </div>
        </Link>
    );
}
