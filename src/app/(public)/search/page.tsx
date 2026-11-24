import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { MerchantSnapshot } from "@/components/ui/MerchantSnapshot";
import { DecisionCard } from "@/components/ui/DecisionCard";
import {
    FALLBACK_CATEGORIES,
    FALLBACK_COLLECTIONS,
    FALLBACK_COUPONS,
    FALLBACK_STORES,
} from "@/lib/fallback-catalog";

export const metadata: Metadata = {
    title: "Search Results",
    description: "Search for the best coupons, stores, and deals.",
    robots: {
        index: false,
        follow: true
    }
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q.trim() : "";

    if (!q) {
        return (
            <div className="max-w-container-max mx-auto px-4 py-20 text-center min-h-[60vh]">
                <Icon name="search" className="text-6xl text-surface-300 mb-4" />
                <h1 className="text-3xl font-bold text-slate-900 mb-3">Search CouponHub</h1>
                <p className="text-surface-500">Enter a store, brand, or category in the search bar above.</p>
            </div>
        );
    }

    const mode = 'insensitive' as const;

    let stores: any[] = [];
    let categories: any[] = [];
    let coupons: any[] = [];
    let collections: any[] = [];

    try {
        // Perform case-insensitive search across entities using the correct Prisma schema
        [stores, categories, coupons, collections] = await Promise.all([
            prisma.store.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { name: { contains: q, mode } },
                        { slug: { contains: q, mode } },
                    ]
                },
                take: 8
            }),
            prisma.category.findMany({
                where: { isActive: true, name: { contains: q, mode } },
                take: 6
            }),
            prisma.coupon.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { title: { contains: q, mode } },
                        { description: { contains: q, mode } },
                        { code: { contains: q, mode } }
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
                include: {
                    merchantIdentity: { include: { store: true } }
                },
                take: 12
            }),
            prisma.collection.findMany({
                where: { name: { contains: q, mode } },
                take: 4
            })
        ]);
    } catch (err) {
        console.warn(`[search?q=${q}] DB query failed, using fallback catalog search:`, err);
        const ql = q.toLowerCase();
        stores = FALLBACK_STORES.filter(
            (s) =>
                s.name.toLowerCase().includes(ql) ||
                s.slug.toLowerCase().includes(ql) ||
                s.primaryCategory.toLowerCase().includes(ql)
        ).slice(0, 8);
        categories = FALLBACK_CATEGORIES.filter(
            (c) => c.name.toLowerCase().includes(ql) || c.slug.toLowerCase().includes(ql)
        ).slice(0, 6);
        coupons = FALLBACK_COUPONS.filter(
            (c) =>
                c.title.toLowerCase().includes(ql) ||
                (c.description || "").toLowerCase().includes(ql) ||
                (c.code || "").toLowerCase().includes(ql) ||
                c.merchantName.toLowerCase().includes(ql)
        )
            .slice(0, 12)
            .map((c) => ({
                ...c,
                merchantIdentity: {
                    store: {
                        name: c.merchantName,
                        slug: c.merchantSlug,
                        logo: c.merchantLogo,
                    },
                },
            }));
        collections = FALLBACK_COLLECTIONS.filter(
            (col) => col.name.toLowerCase().includes(ql) || col.slug.toLowerCase().includes(ql)
        ).slice(0, 4);
    }

    const hasResults = stores.length > 0 || categories.length > 0 || coupons.length > 0 || collections.length > 0;
    const total = stores.length + categories.length + coupons.length + collections.length;

    return (
        <div className="bg-surface-50 min-h-screen">

            {/* Result Header */}
            <div className="bg-white border-b border-surface-200 py-8">
                <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-3xl font-headline-md font-bold text-slate-900 mb-1">
                        Results for "<span className="text-primary">{q}</span>"
                    </h1>
                    <p className="text-surface-500">
                        {hasResults ? `Found ${total} match${total !== 1 ? 'es' : ''} across stores, categories & deals.` : 'No results found.'}
                    </p>
                </div>
            </div>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                {!hasResults ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-surface-300 shadow-sm">
                        <Icon name="search_off" className="text-6xl text-surface-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                        <p className="text-surface-500 max-w-md mx-auto mb-8">
                            We couldn't find anything matching "<strong>{q}</strong>". Try a different store name, brand, or category.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/stores" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition">
                                Browse All Stores
                            </Link>
                            <Link href="/categories" className="inline-flex items-center gap-2 bg-surface-100 text-surface-700 px-6 py-2.5 rounded-xl font-bold hover:bg-surface-200 transition">
                                All Categories
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stores */}
                        {stores.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Icon name="storefront" className="text-2xl text-primary-600" />
                                    <h2 className="text-2xl font-headline-md font-bold text-slate-900">Stores</h2>
                                    <span className="bg-surface-100 text-surface-600 text-sm font-bold px-2.5 py-0.5 rounded-full ml-1">{stores.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {stores.map(store => (
                                        <MerchantSnapshot
                                            key={store.id}
                                            store={{
                                                id: store.id,
                                                name: store.name,
                                                slug: store.slug,
                                                logo: store.logo,
                                                offerCount: store.offerCount || store.activeOfferCount || 0,
                                                verified: true,
                                                lastVerified: "Verified today",
                                                cashbackRate: store.cashbackRate,
                                            }}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Categories & Collections */}
                        {(categories.length > 0 || collections.length > 0) && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Icon name="category" className="text-2xl text-violet-600" />
                                    <h2 className="text-2xl font-headline-md font-bold text-slate-900">Categories & Collections</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map(cat => (
                                        <Link key={cat.id} href={`/best/${cat.slug}-coupons`} className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl font-semibold transition border border-violet-100">
                                            <Icon name="folder_open" className="text-[16px]" /> {cat.name}
                                        </Link>
                                    ))}
                                    {collections.map(col => (
                                        <Link key={col.id} href={`/offers/${col.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-semibold transition border border-orange-100">
                                            <Icon name="local_offer" className="text-[16px]" /> {col.name}
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Deals */}
                        {coupons.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Icon name="bolt" className="text-2xl text-urgency-orange" variant="fill" />
                                    <h2 className="text-2xl font-headline-md font-bold text-slate-900">Active Deals</h2>
                                    <span className="bg-surface-100 text-surface-600 text-sm font-bold px-2.5 py-0.5 rounded-full ml-1">{coupons.length}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {coupons.map(coupon => {
                                        const store = coupon.merchantIdentity?.store;
                                        return (
                                            <DecisionCard
                                                key={coupon.id}
                                                coupon={{
                                                    id: coupon.id,
                                                    title: coupon.title,
                                                    description: coupon.description,
                                                    code: coupon.code,
                                                    type: coupon.type,
                                                    discountType: coupon.discountType,
                                                    discountValue: coupon.discountValue,
                                                    affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                                    expiresAt: coupon.expiresAt,
                                                    isVerified: coupon.isVerified,
                                                    isExclusive: coupon.isExclusive,
                                                }}
                                                storeName={store?.name || ""}
                                                storeLogo={store?.logo}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
