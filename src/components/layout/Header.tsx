"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Ticket,
    Search,
    Menu,
    X,
    User,
    ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sparkles } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
}

interface HeaderProps {
    categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            {/* Top Bar */}
            <div className="gradient-hero text-white py-2 text-center text-sm">
                <span className="font-medium">🎉 Get up to 80% OFF + Extra Cashback on Top Stores!</span>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">CouponHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/stores"
                            className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 font-medium transition-colors"
                        >
                            All Stores
                        </Link>
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 font-medium transition-colors">
                                Categories
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[200px]">
                                    {categories.slice(0, 8).map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.slug}`}
                                            className="block px-4 py-2 text-gray-600 hover:bg-violet-50 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <Link
                                            href="/categories"
                                            className="block px-4 py-2 text-violet-600 font-medium hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/30"
                                        >
                                            View All Categories
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/best-offers"
                            className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 font-medium transition-colors"
                        >
                            Best Offers
                        </Link>
                        <Link
                            href="/blog"
                            className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 font-medium transition-colors"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/news"
                            className="flex items-center gap-1 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-bold transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            News
                        </Link>
                    </nav>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden md:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search coupons, stores..."
                                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-violet-600"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {searchOpen && (
                    <div className="md:hidden py-3 border-t border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search coupons, stores..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                        <Link
                            href="/stores"
                            className="block px-4 py-3 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Stores
                        </Link>
                        <Link
                            href="/blog"
                            className="block px-4 py-3 text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/news"
                            className="flex items-center gap-2 px-4 py-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg font-bold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Sparkles className="w-4 h-4" />
                            Viral News
                        </Link>
                        <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                            Categories
                        </div>
                        {categories.slice(0, 6).map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="block px-4 py-2 text-gray-600 hover:bg-violet-50 hover:text-violet-600 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
