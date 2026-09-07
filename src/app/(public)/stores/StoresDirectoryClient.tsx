'use client';

import React, { useState, useMemo } from 'react';
import StoreCard from "@/components/ui/StoreCard";

interface StoreData {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    cashbackRate: string | null;
    offerCount: number;
    description?: string | null;
    primaryCategory?: string;
    isFeatured: boolean;
}

interface CategoryData {
    id: string;
    name: string;
    slug: string;
}

interface StoresDirectoryClientProps {
    stores: StoreData[];
    categories: CategoryData[];
}

export default function StoresDirectoryClient({ stores, categories }: StoresDirectoryClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredStores = useMemo(() => {
        return stores.filter((store) => {
            const matchesQuery = store.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || store.primaryCategory?.toLowerCase() === selectedCategory.toLowerCase();
            return matchesQuery && matchesCategory;
        });
    }, [stores, searchQuery, selectedCategory]);

    const trendingStores = useMemo(() => {
        return stores.filter(s => s.isFeatured).slice(0, 8);
    }, [stores]);

    const storesByLetter = useMemo(() => {
        const groups: Record<string, StoreData[]> = {};
        
        filteredStores.forEach((store) => {
            let letter = store.name.charAt(0).toUpperCase();
            if (!/[A-Z]/.test(letter)) {
                letter = '#';
            }
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(store);
        });

        // Optional: We can group adjacent letters like the mock (C-D, etc.) but for simplicity and scale, A-Z is better.
        return groups;
    }, [filteredStores]);

    const letters = Object.keys(storesByLetter).sort();

    const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, letter: string) => {
        e.preventDefault();
        const el = document.getElementById(`section-${letter}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            {/* Page Header & Intelligent Search Hero */}
            <section className="w-full bg-surface-card py-space-2xl shadow-sm">
                <div className="max-w-max-width mx-auto px-gutter-desktop">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-brand-indigo-light text-primary px-space-sm py-1 rounded-full font-label-badge text-label-badge mb-space-sm">
                            <span className="material-symbols-outlined text-[15px]">storefront</span>
                            INDIA'S BIGGEST SAVINGS ECOSYSTEM
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs tracking-tight">
                            Explore All {stores.length}+ Verified Partner Stores &amp; Cashback Offers
                        </h1>
                        <p className="font-body-lg text-body-lg text-text-muted mb-space-xl">
                            Browse India's top shopping destinations. Get tested coupon codes, exclusive cashback up to 25%, and glitch deals updated every morning by our deal curation team.
                        </p>
                    </div>

                    {/* Search Box with Live Count Counter */}
                    <div className="bg-surface-page p-space-md rounded-2xl shadow-sm mb-space-lg">
                        <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                            <div className="relative flex-1 w-full flex items-center bg-surface-card rounded-xl px-space-md py-space-sm shadow-sm">
                                <span className="material-symbols-outlined text-outline text-[24px] mr-space-xs">search</span>
                                <input 
                                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none" 
                                    placeholder={`Search among ${stores.length}+ stores like AJIO, Amazon, Swiggy, Croma...`} 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        className="text-text-muted hover:text-on-surface p-1" 
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                )}
                            </div>
                            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-space-sm px-space-xs">
                                <span className="font-label-btn text-label-btn bg-surface-container text-on-surface px-space-md py-space-sm rounded-xl">
                                    Showing <strong className="text-primary font-bold">{filteredStores.length}</strong> Stores
                                </span>
                            </div>
                        </div>

                        {/* Filter Tags / Categories */}
                        <div className="flex items-center gap-space-xs overflow-x-auto pt-space-md pb-space-2xs no-scrollbar">
                            <span className="font-label-badge text-label-badge text-text-muted whitespace-nowrap mr-1">FILTER BY:</span>
                            
                            <button 
                                onClick={() => setSelectedCategory('all')}
                                className={`font-label-badge text-label-badge px-space-md py-1.5 rounded-full whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-on-surface text-on-primary shadow-sm' : 'bg-surface-card text-on-surface-variant hover:bg-surface-container-high'}`}
                            >
                                All Stores ({stores.length})
                            </button>

                            {categories.map(cat => {
                                const catCount = stores.filter(s => s.primaryCategory?.toLowerCase() === cat.name.toLowerCase()).length;
                                if (catCount === 0) return null;
                                
                                const isSelected = selectedCategory === cat.name;
                                return (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`font-label-badge text-label-badge px-space-md py-1.5 rounded-full whitespace-nowrap transition-all ${isSelected ? 'bg-on-surface text-on-primary shadow-sm' : 'bg-surface-card text-on-surface-variant hover:bg-surface-container-high'}`}
                                    >
                                        {cat.name} ({catCount})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured / Trending Stores Grid (Only show if not searching/filtering heavily) */}
            {trendingStores.length > 0 && selectedCategory === 'all' && searchQuery.trim() === '' && (
                <section className="w-full py-space-2xl bg-surface-page">
                    <div className="max-w-max-width mx-auto px-gutter-desktop">
                        <div className="flex items-end justify-between mb-space-lg">
                            <div>
                                <div className="flex items-center gap-space-2xs text-hot-coral font-label-badge text-label-badge mb-1">
                                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                                    HIGH DEMAND SAVINGS
                                </div>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending Partner Merchants</h2>
                            </div>
                            <span className="text-body-sm font-body-sm text-text-muted hidden sm:inline-block">Instant codes, cashback &amp; auto-apply coupons</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                            {trendingStores.map(store => (
                                <StoreCard key={store.id} store={store} variant="trending" />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sticky Alphabetical A-Z Jump Bar */}
            <aside className="sticky top-20 z-40 bg-surface-card/95 backdrop-blur-md shadow-sm py-space-xs">
                <div className="max-w-max-width mx-auto px-gutter-desktop">
                    <div className="flex items-center justify-between gap-space-xs overflow-x-auto no-scrollbar py-1">
                        <span className="font-label-badge text-label-badge text-text-muted uppercase tracking-wider hidden lg:inline mr-2">Jump To:</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-between">
                            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => {
                                const hasStores = Boolean(storesByLetter[letter]);
                                return (
                                    <a 
                                        key={letter}
                                        href={`#section-${letter}`}
                                        onClick={(e) => smoothScroll(e, letter)}
                                        className={`font-label-badge text-label-badge w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold transition-all
                                            ${hasStores 
                                                ? 'bg-surface-container-low text-on-surface hover:bg-primary-container hover:text-on-primary cursor-pointer' 
                                                : 'bg-transparent text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        {letter}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Complete A-Z Directory Catalog */}
            <section className="w-full py-space-2xl bg-surface-page min-h-[50vh]">
                <div className="max-w-max-width mx-auto px-gutter-desktop space-y-space-2xl">
                    
                    {filteredStores.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-[48px] text-surface-300 dark:text-surface-600 mb-4 block">search_off</span>
                            <h3 className="text-xl font-semibold text-on-surface mb-2">No stores found</h3>
                            <p className="text-text-muted">Try adjusting your search or category filter.</p>
                        </div>
                    ) : (
                        letters.map(letter => (
                            <div key={letter} id={`section-${letter}`} className="scroll-mt-36">
                                <div className="flex items-center gap-space-sm mb-space-md">
                                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md font-extrabold shadow-sm">
                                        {letter}
                                    </div>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">Stores starting with "{letter}"</h2>
                                    <span className="font-label-badge text-label-badge bg-surface-container-high text-on-surface-variant px-2.5 py-0.5 rounded-full">
                                        {storesByLetter[letter].length} Store{storesByLetter[letter].length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                                    {storesByLetter[letter].map(store => (
                                        <StoreCard key={store.id} store={store} variant="directory" />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                    
                </div>
            </section>
        </>
    );
}
