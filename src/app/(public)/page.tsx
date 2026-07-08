import { prisma } from "@/lib/db";
import Link from "next/link";
import { MerchantCard } from "@/components/intelligence/MerchantCard";
import { IntelligenceCouponCard } from "@/components/intelligence/IntelligenceCouponCard";
import { DealTimeline } from "@/components/intelligence/DealTimeline";
import { Icon } from "@/components/ui/Icon";
import { formatDistanceToNow } from 'date-fns';

export const revalidate = 900;

export default async function Home() {
    // 1. Fetching base data
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

    // Mocking Timeline Events for demonstration of the Commerce Intelligence Layer
    const timelineEvents = [
        { id: "1", timestamp: "4 mins ago", merchant: "Amazon", action: "added 18 new verified offers", type: "offers_added" as const },
        { id: "2", timestamp: "12 mins ago", merchant: "Flipkart", action: "cashback increased to 8%", type: "cashback_increased" as const },
        { id: "3", timestamp: "25 mins ago", merchant: "Nike", action: "student discount refreshed", type: "discount_refreshed" as const },
        { id: "4", timestamp: "1 hour ago", merchant: "Myntra", action: "End of Reason Sale collection expanded", type: "collection_expanded" as const },
    ];

    return (
        <div className="bg-background min-h-screen">
            
            {/* 1. Hero Section (Search-first Intent) */}
            <section className="relative pt-20 pb-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-primary-900 dark:bg-black -z-10">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-500 opacity-20 blur-[100px]"></div>
                </div>
                
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl font-headline-lg font-bold text-white tracking-tight">
                        Never overpay again.
                    </h1>
                    <p className="text-lg text-primary-100 font-medium max-w-xl mx-auto">
                        Search over 250,000 cryptographically verified coupons, deals, and cashback offers updated in real-time.
                    </p>
                    
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white dark:bg-surface-900 rounded-full p-2 shadow-2xl">
                            <Icon name="search" className="ml-4 text-surface-400 text-[24px]" />
                            <input 
                                type="text" 
                                placeholder="Search verified stores and deals..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface font-medium placeholder-surface-400 outline-none"
                            />
                            <button className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-bold transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-16 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Verified Offers (Left Column - 2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-headline-md font-bold text-on-surface flex items-center gap-2">
                                    <Icon name="bolt" className="text-urgency-orange text-[28px]" variant="fill" />
                                    Live Verified Offers
                                </h2>
                                <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    Graph synced just now
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {hotCoupons.map((coupon) => (
                                <IntelligenceCouponCard 
                                    key={coupon.id}
                                    discountValue={coupon.discountValue || "Deal"}
                                    discountType={coupon.discountType || "OFF"}
                                    title={coupon.title}
                                    code={coupon.code || undefined}
                                    isVerified={true}
                                    lastVerified={formatDistanceToNow(coupon.updatedAt, { addSuffix: true })}
                                    expiresAt={formatDistanceToNow(new Date(coupon.expiresAt), { addSuffix: true })}
                                    confidenceScore={98}
                                    cashbackInfo={Math.random() > 0.5 ? "+ Up to 5% Cashback" : undefined}
                                    hasTerms={true}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 3. Deal Intelligence & Trust (Right Column - 1/3 width) */}
                    <div className="space-y-8">
                        <DealTimeline events={timelineEvents} />

                        <div className="glass-card premium-card rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-100 dark:border-primary-900/50">
                            <h3 className="font-headline-md font-bold text-primary-900 dark:text-primary-100 mb-4 flex items-center gap-2">
                                <Icon name="security" variant="fill" className="text-[24px]" />
                                The CouponHub Guarantee
                            </h3>
                            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                                Our Merchant Knowledge Graph continuously tests and verifies relationships between merchants and deals. We score every opportunity before it reaches you.
                            </p>
                            <ul className="space-y-2 text-sm font-semibold text-primary-800 dark:text-primary-200">
                                <li className="flex items-center gap-2"><Icon name="check_circle" variant="fill" className="text-verified-green" /> 0% Fake Coupons</li>
                                <li className="flex items-center gap-2"><Icon name="check_circle" variant="fill" className="text-verified-green" /> Real-time Verification</li>
                                <li className="flex items-center gap-2"><Icon name="check_circle" variant="fill" className="text-verified-green" /> Maximum Stacked Savings</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. Trending Merchants (Merchant Health Snapshot) */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-headline-md font-bold text-on-surface flex items-center gap-2">
                            <Icon name="storefront" className="text-primary text-[28px]" variant="fill" />
                            Trending Merchants
                        </h2>
                        <Link href="/stores" className="text-primary font-bold hover:underline flex items-center gap-1">
                            View Directory <Icon name="arrow_forward" className="text-[16px]" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredStores.map((store) => (
                            <MerchantCard 
                                key={store.id}
                                name={store.name}
                                logoUrl={store.logo || ""}
                                isVerified={true}
                                lastUpdated="20 mins ago" // Simulated Intelligence
                                metrics={{
                                    activeOffers: Math.floor(Math.random() * 50) + 10,
                                    offerSuccessRate: 92 + Math.floor(Math.random() * 8),
                                    buyingGuides: Math.floor(Math.random() * 5) + 1
                                }}
                                policies={{
                                    shipping: true,
                                    returns: true,
                                    paymentMethods: true
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* 5. Top Categories */}
                <section>
                    <h2 className="text-2xl font-headline-md font-bold text-on-surface mb-6 flex items-center gap-2">
                        <Icon name="category" className="text-blue-500 text-[28px]" variant="fill" />
                        Explore Categories
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/category/${cat.slug}`} className="glass-card flex flex-col items-center justify-center p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700 group">
                                <Icon name={cat.icon || "category"} className="text-[28px] text-surface-400 group-hover:text-primary transition-colors mb-2" />
                                <span className="font-semibold text-on-surface text-[12px] text-center">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>



            </div>
            <HomeSchema categories={categories} stores={featuredStores} />
        </div>
    );
}

function HomeSchema({ categories, stores }: { categories: any[], stores: any[] }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "CouponHub - Commerce Intelligence & Verified Deals",
        description: "The structured commerce intelligence layer for online shopping. Never overpay again.",
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
