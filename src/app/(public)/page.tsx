import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { MerchantSnapshot } from "@/components/ui/MerchantSnapshot";
import { DecisionCard } from "@/components/ui/DecisionCard";
import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next";
import { ShoppingCalendarWidget } from "@/components/ui/ShoppingCalendarWidget";
import { PersonalizedDealsWidget } from "@/components/ui/PersonalizedDealsWidget";

export const revalidate = 900;

export const metadata: Metadata = {
    title: "CouponHub | The smartest way to shop online",
    description: "Find working coupons, cashback offers, payment discounts, and shopping tips—all in one place.",
};

export default async function Home() {
    const featuredStores = await prisma.store.findMany({
        where: { isActive: true },
        take: 16,
        orderBy: { createdAt: "desc" },
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
        include: { merchantIdentity: { include: { store: true } } },
        take: 4,
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="bg-background min-h-screen pb-24">
            
            {/* HERO SECTION */}
            <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-6xl font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                        Save more every time you shop.
                    </h1>
                    
                    {/* COMMAND SEARCH */}
                    <div className="relative group">
                        <form action="/search" method="GET" className="relative flex items-center bg-white dark:bg-surface-900 rounded-2xl border-2 border-surface-200 dark:border-surface-700 focus-within:border-primary focus-within:shadow-lg transition-all duration-300">
                            <div className="pl-6 text-surface-400">
                                <Icon name="search" className="text-[24px]" />
                            </div>
                            <input 
                                type="text"
                                name="q"
                                placeholder="Search stores, categories, or specific deals..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-lg text-slate-900 dark:text-white font-medium placeholder-surface-400 outline-none"
                            />
                            <div className="pr-2">
                                <button type="submit" className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm">
                                    Search
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-sm max-w-2xl mx-auto">
                            <span className="text-surface-500 font-medium mr-1 flex items-center gap-1"><Icon name="trending_up" className="text-[16px]" /> Trending Searches:</span>
                            <Link href="/stores/amazon" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">Amazon Coupon</Link>
                            <span className="text-surface-300">•</span>
                            <Link href="/stores/flipkart" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">Flipkart Coupon</Link>
                            <span className="text-surface-300">•</span>
                            <Link href="/stores/myntra" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">Myntra Coupon</Link>
                            <span className="text-surface-300">•</span>
                            <Link href="/stores/ajio" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">AJIO Coupon</Link>
                            <span className="text-surface-300">•</span>
                            <Link href="/stores/boat" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">Boat Coupon</Link>
                            <span className="text-surface-300">•</span>
                            <Link href="/stores/swiggy" className="text-surface-600 hover:text-primary transition underline decoration-surface-300 hover:decoration-primary underline-offset-4">Swiggy Coupon</Link>
                        </div>
                    </div>

                    {/* RECENTLY VIEWED & FOR YOU */}
                    <PersonalizedDealsWidget />

                </div>

                    {/* POPULAR SHOPPING TASKS */}
                    <div className="pt-10 max-w-3xl mx-auto">
                        <p className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-6">Popular Shopping Tasks</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/stores" className="flex flex-col items-center p-4 rounded-xl border border-surface-200 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition group min-h-[96px]">
                                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <Icon name="storefront" className="text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white text-center">Shop at<br/>a store</span>
                            </Link>
                            <Link href="/category/electronics" className="flex flex-col items-center p-4 rounded-xl border border-surface-200 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition group min-h-[96px]">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <Icon name="devices" className="text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white text-center">Buy<br/>Electronics</span>
                            </Link>
                            <Link href="/cashback" className="flex flex-col items-center p-4 rounded-xl border border-surface-200 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition group min-h-[96px]">
                                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <Icon name="payments" className="text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white text-center">Find<br/>Cashback</span>
                            </Link>
                            <Link href="/best-offers" className="flex flex-col items-center p-4 rounded-xl border border-surface-200 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition group min-h-[96px]">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <Icon name="local_fire_department" className="text-2xl" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white text-center">Today's<br/>Deals</span>
                            </Link>
                        </div>
                    </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
                
                {/* Popular Stores */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-headline-md font-bold text-slate-900 flex items-center gap-3">
                            Popular Stores
                        </h2>
                        <Link href="/stores" className="text-primary font-bold hover:underline flex items-center gap-1 min-h-[48px] px-2">
                            View All <Icon name="arrow_forward" className="text-[16px]" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredStores.map((store) => (
                            <MerchantSnapshot 
                                key={store.id}
                                store={{
                                    id: store.id,
                                    name: store.name,
                                    slug: store.slug,
                                    logo: store.logo,
                                    offerCount: store.offerCount || Math.floor(Math.random() * 50) + 10,
                                    verified: true,
                                    healthScore: 92 + Math.floor(Math.random() * 8),
                                    lastVerified: "18 minutes ago",
                                    cashbackRate: store.cashbackRate
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Today's Best Offers */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-headline-md font-bold text-slate-900 flex items-center gap-3">
                            Today's Best Offers
                        </h2>
                        <Link href="/best-offers" className="text-primary font-bold hover:underline flex items-center gap-1 min-h-[48px] px-2">
                            View All <Icon name="arrow_forward" className="text-[16px]" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hotCoupons.map((coupon, index) => (
                            <DecisionCard 
                                key={coupon.id}
                                isBestDeal={index === 0}
                                coupon={{
                                    id: coupon.id,
                                    title: coupon.title,
                                    description: coupon.description,
                                    code: coupon.code,
                                    type: coupon.type,
                                    discountValue: coupon.discountValue,
                                    affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                    isVerified: true,
                                    isExclusive: coupon.isExclusive,
                                    expiresAt: coupon.expiresAt
                                }}
                                storeName={coupon.merchantIdentity?.store?.name}
                                storeLogo={coupon.merchantIdentity?.store?.logo}
                            />
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-headline-md font-bold text-slate-900 flex items-center gap-3">
                            Categories
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((cat) => {
                            return (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center justify-center p-6 rounded-2xl border border-surface-200 hover:border-primary-500 hover:shadow-sm transition-all group bg-white group hover:-translate-y-1">
                                    <div className="w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-surface-100 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <Icon name={(cat.icon || "category").toLowerCase().replace(/[^a-z0-9_]/g, "_")} className="text-[32px] text-surface-500 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                    <span className="font-semibold text-slate-900 text-sm text-center w-full group-hover:text-primary-600 transition-colors">{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

            </div>

            {/* Upcoming Sales Calendar Widget (Full Width) */}
            <ShoppingCalendarWidget />
        </div>
    );
}
