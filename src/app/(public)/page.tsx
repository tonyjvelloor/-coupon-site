import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Sparkles,
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    Shirt,
    Smartphone,
    UtensilsCrossed,
    Plane,
    Heart,
    Home as HomeIcon,
    Film,
    Dumbbell,
    Clock,
    Flame,
    ArrowRight,
    Gift,
    Percent,
} from "lucide-react";
import StoreCard from "@/components/ui/StoreCard";
import CouponCard from "@/components/ui/CouponCard";
import SearchInput from "@/components/ui/SearchInput";
import BannerCarousel from "@/components/ui/BannerCarousel";
import HeroCarousel from "@/components/ui/HeroCarousel";
import TrustBadges from "@/components/ui/TrustBadges";
import SocialProofPopup from "@/components/ui/SocialProofPopup";
import TrustedPartners from "@/components/ui/TrustedPartners";

export const dynamic = "force-dynamic";

const iconMap: Record<string, React.ElementType> = {
    Shirt,
    Smartphone,
    UtensilsCrossed,
    Plane,
    Heart,
    Home: HomeIcon,
    Film,
    Dumbbell,
};

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
        <div className="min-h-screen bg-gray-50/50">
            {/* Social Proof Popup */}
            <SocialProofPopup />

            {/* Hero Section - Premium Animated */}
            <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-900 pt-16 pb-20 md:pt-20 md:pb-28 px-4">
                {/* Animated background pattern */}
                <div className="absolute inset-0 hero-bg-pattern opacity-50"></div>

                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-violet-500/20 rounded-full blur-xl float-animation"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl float-animation" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg float-animation" style={{ animationDelay: "0.5s" }}></div>

                <div className="container mx-auto max-w-7xl relative z-10 space-y-8 lg:space-y-16">
                    {/* Split Layout Container */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                        {/* Left Column: Content */}
                        <div className="flex-1 space-y-6 lg:max-w-xl xl:max-w-2xl text-center lg:text-left">
                            {/* Urgency Banner */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-200 text-sm font-medium">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <span>Limited Time: Up to 80% OFF on 500+ Stores!</span>
                                <Flame className="w-4 h-4 text-orange-400" />
                            </div>

                            {/* Premium headline with animated gradient */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-tight">
                                Never Pay Full Price{" "}
                                <span className="gradient-text-animated block sm:inline">
                                    Ever Again
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-violet-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Join 50,000+ smart shoppers saving money with verified coupons,
                                exclusive deals & cashback from top brands worldwide.
                            </p>

                            {/* Premium Search Bar */}
                            <div className="pt-4 relative z-20 max-w-lg mx-auto lg:mx-0">
                                <div className="glass-card rounded-2xl p-2 glow-effect">
                                    <SearchInput />
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="pt-4 flex justify-center lg:justify-start">
                                <TrustBadges />
                            </div>
                        </div>

                        {/* Right Column: AI Illustration Carousel */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 flex justify-center mt-8 lg:mt-0">
                            <HeroCarousel />
                        </div>
                    </div>

                    {/* Banner Carousel */}
                    <div className="w-full relative z-10">
                        <BannerCarousel banners={banners} />
                    </div>
                </div>
            </section>

            {/* Flash Deal Banner */}
            <section className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 text-white">
                    <Flame className="w-6 h-6 animate-pulse" />
                    <span className="font-bold text-lg">⚡ FLASH SALE LIVE NOW!</span>
                    <span className="hidden md:inline">Extra 20% OFF on all coupons</span>
                    <Link
                        href="/best-offers"
                        className="neon-button !py-2 !px-4 !text-sm"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>

            {/* Top Stores - With stagger animation */}
            <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 relative">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-50/50 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                🏪 Top Stores
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                                Shop from your favorite brands and earn extra savings
                            </p>
                        </div>
                        <Link
                            href="/stores"
                            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-violet-100 text-violet-700 rounded-full font-semibold hover:bg-violet-200 transition-all group"
                        >
                            View All
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
                        {featuredStores.map((store) => (
                            <div key={store.id} className="premium-card rounded-xl">
                                <StoreCard store={store} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            href="/stores"
                            className="inline-flex items-center gap-2 text-violet-600 font-semibold"
                        >
                            View All Stores
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories - Enhanced with hover effects */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-violet-50/50 dark:from-gray-900 dark:to-violet-950/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 relative">
                        {/* Decorative background circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-200/50 dark:bg-violet-900/20 rounded-full blur-3xl -z-10"></div>

                        <h2 className="text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-violet-900 dark:from-white dark:to-violet-200">
                            🛍️ Shop by Category
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                            Discover the highest discounts curated into your favorite categories
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6 stagger-children">
                        {categories.map((category) => {
                            const customIconMap: Record<string, string> = {
                                Shirt: "/assets/icons/fashion.png",
                                Smartphone: "/assets/icons/electronics.png",
                                UtensilsCrossed: "/assets/icons/food.png",
                                Heart: "/assets/icons/beauty.png"
                            };

                            const customIconSrc = customIconMap[category.icon || ""];
                            const IconComponent = !customIconSrc ? (iconMap[category.icon || "Shirt"] || Gift) : Gift;

                            return (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="category-icon-wrapper flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                                    {customIconSrc ? (
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 dark:bg-gray-800/80 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/40 flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm group-hover:shadow-violet-500/30 overflow-hidden relative border border-gray-100 dark:border-gray-700/50">
                                            <Image
                                                src={customIconSrc}
                                                alt={category.name}
                                                fill
                                                className="object-cover p-1 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 group-hover:from-violet-500 group-hover:to-purple-600 flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm group-hover:shadow-violet-500/30 border border-gray-100 dark:border-gray-700/50">
                                            <IconComponent className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-white category-icon transition-colors duration-300" />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                        {category.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Hot Deals - Premium section */}
            <section className="py-16 lg:py-20 bg-gradient-to-br from-violet-100 via-purple-50 to-pink-50 dark:from-violet-950/40 dark:via-purple-900/40 dark:to-pink-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                                <Flame className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                    Hot Deals Today
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Handpicked offers with the best discounts
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/best-offers"
                            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all group shadow-lg"
                        >
                            View All Deals
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                        {hotCoupons.map((coupon) => (
                            <div key={coupon.id} className="premium-card rounded-xl">
                                <CouponCard
                                    coupon={coupon}
                                    storeName={coupon.store.name}
                                    storeLogo={coupon.store.logo}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Coupons */}
            <section className="py-16 lg:py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                <Percent className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                    Latest Coupons
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Fresh and verified coupon codes
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                        {latestCoupons.map((coupon) => (
                            <div key={coupon.id} className="premium-card rounded-xl">
                                <CouponCard
                                    coupon={coupon}
                                    storeName={coupon.store.name}
                                    storeLogo={coupon.store.logo}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us - Premium dark section */}
            <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 hero-bg-pattern opacity-20"></div>

                {/* Premium light streams */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                            Why Choose{" "}
                            <span className="gradient-text-animated">CouponHub?</span>
                        </h2>
                        <p className="text-violet-200/80 text-lg md:text-xl max-w-2xl mx-auto">
                            The world&apos;s leading platform for verified coupons, flash deals & maximum cashback
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 stagger-children">
                        {/* Box 1 */}
                        <div className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-green-500/30 transition-all duration-500">
                            <div className="h-full text-center p-10 rounded-[1.4rem] bg-gray-950/80 backdrop-blur-xl border border-white/5 relative overflow-hidden">
                                {/* Hover glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(52,211,153,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <ShieldCheck className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">100% Verified</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Every coupon is tested and verified by our team before listing. No more expired codes!
                                </p>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-orange-500/30 transition-all duration-500">
                            <div className="h-full text-center p-10 rounded-[1.4rem] bg-gray-950/80 backdrop-blur-xl border border-white/5 relative overflow-hidden">
                                {/* Hover glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(251,146,60,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <TrendingUp className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Maximum Savings</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Stack discounts with bank offers and cashback to save even more on every purchase.
                                </p>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-violet-500/30 transition-all duration-500">
                            <div className="h-full text-center p-10 rounded-[1.4rem] bg-gray-950/80 backdrop-blur-xl border border-white/5 relative overflow-hidden">
                                {/* Hover glow */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(167,139,250,0.3)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">Exclusive Deals</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Access exclusive coupons and early-access deals you won&apos;t find anywhere else.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-20 animated-gradient text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                        Start Saving Today! 🚀
                    </h2>
                    <p className="text-lg lg:text-xl mb-8 text-white/90">
                        Join thousands of smart shoppers who never pay full price.
                    </p>
                    <Link
                        href="/stores"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-violet-700 rounded-full font-bold text-lg hover:bg-violet-50 transition-all shadow-2xl hover:shadow-white/25 hover:-translate-y-1"
                    >
                        <Gift className="w-6 h-6" />
                        Browse All Deals
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Trusted Partners */}
            <TrustedPartners />

            <HomeSchema categories={categories} stores={featuredStores} />
        </div>
    );
}

// Helper to generate JSON-LD for the Homepage
function HomeSchema({ categories, stores }: { categories: any[], stores: any[] }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "CouponHub - Best Coupons, Offers & Deals Worldwide",
        description: "Get the best coupons, promo codes, and deals from top online stores.",
        url: "https://couponhub.store",
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
                        url: `https://couponhub.store/category/${cat.slug}`
                    }
                })),
                ...stores.slice(0, 5).map((store, index) => ({
                    "@type": "ListItem",
                    position: categories.length + index + 1,
                    item: {
                        "@type": "Store",
                        name: store.name,
                        url: `https://couponhub.store/stores/${store.slug}`
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

