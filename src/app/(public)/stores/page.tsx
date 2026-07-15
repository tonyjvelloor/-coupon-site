import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Search, Store as StoreIcon } from "lucide-react";
import StoreCard from "@/components/ui/StoreCard";

export const metadata: Metadata = {
    title: "All Stores - Coupons & Offers",
    description:
        "Browse all stores and find the best coupons, promo codes, and deals. Save big with verified offers from top online stores in India.",
};

async function getStores() {
    return prisma.store.findMany({
        orderBy: { name: "asc" },
    });
}

async function getCategories() {
    return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
    });
}

export default async function StoresPage() {
    const [stores, categories] = await Promise.all([getStores(), getCategories()]);

    // Group stores alphabetically
    const storesByLetter = stores.reduce(
        (acc, store) => {
            const letter = store.name.charAt(0).toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(store);
            return acc;
        },
        {} as Record<string, typeof stores>
    );

    const letters = Object.keys(storesByLetter).sort();

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">All Stores</h1>
                    <p className="text-primary-200 text-lg max-w-2xl">
                        Explore all {stores.length}+ stores and find the best deals with verified
                        coupons and cashback offers.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search stores..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:bg-surface-800 dark:border-surface-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Categories Filter */}
                        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-400 text-sm transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Alphabet Navigation */}
                        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 mt-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Browse A-Z</h3>
                            <div className="flex flex-wrap gap-1">
                                {letters.map((letter) => (
                                    <a
                                        key={letter}
                                        href={`#letter-${letter}`}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-surface-100 dark:bg-surface-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors text-slate-900 dark:text-surface-100"
                                    >
                                        {letter}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Stores Grid */}
                    <div className="flex-1">
                        {letters.map((letter) => (
                            <div key={letter} id={`letter-${letter}`} className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary dark:text-primary-400 flex items-center justify-center">
                                        {letter}
                                    </span>
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {storesByLetter[letter].map((store) => (
                                        <StoreCard key={store.id} store={store} />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {stores.length === 0 && (
                            <div className="text-center py-12">
                                <StoreIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                    No stores yet
                                </h3>
                                <p className="text-surface-500 dark:text-surface-400">Check back soon for new stores!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
