import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import {
    Flame,
    ArrowRight,
    Percent,
    ShieldCheck,
    Tag,
    Clock,
    Search
} from "lucide-react";
import StoreCard from "@/components/ui/StoreCard";
import CouponCard from "@/components/ui/CouponCard";
import SearchInput from "@/components/ui/SearchInput";
import BannerCarousel from "@/components/ui/BannerCarousel";
import TrustBadges from "@/components/ui/TrustBadges";
import SocialProofPopup from "@/components/ui/SocialProofPopup";
import TrustedPartners from "@/components/ui/TrustedPartners";

export const revalidate = 900;

export default async function Home() {
    const featuredStores = await prisma.store.findMany({
        where: { isFeatured: true, isActive: true },
        take: 8,
        orderBy: { name: "asc" },
    });

    const categories = await prisma.category.findMany({
        where: { isActive: true },
        take: 8,
        orderBy: { name: "asc" },
    });

    const hotCoupons = await prisma.coupon.findMany({
        where: {
            type: "deal",
            isFeatured: true,
            expiresAt: { gt: new Date() },
        },
        include: { store: true },
        take: 6,
        orderBy: { createdAt: "desc" },
    });

    const latestCoupons = await prisma.coupon.findMany({
        where: {
            type: "coupon",
            expiresAt: { gt: new Date() },
        },
        include: { store: true },
        take: 8,
        orderBy: { createdAt: "desc" },
    });

    const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <SocialProofPopup />

            {/* Flash Deal Banner (If active) */}
            <div className="bg-orange-600 text-white text-sm font-medium py-2 px-4 text-center">
                <span className="inline-flex items-center gap-1"><Flame className="w-4 h-4"/> Flash Sale: Extra 20% Cashback on Top Stores Today</span>
            </div>

            {/* Commerce-First Hero */}
            <section className="bg-white border-b border-gray-200 pt-10 pb-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Find the Best Deals & Coupons
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Search 50,000+ verified coupons and promo codes from your favorite stores.
                    </p>

                    {/* Prominent Search */}
                    <div className="max-w-2xl mx-auto mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-1 flex">
                            <SearchInput />
                        </div>
                    </div>

                    {/* Merchant Shortcuts */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mr-2">Top Stores:</span>
                        {featuredStores.slice(0, 6).map((store) => (
                            <Link key={store.id} href={`/stores/${store.slug}`} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors">
                                {store.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <TrustBadges />
                    </div>
                </div>
            </section>

            {/* Trending Deals */}
            {hotCoupons.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Flame className="w-6 h-6 text-orange-500" />
                                Trending Deals Today
                            </h2>
                            <Link href="/best-offers" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hotCoupons.map((coupon) => (
                                <CouponCard key={coupon.id} coupon={coupon} storeName={coupon.store.name} storeLogo={coupon.store.logo} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Top Stores */}
            {featuredStores.length > 0 && (
                <section className="py-12 bg-white border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Popular Stores</h2>
                            <Link href="/stores" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {featuredStores.map((store) => (
                                <StoreCard key={store.id} store={store} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Banner Ads Carousel (Re-purposed) */}
            {banners.length > 0 && (
                <section className="py-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <BannerCarousel banners={banners} />
                    </div>
                </section>
            )}

            {/* Top Categories */}
            {categories.length > 0 && (
                <section className="py-12 bg-white border-y border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                            {categories.map((cat) => (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                                    <span className="font-medium text-gray-800 text-sm text-center">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Coupons */}
            {latestCoupons.length > 0 && (
                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-blue-500" />
                                Latest Verified Coupons
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {latestCoupons.map((coupon) => (
                                <CouponCard key={coupon.id} coupon={coupon} storeName={coupon.store.name} storeLogo={coupon.store.logo} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Value Proposition */}
            <section className="py-12 bg-white border-t border-gray-200">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">100% Verified</h3>
                        <p className="text-gray-600 text-sm">Every coupon is tested by our team daily.</p>
                    </div>
                    <div>
                        <Tag className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">Maximum Savings</h3>
                        <p className="text-gray-600 text-sm">Stack discounts with our exclusive cashback.</p>
                    </div>
                    <div>
                        <Percent className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 mb-2">Exclusive Deals</h3>
                        <p className="text-gray-600 text-sm">Access special promo codes you won't find anywhere else.</p>
                    </div>
                </div>
            </section>

            <TrustedPartners />
            <HomeSchema categories={categories} stores={featuredStores} />
        </div>
    );
}

function HomeSchema({ categories, stores }: { categories: any[], stores: any[] }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "CouponHub - Best Coupons, Offers & Deals Worldwide",
        description: "Get the best coupons, promo codes, and deals from top online stores.",
        url: siteUrl,
        mainEntity: {
            "@type": "ItemList",
            name: "Featured Categories and Stores",
            itemListElement: [
                ...categories.slice(0, 5).map((cat, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "CollectionPage",
                        name: cat.name,
                        url: `${siteUrl}/category/${cat.slug}`
                    }
                })),
                ...stores.slice(0, 5).map((store, index) => ({
                    "@type": "ListItem",
                    position: categories.length + index + 1,
                    item: {
                        "@type": "Store",
                        name: store.name,
                        url: `${siteUrl}/stores/${store.slug}`
                    }
                }))
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
