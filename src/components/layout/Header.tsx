"use client";

import Link from "next/link";
import { Ticket, Search, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 transition-colors duration-300">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">CouponHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/stores" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-400 font-medium transition-colors">
                            Stores
                        </Link>
                        <Link href="/deals" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-400 font-medium transition-colors">
                            Deals
                        </Link>
                        <Link href="/cashback" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-400 font-medium transition-colors">
                            Cashback
                        </Link>
                        <Link href="/guides" className="text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-400 font-medium transition-colors">
                            Guides
                        </Link>
                    </nav>

                    {/* Search & Theme (Desktop) */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                            <input
                                type="text"
                                placeholder="Search stores, products, brands..."
                                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm dark:bg-surface-800 dark:border-surface-700 dark:text-white dark:placeholder-surface-400 transition-shadow"
                            />
                        </div>
                        <Link href="/saved" className="p-2 text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-400 transition-colors rounded-full hover:bg-surface-100 dark:hover:bg-surface-800" title="Saved Deals">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
