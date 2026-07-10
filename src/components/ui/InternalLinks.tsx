import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronRight, TrendingUp, Clock, Tag, Store as StoreIcon, Layers } from "lucide-react";

interface InternalLinksProps {
    currentStoreId?: string;
    currentCategoryId?: string;
    currentCollectionId?: string;
}

export default async function InternalLinks({ currentStoreId, currentCategoryId, currentCollectionId }: InternalLinksProps) {
    // We fetch several clusters of links concurrently
    const [
        trendingCoupons,
        expiringSoon,
        newCoupons,
        popularStores,
        similarCollections
    ] = await Promise.all([
        // Trending
        prisma.coupon.findMany({
            where: { storeId: { not: currentStoreId || undefined } },
            orderBy: { usageCount: 'desc' },
            take: 6,
            include: { store: { select: { name: true, slug: true } } }
        }),
        // Expiring Soon
        prisma.coupon.findMany({
            where: {
                expiresAt: { not: null, gt: new Date() },
                storeId: { not: currentStoreId || undefined }
            },
            orderBy: { expiresAt: 'asc' },
            take: 6,
            include: { store: { select: { name: true, slug: true } } }
        }),
        // New
        prisma.coupon.findMany({
            where: { storeId: { not: currentStoreId || undefined } },
            orderBy: { createdAt: 'desc' },
            take: 6,
            include: { store: { select: { name: true, slug: true } } }
        }),
        // Popular Stores
        prisma.store.findMany({
            where: { id: { not: currentStoreId || undefined }, isActive: true },
            orderBy: { offerCount: 'desc' },
            take: 12
        }),
        // Similar Collections
        prisma.collection.findMany({
            where: { id: { not: currentCollectionId || undefined }, isIndexable: true },
            orderBy: { priority: 'desc' },
            take: 8
        })
    ]);

    return (
        <div className="space-y-10 border-t border-gray-100 pt-10">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-600" />
                    Popular this week
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingCoupons.map((coupon) => (
                        <Link 
                            key={coupon.id} 
                            href={`/stores/${coupon.store.slug}`}
                            className="bg-white border border-gray-100 rounded-xl p-4 hover:border-violet-200 hover:shadow-md transition-all group"
                        >
                            <div className="text-xs text-gray-500 mb-1">{coupon.store.name}</div>
                            <div className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                                {coupon.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Expiring Soon */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-red-500" />
                        Expiring Soon
                    </h3>
                    <ul className="space-y-3">
                        {expiringSoon.map(coupon => (
                            <li key={coupon.id}>
                                <Link href={`/stores/${coupon.store.slug}`} className="flex items-start gap-3 group">
                                    <ChevronRight className="w-4 h-4 text-gray-300 mt-0.5 group-hover:text-violet-500" />
                                    <div>
                                        <div className="font-medium text-gray-800 group-hover:text-violet-600 text-sm">{coupon.title}</div>
                                        <div className="text-xs text-red-500 mt-0.5">Expires soon!</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newly Added */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-green-500" />
                        Recently updated
                    </h3>
                    <ul className="space-y-3">
                        {newCoupons.map(coupon => (
                            <li key={coupon.id}>
                                <Link href={`/stores/${coupon.store.slug}`} className="flex items-start gap-3 group">
                                    <ChevronRight className="w-4 h-4 text-gray-300 mt-0.5 group-hover:text-violet-500" />
                                    <div>
                                        <div className="font-medium text-gray-800 group-hover:text-violet-600 text-sm">{coupon.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">from {coupon.store.name}</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Entity Links (Stores & Collections) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <StoreIcon className="w-5 h-5 text-blue-500" />
                        Similar merchants
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {popularStores.map((store) => (
                            <Link
                                key={store.id}
                                href={`/stores/${store.slug}`}
                                className="px-3 py-1.5 bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-lg text-sm border border-gray-100 transition-colors"
                            >
                                {store.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {similarCollections.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-orange-500" />
                            More Collections
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {similarCollections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/offers/${collection.slug}`}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-lg text-sm border border-gray-100 transition-colors"
                                >
                                    {collection.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
