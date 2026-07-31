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
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-brand-indigo rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-brand-indigo/30">
                                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                            </div>
                            <span className="font-display-sm md:font-display-sm font-bold tracking-tight text-xl">
                                <span className="text-slate-900 dark:text-white">Coupon</span>
                                <span className="text-brand-indigo">Hub</span>
                            </span>
                        </Link>
                        
                        <nav className="hidden lg:flex items-center gap-12">
                            {[
                                { name: "Deals", href: "/deals" },
                                { name: "Stores", href: "/stores" },
                                { name: "Best Offers", href: "/best-offers" }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative text-slate-600 dark:text-slate-300 font-medium text-[15px] transition-colors hover:text-brand-indigo dark:hover:text-brand-indigo group py-1"
                                >
                                    {item.name}
                                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-brand-indigo transition-all duration-300 ease-out group-hover:w-full rounded-full opacity-0 group-hover:opacity-100" />
                                </Link>
                            ))}
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:block w-72 lg:w-96">
                            <SearchBox placeholder="Search stores or categories..." />
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
