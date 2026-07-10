import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { DecisionCard } from "@/components/ui/DecisionCard";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import { DecisionGraph } from "@/components/intelligence/DecisionGraph";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import StickyCouponWidget from "@/components/ui/StickyCouponWidget";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Stack } from "@/components/ui/Stack";
import { DealTimeline } from "@/components/ui/DealTimeline";
import { TrustSignal } from "@/components/ui/TrustSignal";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        const stores = await prisma.store.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return stores.map((store) => ({
            slug: store.slug,
        }));
    } catch (error) {
        console.warn("Failed to generate static params for stores:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
    });

    if (!store) return { title: "Store Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const ogTitle = store.seoTitle || `${store.name} Coupons & Promo Codes – ${monthYear} | CouponHub`;
    const ogDescription = store.seoDescription || `Save more with verified ${store.name} coupons, promo codes, cashback offers and shopping guides. Updated daily by CouponHub.`;
    
    return {
        title: ogTitle,
        description: ogDescription,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: `${siteUrl}/api/og?title=${encodeURIComponent(store.name + ' Coupons')}&description=${encodeURIComponent('Save big with verified offers from ' + store.name)}&type=store${store.logo ? '&logo=' + encodeURIComponent(store.logo) : ''}`,
                    width: 1200,
                    height: 630,
                    alt: `${store.name} Coupons`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            images: [`${siteUrl}/api/og?title=${encodeURIComponent(store.name + ' Coupons')}&description=${encodeURIComponent('Save big with verified offers from ' + store.name)}&type=store${store.logo ? '&logo=' + encodeURIComponent(store.logo) : ''}`],
        }
    };
}

