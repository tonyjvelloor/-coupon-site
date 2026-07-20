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
            <div className="relative w-[85%] max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-lg font-headline-md font-bold">Navigation</span>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Icon name="close" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                id="mobile-search-input"
                                type="text" 
                                placeholder="Search merchants..." 
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl outline-none font-medium focus:ring-2 focus:ring-violet-600" 
                            />
                        </div>
                    </div>

                    <nav className="p-4 flex flex-col gap-1 font-semibold text-sm">
                        <Link href="/" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Icon name="home" className="text-gray-500" /> Home
                        </Link>
                        <button onClick={() => {
                            const searchInput = document.getElementById('mobile-search-input');
                            if (searchInput) searchInput.focus();
                        }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left w-full">
                            <Icon name="search" className="text-gray-500" /> Search
                        </button>
                        <Link href="/best-offers" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Icon name="local_fire_department" className="text-violet-600" /> Deals
                        </Link>
                        <Link href="/stores" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Icon name="storefront" className="text-gray-500" /> Stores
                        </Link>
                        <Link href="/saved" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Icon name="favorite" className="text-pink-500" /> Saved
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
