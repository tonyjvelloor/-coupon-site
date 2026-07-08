import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import InternalLinks from "@/components/ui/InternalLinks";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import StickyCouponWidget from "@/components/ui/StickyCouponWidget";

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
    const shippingInfo = store.storeContents.find(c => c.type === 'SHIPPING')?.content || null;
    const returnPolicy = store.storeContents.find(c => c.type === 'RETURNS')?.content || null;
    const paymentMethods = store.storeContents.find(c => c.type === 'PAYMENTS')?.content || null;
    const studentDiscounts = store.storeContents.find(c => c.type === 'STUDENT')?.content || null;

    return (
        <div className="space-y-8">
            <ExitIntentPopup />
            {bestDeal && <StickyCouponWidget deal={bestDeal as any} />}


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
                            aboutContent={aboutContent}
                            faqContent={faqContent}
                        />

                        {/* Internal Links Engine */}
                        <div className="mt-16">
                            <InternalLinks currentStoreSlug={slug} />
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

    const faqContent = store.storeContents?.find((c: any) => c.type === 'FAQ')?.content;
    let faqSchema = null;
    if (faqContent) {
        try {
            const faqs = JSON.parse(faqContent);
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