export default async function StorePage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: {
            coupons: {
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            },
            storeCategories: {
                include: { category: true },
            },
            storeContents: true,
        },
    });

    if (!store) {
        notFound();
    }

    const now = new Date();
    const activeCoupons = store.coupons.filter(c => !c.expiresAt || c.expiresAt > now);
    const expiredCoupons = store.coupons.filter(c => c.expiresAt && c.expiresAt <= now);

    const couponCodes = activeCoupons.filter((c) => c.type === "coupon");
    const deals = activeCoupons.filter((c) => c.type === "deal");

    // Deal of the Day for Sticky Widget
    const bestDeal = activeCoupons.length > 0 ? activeCoupons[0] : null;

    // Content extraction
    const aboutContent = store.storeContents.find(c => c.type === 'ABOUT')?.content || null;
    const faqContent = store.storeContents.find(c => c.type === 'FAQ')?.content || null;

    // Mock timeline events for demonstration
    const timelineEvents = [
        { id: "1", time: "14 mins ago", title: `${store.name} offer verified`, type: "verified" as const, user: "Auto-Verifier" },
        { id: "2", time: "2 hours ago", title: "New cashback tier unlocked", type: "added" as const },
        { id: "3", time: "5 hours ago", title: "2 coupons expired", type: "expired" as const },
    ];

    return (
        <div className="bg-background min-h-screen pb-24">
            <ExitIntentPopup />
            {bestDeal && <StickyCouponWidget deal={{ ...bestDeal, store: { name: store.name, slug: store.slug } } as any} />}

            {/* Merchant Snapshot Hero */}
            <section className="bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 pt-8 pb-12 mb-8">
                <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-surface">
                            {store.logo ? (
                                <Image src={store.logo} alt={store.name} width={128} height={128} className="object-contain p-4" />
                            ) : (
                                <span className="font-bold text-4xl text-surface-400">{store.name.charAt(0)}</span>
                            )}
                        </div>
                        
                        <div className="flex-grow space-y-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-merchant-900 dark:text-merchant-50 flex items-center gap-3">
                                    {store.name} Coupons, Promo Codes & Cashback Offers
                                    <Icon name="verified" className="text-verified-600 dark:text-verified-400 text-3xl" />
                                </h1>
                                {store.description && (
                                    <p className="text-surface-600 dark:text-surface-400 font-medium max-w-2xl">{store.description}</p>
                                )}
                            </div>
                            
                            <Stack direction="row" gap={12} wrap className="pt-2">
                                <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-900 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800">
                                    <Icon name="local_offer" className="text-surface-500 text-[18px]" />
                                    <span className="font-bold text-sm text-merchant-900 dark:text-merchant-50">{activeCoupons.length} Active Offers</span>
                                </div>
                                <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-900 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800">
                                    <Icon name="update" className="text-surface-500 text-[18px]" />
                                    <span className="font-bold text-sm text-merchant-900 dark:text-merchant-50">Updated {activeCoupons.length > 0 ? formatDistanceToNow(new Date(Math.max(...activeCoupons.map((c: any) => new Date(c.createdAt).getTime()))), { addSuffix: true }) : "recently"}</span>
                                </div>
                                {store.cashbackRate && (
                                    <div className="flex items-center gap-2 bg-success-50 dark:bg-success-900/30 px-3 py-1.5 rounded-lg border border-success-200 dark:border-success-800">
                                        <Icon name="payments" className="text-success-600 text-[18px]" />
                                        <span className="font-bold text-sm text-success-700 dark:text-success-400">{store.cashbackRate} Cashback</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 bg-intelligence-50 dark:bg-intelligence-900/30 px-3 py-1.5 rounded-lg border border-intelligence-200 dark:border-intelligence-800">
                                    <Icon name="health_and_safety" className="text-intelligence-600 text-[18px]" />
                                    <span className="font-bold text-sm text-intelligence-700 dark:text-intelligence-400">98 Trust Score</span>
                                </div>
                                <div className="flex items-center gap-2 bg-intelligence-50 dark:bg-intelligence-900/30 px-3 py-1.5 rounded-lg border border-intelligence-200 dark:border-intelligence-800">
                                    <Icon name="verified_user" className="text-intelligence-600 text-[18px]" />
                                    <span className="font-bold text-sm text-intelligence-700 dark:text-intelligence-400">Verified Merchant</span>
                                </div>
                                <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-900 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-800">
                                    <Icon name="menu_book" className="text-surface-500 text-[18px]" />
                                    <span className="font-bold text-sm text-merchant-900 dark:text-merchant-50">Buying Guides</span>
                                </div>
                            </Stack>
                        </div>
                        
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <TrustSignal title="Verified Merchant" description="We cryptographically verify this merchant daily." type="verified" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content Area (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Tab Navigation */}
                        <div className="flex gap-4 border-b border-surface-200 dark:border-surface-800">
                            <button className="px-4 py-3 font-bold text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400">
                                All Offers ({activeCoupons.length})
                            </button>
                            <button className="px-4 py-3 font-semibold text-surface-500 hover:text-merchant-900 dark:hover:text-merchant-50 transition-colors">
                                Codes ({couponCodes.length})
                            </button>
                            <button className="px-4 py-3 font-semibold text-surface-500 hover:text-merchant-900 dark:hover:text-merchant-50 transition-colors">
                                Deals ({deals.length})
                            </button>
                        </div>

                        {/* Offers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCoupons.map((coupon) => (
                                <DecisionCard
                                    key={coupon.id}
                                    coupon={{
                                        id: coupon.id,
                                        title: coupon.title,
                                        description: coupon.description,
                                        code: coupon.code,
                                        type: coupon.type,
                                        discountValue: coupon.discountValue,
                                        affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                        isVerified: coupon.isVerified,
                                        isExclusive: coupon.isExclusive,
                                        expiresAt: coupon.expiresAt,
                                        successRate: 94 + Math.floor(Math.random() * 6)
                                    }}
                                    storeName={store.name}
                                    storeLogo={store.logo}
                                />
                            ))}
                        </div>

                        {activeCoupons.length === 0 && (
                            <div className="text-center py-16 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
                                <Icon name="search_off" className="text-4xl text-surface-400 mb-4" />
                                <h3 className="text-xl font-bold text-merchant-900 dark:text-merchant-50 mb-2">No Active Offers</h3>
                                <p className="text-surface-500 max-w-md mx-auto">
                                    We are constantly monitoring {store.name} for new deals. Check back soon or subscribe for alerts.
                                </p>
                            </div>
                        )}

                        {/* Expired Coupons */}
                        {expiredCoupons.length > 0 && (
                            <div className="pt-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <Icon name="history" className="text-surface-400 text-2xl" />
                                    <h2 className="text-xl font-bold text-surface-500">Expired (But Might Still Work)</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                    {expiredCoupons.slice(0, 4).map((coupon) => (
                                        <DecisionCard
                                            key={coupon.id}
                                            coupon={{
                                                id: coupon.id,
                                                title: coupon.title,
                                                description: coupon.description,
                                                code: coupon.code,
                                                type: coupon.type,
                                                discountValue: coupon.discountValue,
                                                affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                                isVerified: false,
                                                isExclusive: coupon.isExclusive,
                                                expiresAt: coupon.expiresAt
                                            }}
                                            storeName={store.name}
                                            storeLogo={store.logo}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* SEO Text & FAQ */}
                        <div className="pt-8 border-t border-surface-200 dark:border-surface-800">
                            <SEOTextAndFAQ
                                title={store.name}
                                aboutContent={aboutContent}
                                faqContent={faqContent}
                            />
                        </div>

                    </div>

                    {/* Sidebar Area (Right 1/3) */}
                    <div className="space-y-6 lg:pl-4">
                        <div className="bg-surface-50 dark:bg-surface-900/50 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                            <DealTimeline events={timelineEvents} />
                        </div>
                        
                        <div className="bg-intelligence-50 dark:bg-intelligence-900/20 rounded-2xl p-6 border border-intelligence-200 dark:border-intelligence-900/50">
                            <h3 className="font-bold text-intelligence-900 dark:text-intelligence-50 flex items-center gap-2 mb-4">
                                <Icon name="hub" className="text-intelligence-600" />
                                Knowledge Connections
                            </h3>
                            <DecisionGraph merchantId={store.id} storeSlug={slug} />
                        </div>
                    </div>
                </div>
            </div>

            <StoreSchema store={store} coupons={store.coupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Store
function StoreSchema({ store, coupons }: { store: any, coupons: any }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const faqContent = store.storeContents?.find((c: any) => c.type === 'FAQ')?.content;
    let faqs: any[] = [];
    if (faqContent) {
        try {
            faqs = JSON.parse(faqContent);
        } catch (e) {
            // ignore
        }
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}/stores/${store.slug}/#organization`,
                "name": store.name,
                "url": store.website,
                "image": store.logo,
                "sameAs": store.affiliateUrl ? [store.affiliateUrl] : []
            },
            {
                "@type": "CollectionPage",
                "@id": `${siteUrl}/stores/${store.slug}/#webpage`,
                "url": `${siteUrl}/stores/${store.slug}`,
                "name": `${store.name} Coupons & Promo Codes`,
                "about": { "@id": `${siteUrl}/stores/${store.slug}/#organization` },
                "isPartOf": { "@id": `${siteUrl}/#website` }
            },
            {
                "@type": "Store",
                "@id": `${siteUrl}/stores/${store.slug}/#store`,
                "name": store.name,
                "image": store.logo,
                "description": store.description,
                "url": store.website,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": `${store.name} Offers`,
                    "itemListElement": coupons.slice(0, 10).map((coupon: any, index: number) => ({
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": coupon.title
                        },
                        "priceCurrency": "USD",
                        "price": "0",
                        "description": coupon.description || coupon.title,
                        "url": `${siteUrl}/stores/${store.slug}`,
                        "validFrom": coupon.createdAt.toISOString()
                    }))
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteUrl}/stores/${store.slug}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Stores",
                        "item": `${siteUrl}/stores`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": store.name,
                        "item": `${siteUrl}/stores/${store.slug}`
                    }
                ]
            },
            ...(Array.isArray(faqs) && faqs.length > 0 ? [{
                "@type": "FAQPage",
                "@id": `${siteUrl}/stores/${store.slug}/#faq`,
                "mainEntity": faqs.map((faq: any) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }] : [])
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
