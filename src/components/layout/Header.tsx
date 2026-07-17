"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBox } from "@/components/ui/SearchBox";
import { X, Search } from "lucide-react";

export default function Header() {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="bg-surface dark:bg-on-background w-full sticky top-0 z-50 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 transition-colors duration-300">
            {isMobileSearchOpen ? (
                <div className="flex items-center gap-3 w-full animate-fade-in">
                    <SearchBox 
                        placeholder="Search stores or categories..." 
                        className="flex-1" 
                        onSelectSuggestion={() => setIsMobileSearchOpen(false)}
                    />
                    <button 
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-on-background/10 text-slate-500 dark:text-white shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-4 md:gap-8">
                        <span className="material-symbols-outlined text-primary cursor-pointer lg:hidden" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            menu
                        </span>
                        
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-brand-indigo/30">
                                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                            </div>
                            <span className="font-headline-lg-mobile md:font-headline-lg text-brand-indigo font-bold tracking-tight">
                                couponhub
                            </span>
                        </Link>
                        
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/deals" className="text-on-surface dark:text-white font-bold font-title-md text-title-md transition-all hover:text-brand-indigo dark:hover:text-primary">
                                Deals
                            </Link>
                            <Link href="/stores" className="text-on-surface dark:text-white font-bold font-title-md text-title-md transition-all hover:text-brand-indigo dark:hover:text-primary">
                                Stores
                            </Link>
                            <Link href="/cashback" className="text-on-surface dark:text-white font-bold font-title-md text-title-md transition-all hover:text-brand-indigo dark:hover:text-primary">
                                Cashback
                            </Link>
                            <Link href="/coupons" className="text-on-surface dark:text-white font-bold font-title-md text-title-md transition-all hover:text-brand-indigo dark:hover:text-primary">
                                Coupons
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:block w-64">
                            <SearchBox placeholder="Search stores..." />
                        </div>
                        
                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-on-background/10 text-slate-500 dark:text-white md:hidden shrink-0"
                        >
                            <Search className="w-6 h-6 text-primary" />
                        </button>
                        
                        <ThemeToggle />
                        
                        <button className="hidden sm:block bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md hover:bg-brand-indigo transition-all active:scale-95">
                            Log In
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}
