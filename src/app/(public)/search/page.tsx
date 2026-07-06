import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import StoreCard from "@/components/ui/StoreCard";
import CouponCard from "@/components/ui/CouponCard";

export const metadata: Metadata = {
    title: "Search Results | CouponHub",
    description: "Search for the best coupons, stores, and deals.",
    robots: {
        index: false, // Search result pages shouldn't be indexed to avoid thin/duplicate content
        follow: true
    }
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : "";
    
    if (!q) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-[50vh]">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Search CouponHub</h1>
                <p className="text-gray-600">Enter a store or category in the search bar above.</p>
            </div>
        );
    }

    // Perform case-insensitive search across entities
    const [stores, categories, coupons, collections] = await Promise.all([
        prisma.store.findMany({
            where: { name: { contains: q } },
            take: 8
        }),
        prisma.category.findMany({
            where: { name: { contains: q } },
            take: 8
        }),
        prisma.coupon.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } }
                ],
                AND: [
                    {
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ]
                    }
                ]
            },
            include: { store: true },
            take: 12
        }),
        prisma.collection.findMany({
            where: { name: { contains: q } },
            take: 4
        })
    ]);

    const hasResults = stores.length > 0 || categories.length > 0 || coupons.length > 0 || collections.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results for "{q}"
            </h1>
            <p className="text-gray-600 mb-10">
                Found {stores.length + categories.length + coupons.length + collections.length} results
            </p>

            {!hasResults ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">We couldn't find anything matching your search. Try different keywords.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Stores */}
                    {stores.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Stores</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {stores.map(store => (
                                    <StoreCard key={store.id} store={store as any} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Collections & Categories */}
                    {(collections.length > 0 || categories.length > 0) && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Categories & Offers</h2>
                            <div className="flex flex-wrap gap-3">
                                {collections.map(col => (
                                    <Link key={col.id} href={`/offers/${col.slug}`} className="px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg font-medium transition-colors border border-orange-100">
                                        {col.name}
                                    </Link>
                                ))}
                                {categories.map(cat => (
                                    <Link key={cat.id} href={`/category/${cat.slug}`} className="px-4 py-2 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg font-medium transition-colors border border-violet-100">
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Coupons */}
                    {coupons.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Active Deals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {coupons.map(coupon => (
                                    <CouponCard 
                                        key={coupon.id} 
                                        coupon={coupon as any} 
                                        storeName={coupon.store?.name || ""} 
                                        storeLogo={coupon.store?.logo} 
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
