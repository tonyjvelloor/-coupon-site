import React from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { Category } from './Header';

export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={onClose} 
            />
            
            {/* Drawer */}
            <div className="relative w-[85%] max-w-sm bg-white dark:bg-surface-900 h-full shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
                    <span className="text-lg font-headline-md font-bold">Navigation</span>
                    <button onClick={onClose} className="p-2 bg-surface-100 dark:bg-surface-800 rounded-full text-on-surface hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                        <Icon name="close" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 pb-6 border-b border-surface-100 dark:border-surface-800">
                        <div className="relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input 
                                type="text" 
                                placeholder="Search merchants..." 
                                className="w-full pl-12 pr-4 py-3 bg-surface-100 dark:bg-surface-800 rounded-xl outline-none font-medium focus:ring-2 focus:ring-primary" 
                            />
                        </div>
                    </div>

                    <nav className="p-4 flex flex-col gap-1 font-semibold text-sm">
                        <Link href="/stores" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                            <Icon name="storefront" className="text-primary" /> All Stores
                        </Link>
                        <Link href="/knowledge" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                            <Icon name="menu_book" className="text-urgency-orange" /> Buying Guides
                        </Link>
                        <Link href="/news" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                            <Icon name="local_activity" className="text-emerald-500" /> Platform Intelligence
                        </Link>
                        
                        <div className="mt-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-3">Top Categories</div>
                        {categories.slice(0, 6).map(c => (
                            <Link key={c.id} href={`/category/${c.slug}`} onClick={onClose} className="p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors flex items-center justify-between">
                                {c.name}
                                <Icon name="chevron_right" className="text-[16px] text-surface-300" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
