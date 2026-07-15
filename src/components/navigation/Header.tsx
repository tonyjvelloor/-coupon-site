"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';
import { ThemeToggle } from '../ui/ThemeToggle';
import { MobileNav } from './MobileNav';
import { GlobalSearch } from '../ui/GlobalSearch';

export interface Category {
    id: string;
    name: string;
    slug: string;
}

/**
 * The Commerce Intelligence Header
 * Treats Search as the primary navigation system.
 */
export function Header({ categories = [] }: { categories?: Category[] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 transition-colors duration-300">
            {/* Top Bar - Intelligence Signal */}
            <div className="bg-primary text-white py-1.5 text-center text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                <span className="flex items-center justify-center gap-1.5">
                    <Icon name="verified" className="text-[14px]" variant="fill" />
                    Over 250,000 verified offers updated today
                </span>
            </div>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 gap-4 md:gap-8">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <Icon name="local_activity" className="text-white text-[24px]" variant="fill" />
                        </div>
                        <span className="text-xl sm:text-2xl font-headline-lg font-bold text-on-surface tracking-tight hidden sm:block">CouponHub</span>
                    </Link>

                    {/* Primary Search System (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-2xl relative">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center gap-3 pl-4 pr-4 py-3 rounded-full bg-surface-100 dark:bg-surface-800 border-2 border-transparent hover:border-primary/50 transition-all text-sm text-on-surface-variant font-medium shadow-inner"
                        >
                            <Icon name="search" className="text-[20px]" />
                            <span>Search merchants, categories, or specific deals...</span>
                            <span className="ml-auto text-[10px] bg-white dark:bg-surface-900 px-2 py-0.5 rounded-md border border-surface-200 dark:border-surface-700">⌘K</span>
                        </button>
                    </div>

                    {/* Desktop Navigation & Actions */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-on-surface-variant uppercase tracking-wide">
                        <Link href="/stores" className="hover:text-primary transition-colors flex items-center gap-1">
                            <Icon name="storefront" className="text-[16px]" /> Stores
                        </Link>
                        <div className="relative group cursor-pointer py-4">
                            <span className="flex items-center gap-1 hover:text-primary transition-colors">
                                <Icon name="category" className="text-[16px]" /> Categories <Icon name="expand_more" className="text-[16px]" />
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 py-3 w-56 flex flex-col gap-1 px-2">
                                    {categories.slice(0, 5).map(c => (
                                        <Link key={c.id} href={`/category/${c.slug}`} className="block px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors font-semibold normal-case tracking-normal text-on-surface">
                                            {c.name}
                                        </Link>
                                    ))}
                                    <div className="border-t border-surface-100 dark:border-surface-700 mt-2 pt-2 px-1">
                                        <Link href="/categories" className="block px-2 py-2 text-primary font-bold normal-case tracking-normal hover:underline">All Categories &rarr;</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/knowledge" className="flex items-center gap-1 text-urgency-orange hover:text-orange-700 transition-colors">
                            <Icon name="menu_book" className="text-[16px]" /> Guides
                        </Link>
                    </nav>

                    {/* Mobile Actions & Theme */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                            className="md:hidden w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-on-surface hover:bg-surface-200 transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Icon name="search" className="text-[20px]" />
                        </button>
                        <ThemeToggle />
                        <button 
                            className="lg:hidden w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-on-surface hover:bg-surface-200 transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Icon name="menu" className="text-[20px]" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar Expansion */}
                {mobileSearchOpen && (
                    <div className="md:hidden py-4 border-t border-surface-200 dark:border-surface-800 animate-slideDown">
                        <div className="relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                            <input
                                type="text"
                                placeholder="Search merchants..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-100 dark:bg-surface-800 border-none outline-none font-medium focus:ring-2 focus:ring-primary shadow-inner"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>

            <MobileNav 
                isOpen={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
                categories={categories}
            />
            {/* Global Search Modal */}
            <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    );
}
