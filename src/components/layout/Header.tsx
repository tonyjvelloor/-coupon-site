"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBox } from "@/components/ui/SearchBox";
import { X, Search } from "lucide-react";

export default function Header() {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 w-full sticky top-0 z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 transition-colors duration-300 shadow-sm">
            {isMobileSearchOpen ? (
                <div className="flex items-center gap-3 w-full animate-fade-in">
                    <SearchBox 
                        placeholder="Search stores or categories..." 
                        className="flex-1" 
                        onSelectSuggestion={() => setIsMobileSearchOpen(false)}
                    />
                    <button 
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-4 md:gap-8">
                        <span className="hidden material-symbols-outlined text-brand-indigo cursor-pointer" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            menu
                        </span>
                        
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-brand-indigo/30">
                                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                            </div>
                            <span className="font-display-sm md:font-display-sm font-bold tracking-tight">
                                <span className="text-brand-indigo">coupon</span>
                                <span className="text-slate-900 dark:text-white">hub</span>
                            </span>
                        </Link>
                        
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/deals" className="text-slate-700 dark:text-slate-200 font-bold font-body-lg text-sm transition-all hover:text-brand-indigo dark:hover:text-brand-indigo">
                                Deals
                            </Link>
                            <Link href="/stores" className="text-slate-700 dark:text-slate-200 font-bold font-body-lg text-sm transition-all hover:text-brand-indigo dark:hover:text-brand-indigo">
                                Stores
                            </Link>
                            <Link href="/cashback" className="text-slate-700 dark:text-slate-200 font-bold font-body-lg text-sm transition-all hover:text-brand-indigo dark:hover:text-brand-indigo">
                                Cashback
                            </Link>
                            <Link href="/best-offers" className="text-slate-700 dark:text-slate-200 font-bold font-body-lg text-sm transition-all hover:text-brand-indigo dark:hover:text-brand-indigo">
                                Best Offers
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:block w-64">
                            <SearchBox placeholder="Search stores..." />
                        </div>
                        
                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 md:hidden shrink-0"
                        >
                            <Search className="w-6 h-6 text-brand-indigo" />
                        </button>
                        
                        <ThemeToggle />
                        
                        <button className="hidden sm:block bg-brand-indigo text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-indigo/90 transition-all active:scale-95 shadow-premium-sm">
                            Log In
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}
