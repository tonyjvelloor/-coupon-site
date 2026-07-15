import { Search, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface HeroModuleProps {
    activeUsers?: number;
    totalSavings?: string;
}

export function HeroModule({ activeUsers = 12453, totalSavings = "$2.4M" }: HeroModuleProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/assistant?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-black">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                    Save more every time <br className="hidden md:block"/> you shop online.
                </h1>
                <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto font-medium">
                    Find verified coupons, cashback offers, payment discounts, and shopping tips for thousands of stores.
                </p>
                
                {/* COMMAND SEARCH */}
                <div className="relative group max-w-3xl mx-auto pt-4">
                    <form onSubmit={handleSearch} className="relative group flex items-center bg-white dark:bg-surface-800 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-2 pr-4 ring-1 ring-surface-200 dark:ring-surface-700 transition-all duration-300 hover:ring-primary-500 focus-within:ring-2 focus-within:ring-primary-500">
                        <div className="absolute left-6 text-primary-500">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What do you want to buy today?"
                            className="w-full pl-16 pr-4 py-4 bg-transparent border-none text-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-0"
                        />
                        <button type="submit" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                            Ask Copilot
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm">
                        <span className="text-surface-500 font-bold uppercase tracking-wider mr-2 text-[11px]">Trending:</span>
                        <Link href="/stores/amazon" className="text-surface-700 dark:text-surface-300 hover:text-primary hover:-translate-y-0.5 transition-all font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-full">Amazon</Link>
                        <Link href="/stores/flipkart" className="text-surface-700 dark:text-surface-300 hover:text-primary hover:-translate-y-0.5 transition-all font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-full">Flipkart</Link>
                        <Link href="/stores/myntra" className="text-surface-700 dark:text-surface-300 hover:text-primary hover:-translate-y-0.5 transition-all font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-full">Myntra</Link>
                        <Link href="/stores/nykaa" className="text-surface-700 dark:text-surface-300 hover:text-primary hover:-translate-y-0.5 transition-all font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-full">Nykaa</Link>
                        <Link href="/stores/ajio" className="text-surface-700 dark:text-surface-300 hover:text-primary hover:-translate-y-0.5 transition-all font-bold bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-full">Ajio</Link>
                    </div>
                </div>

                {/* TRUST SIGNALS */}
                <div className="pt-10 flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-bold text-surface-600 dark:text-surface-400">
                    <span className="flex items-center gap-1.5"><Icon name="check_circle" className="text-verified" variant="fill" /> Updated regularly</span>
                    <span className="flex items-center gap-1.5"><Icon name="check_circle" className="text-verified" variant="fill" /> Working coupons</span>
                    <span className="flex items-center gap-1.5"><Icon name="check_circle" className="text-verified" variant="fill" /> Trusted merchants</span>
                    <span className="flex items-center gap-1.5"><Icon name="check_circle" className="text-verified" variant="fill" /> Cashback available</span>
                </div>

            </div>
        </section>
    );
}
