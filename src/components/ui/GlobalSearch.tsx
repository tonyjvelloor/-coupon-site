"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ stores: any[], coupons: any[] }>({ stores: [], coupons: [] });
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Flat list of selectable items for keyboard navigation
    const getSelectableItems = () => {
        if (!query.trim()) {
            return ['Amazon', 'Flipkart', 'Myntra', 'Electronics', 'Fashion', 'Cashback'].map(t => ({ type: 'trending', value: t }));
        }
        const items: any[] = [];
        results.stores.forEach(s => items.push({ type: 'store', data: s }));
        results.coupons.forEach(c => items.push({ type: 'coupon', data: c }));
        return items;
    };

    const selectableItems = getSelectableItems();

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults({ stores: [], coupons: [] });
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim() || query.length < 2) {
                setResults({ stores: [], coupons: [] });
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setSelectedIndex(0);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 200); // 200ms debounce
        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % selectableItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + selectableItems.length) % selectableItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                
                if (selectableItems.length > 0 && selectedIndex >= 0) {
                    const item = selectableItems[selectedIndex];
                    handleSelect(item);
                } else if (query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, selectableItems, query, router, onClose]);

    const handleSelect = (item: any) => {
        console.log("Analytics: onSearchResultClicked", { type: item.type, item });
        if (item.type === 'trending') {
            router.push(`/search?q=${encodeURIComponent(item.value)}`);
        } else if (item.type === 'store') {
            router.push(`/stores/${item.data.slug}`);
        } else if (item.type === 'coupon') {
            // Navigate to the store page with the coupon highlighted, or just to the store page
            router.push(`/stores/${item.data.store.name.toLowerCase().replace(/\s+/g, '-')}#deal-${item.data.id}`);
        }
        onClose();
    };

    if (!isOpen) return null;

    let globalItemIndex = 0; // To track index across different sections

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4 sm:pt-24">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden animate-slideDown flex flex-col max-h-[80vh]">
                
                {/* Search Input Area */}
                <div className="flex items-center px-4 py-4 border-b border-surface-200 dark:border-surface-800 shrink-0">
                    <Icon name="search" className={`text-[24px] transition-colors ${loading ? 'text-primary animate-pulse' : 'text-surface-400'}`} />
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search merchants, deals, or categories..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-lg text-slate-900 dark:text-white outline-none placeholder:text-surface-400 font-medium"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="p-1 text-surface-400 hover:text-slate-900 dark:hover:text-white transition mr-2">
                            <Icon name="close" className="text-[20px]" />
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="px-2 py-1 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-[10px] font-bold text-surface-500 rounded hover:bg-surface-200 dark:hover:bg-surface-700 transition">ESC</button>
                </div>

                {/* Results Area */}
                <div className="overflow-y-auto flex-1 p-2">
                    
                    {!query.trim() && (
                        <div className="p-2">
                            <div className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3 px-2">Trending Searches</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {selectableItems.map((item, idx) => (
                                    <button 
                                        key={idx}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        onClick={() => handleSelect(item)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                                            selectedIndex === idx 
                                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                                                : 'bg-transparent text-slate-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                                        }`}
                                    >
                                        <Icon name="trending_up" className="text-[16px] opacity-50" />
                                        {item.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query.trim() && !loading && selectableItems.length === 0 && (
                        <div className="p-12 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
                                <Icon name="search_off" className="text-3xl text-surface-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No results found for "{query}"</h3>
                            <p className="text-sm text-surface-500 mb-6 max-w-sm">We couldn't find any stores or coupons matching your search. Try checking your spelling or explore our directory.</p>
                            <Link href="/stores" onClick={onClose} className="px-6 py-2.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors text-sm border border-surface-200 dark:border-surface-700">
                                Browse All Stores
                            </Link>
                        </div>
                    )}

                    {results.stores.length > 0 && (
                        <div className="mb-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-2 px-3 pt-2">Stores</div>
                            <div className="space-y-1">
                                {results.stores.map((store) => {
                                    const currentIndex = globalItemIndex++;
                                    const isSelected = selectedIndex === currentIndex;
                                    
                                    return (
                                        <button
                                            key={`store-${store.id}`}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            onClick={() => handleSelect({ type: 'store', data: store })}
                                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${
                                                isSelected ? 'bg-primary text-white' : 'hover:bg-surface-50 dark:hover:bg-surface-800 bg-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : 'bg-surface-100 dark:bg-surface-800'}`}>
                                                    {store.logo ? (
                                                        <Image src={store.logo} alt={store.name} width={24} height={24} className="object-contain" />
                                                    ) : (
                                                        <Icon name="storefront" className="text-[18px]" />
                                                    )}
                                                </div>
                                                <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{store.name}</span>
                                            </div>
                                            <Icon name="arrow_forward" className={`text-[16px] ${isSelected ? 'opacity-100' : 'opacity-0 text-surface-400'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {results.coupons.length > 0 && (
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-2 px-3 pt-2">Active Deals</div>
                            <div className="space-y-1">
                                {results.coupons.map((coupon) => {
                                    const currentIndex = globalItemIndex++;
                                    const isSelected = selectedIndex === currentIndex;
                                    
                                    return (
                                        <button
                                            key={`coupon-${coupon.id}`}
                                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                                            onClick={() => handleSelect({ type: 'coupon', data: coupon })}
                                            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors text-left ${
                                                isSelected ? 'bg-surface-100 dark:bg-surface-800' : 'hover:bg-surface-50 dark:hover:bg-surface-800/50 bg-transparent'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 flex flex-col items-center justify-center shrink-0">
                                                <span className="text-[9px] font-bold text-green-600 uppercase leading-none">SAVE</span>
                                                <Icon name="local_offer" className="text-green-500 text-[14px] mt-0.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-bold text-sm truncate ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                    {coupon.discountValue || coupon.title}
                                                </div>
                                                <div className="text-xs text-surface-500 truncate mt-0.5">
                                                    {coupon.store.name} • {coupon.code ? `Code: ${coupon.code}` : 'Deal activated'}
                                                </div>
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 ${isSelected ? 'text-primary border-primary/30' : 'text-surface-400'}`}>
                                                View Deal
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer instructions */}
                <div className="bg-surface-50 dark:bg-surface-800/50 px-4 py-3 border-t border-surface-200 dark:border-surface-800 flex items-center gap-4 text-xs font-medium text-surface-500 shrink-0">
                    <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded px-1.5 py-0.5 font-sans">↑↓</kbd> to navigate</span>
                    <span className="flex items-center gap-1"><kbd className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded px-1.5 py-0.5 font-sans">Enter</kbd> to select</span>
                </div>

            </div>
        </div>
    );
}
