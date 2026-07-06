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
        where: { isActive: true },
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
            <section className="bg-gradient-to-br from-violet-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">All Stores</h1>
                    <p className="text-violet-200 text-lg max-w-2xl">
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
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Categories Filter */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className="text-gray-600 hover:text-violet-600 text-sm transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Alphabet Navigation */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Browse A-Z</h3>
                            <div className="flex flex-wrap gap-1">
                                {letters.map((letter) => (
                                    <a
                                        key={letter}
                                        href={`#letter-${letter}`}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-violet-100 hover:text-violet-600 text-sm font-medium transition-colors"
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
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
                                <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No stores yet
                                </h3>
                                <p className="text-gray-500">Check back soon for new stores!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
