import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CategoryLinkWall() {
    // Fetch top categories to build the internal linking matrix
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { displayOrder: 'asc' },
        include: {
            storeCategories: {
                include: {
                    store: {
                        select: { name: true, slug: true }
                    }
                },
                take: 5
            },
            children: {
                take: 5
            }
        }
    });

    // Fetch top global stores for the first "Top Stores" row
    const topStores = await prisma.store.findMany({
        where: { isActive: true, isFeatured: true },
        take: 8,
        orderBy: { offerCount: 'desc' },
        select: { name: true, slug: true }
    });

    return (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                    Explore More Deals & Offers
                </h2>

                <div className="space-y-6 text-sm">
                    {/* Top Stores Block */}
                    <div className="flex flex-col md:flex-row md:items-baseline gap-x-4 gap-y-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-200 min-w-[160px]">
                            Top Stores:
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-500 dark:text-gray-400">
                            {topStores.map((store, i) => (
                                <span key={`top-${store.slug}`} className="flex items-center gap-3">
                                    <Link href={`/stores/${store.slug}`} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                        {store.name} Coupons
                                    </Link>
                                    {i < topStores.length - 1 && <span className="text-gray-300 dark:text-gray-700">|</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Categories Block */}
                    {categories.map(category => {
                        // Gather links from children and stores
                        const links: { name: string, url: string }[] = [];
                        category.children.forEach(child => {
                            links.push({ name: `${child.name} Offers`, url: `/category/${child.slug}` });
                        });
                        category.storeCategories.forEach(sc => {
                            links.push({ name: `${sc.store.name} Promo Codes`, url: `/stores/${sc.store.slug}` });
                        });

                        if (links.length === 0) return null;

                        return (
                            <div key={category.id} className="flex flex-col md:flex-row md:items-baseline gap-x-4 gap-y-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-200 min-w-[160px]">
                                    {category.name} Discounts:
                                </span>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-500 dark:text-gray-400">
                                    {links.slice(0, 8).map((link, i) => (
                                        <span key={`${category.id}-${link.url}`} className="flex items-center gap-3">
                                            <Link href={link.url} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                                {link.name}
                                            </Link>
                                            {i < Math.min(links.length, 8) - 1 && <span className="text-gray-300 dark:text-gray-700">|</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
