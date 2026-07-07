import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Store as StoreIcon,
    ExternalLink,
    ChevronRight,
    Home,
} from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";
import { AdBannerSidebar } from "@/components/ui/AdBanner";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import InternalLinks from "@/components/ui/InternalLinks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TrendingWidget from "@/components/ui/TrendingWidget";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import StickyCouponWidget from "@/components/ui/StickyCouponWidget";
import { Info, Truck, RefreshCw, CreditCard, GraduationCap, Clock } from "lucide-react";

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
    const ogTitle = store.seoTitle || `${store.name} Coupons & Promo Codes`;
    const ogDescription = store.seoDescription || `Get the latest ${store.name} coupons, promo codes, and deals. Save up to ${store.cashbackRate || "80%"} with verified offers.`;
    
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

    return (
        <div>
            <Breadcrumbs items={[
                { name: "Stores", href: "/stores" },
                { name: store.name }
            ]} />

            <ExitIntentPopup />
            {bestDeal && <StickyCouponWidget deal={bestDeal as any} />}

            {/* Store Header */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                            {store.logo ? (
                                <img
                                    src={store.logo}
                                    alt={store.name}
                                    className="w-20 h-20 object-contain"
                                />
                            ) : (
                                <StoreIcon className="w-12 h-12 text-gray-400" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {store.name} Coupons & Promo Codes
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {store.description ||
                                    `Get the best ${store.name} coupons and deals with verified offers.`}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                {store.cashbackRate && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {store.cashbackRate} Cashback
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                                    {store.coupons.length} Offers
                                </span>
                                {store.storeCategories.map((sc) => (
                                    <Link
                                        key={sc.id}
                                        href={`/category/${sc.category.slug}`}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-violet-100 hover:text-violet-600 transition-colors"
                                    >
                                        {sc.category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div>
                            <a
                                href={store.affiliateUrl || store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                Visit Store
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs and Coupons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tab Navigation */}
                        <div className="flex gap-4 border-b border-gray-200 mb-6">
                            <button className="px-4 py-3 font-medium text-violet-600 border-b-2 border-violet-600">
                                All ({activeCoupons.length})
                            </button>
                            <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                                Coupons ({couponCodes.length})
                            </button>
                            <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                                Deals ({deals.length})
                            </button>
                        </div>

                        {/* Coupons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeCoupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    coupon={coupon as any}
                                    storeName={store.name}
                                    storeLogo={store.logo}
                                />
                            ))}
                        </div>

                        {activeCoupons.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">
                                    No coupons available for this store right now.
                                </p>
                            </div>
                        )}

                        {/* Expired Coupons */}
                        {expiredCoupons.length > 0 && (
                            <div className="mt-12 mb-12">
                                <h2 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2 border-t pt-8">
                                    <Clock className="w-5 h-5" /> Expired (But Might Still Work)
                                </h2>
                                <div className="space-y-4 opacity-70 grayscale">
                                    {expiredCoupons.map((coupon) => (
                                        <CouponCard
                                            key={coupon.id}
                                            coupon={coupon as any}
                                            storeName={store.name}
                                            storeLogo={store.logo}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SEO Text & FAQ */}
                        <SEOTextAndFAQ
                            title={store.name}
                            aboutContent={store.aboutContent}
                            faqContent={store.faqContent}
                        />

                        {/* Internal Links Engine */}
                        <div className="mt-16">
                            <InternalLinks currentStoreSlug={slug} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Store Info Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Store Info</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Website</dt>
                                        <dd>
                                            <a
                                                href={store.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:underline"
                                            >
                                                Visit
                                            </a>
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Total Offers</dt>
                                        <dd className="font-medium">{store.coupons.length}</dd>
                                    </div>
                                    {store.cashbackRate && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Cashback</dt>
                                            <dd className="font-medium text-green-600">
                                                {store.cashbackRate}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* How to Use */}
                            <div className="bg-violet-50 rounded-xl p-5">
                                <h3 className="font-semibold text-violet-900 mb-3">
                                    How to Use Coupons
                                </h3>
                                <ol className="space-y-2 text-sm text-violet-800">
                                    <li className="flex gap-2">
                                        <span className="font-bold">1.</span>
                                        <span>Click on &quot;Show Coupon Code&quot; or &quot;Get Deal&quot;</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">2.</span>
                                        <span>Copy the code (if applicable)</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">3.</span>
                                        <span>Paste at checkout on {store.name}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">4.</span>
                                        <span>Enjoy your savings!</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="lg:w-1/3">
                                <div className="sticky top-6 space-y-6">
                                    <TrendingWidget />
                                    <AdBannerSidebar />
                                    
                                    {/* Merchant Authority Box */}
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-4 text-lg">About {store.name}</h3>
                                        {store.shippingInfo && (
                                            <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                                <Truck className="w-5 h-5 text-gray-400 shrink-0" />
                                                <div>
                                                    <strong className="block text-gray-900">Shipping</strong>
                                                    {store.shippingInfo}
                                                </div>
                                            </div>
                                        )}
                                        {store.returnPolicy && (
                                            <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                                <RefreshCw className="w-5 h-5 text-gray-400 shrink-0" />
                                                <div>
                                                    <strong className="block text-gray-900">Returns</strong>
                                                    {store.returnPolicy}
                                                </div>
                                            </div>
                                        )}
                                        {store.paymentMethods && (
                                            <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                                <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                                                <div>
                                                    <strong className="block text-gray-900">Payment Methods</strong>
                                                    {store.paymentMethods}
                                                </div>
                                            </div>
                                        )}
                                        {store.studentDiscounts && (
                                            <div className="flex gap-3 text-sm text-gray-600">
                                                <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
                                                <div>
                                                    <strong className="block text-gray-900">Student Discount</strong>
                                                    {store.studentDiscounts}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <StoreSchema store={store} coupons={store.coupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Store
function StoreSchema({ store, coupons }: { store: any, coupons: any }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: store.name,
        image: store.logo,
        description: store.description,
        url: store.website,
        sameAs: store.affiliateUrl ? [store.affiliateUrl] : [],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${store.name} Offers`,
            itemListElement: coupons.slice(0, 10).map((coupon: any, index: number) => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: coupon.title
                },
                priceCurrency: "USD",
                price: "0",
                description: coupon.description || coupon.title,
                url: `${siteUrl}/stores/${store.slug}`,
                validFrom: coupon.createdAt.toISOString()
            }))
        }
    };

    let faqSchema = null;
    if (store.faqContent) {
        try {
            const faqs = JSON.parse(store.faqContent);
            if (Array.isArray(faqs) && faqs.length > 0) {
                faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((faq: any) => ({
                        "@type": "Question",
                        name: faq.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: faq.answer
                        }
                    }))
                };
            }
        } catch (e) {
            // ignore JSON parse errors
        }
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Stores",
                item: `${siteUrl}/stores`
            },
            {
                "@type": "ListItem",
                position: 3,
                name: store.name,
                item: `${siteUrl}/stores/${store.slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
