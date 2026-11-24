import { merchantService } from "@/lib/services/merchant.service";
import { couponService } from "@/lib/services/coupon.service";
import { categoryService } from "@/lib/services/category.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getCurrentMonthYear, getSiteUrl, refreshSeoDate, cleanSeoTitle } from "@/lib/seo-utils";
import { cleanCouponCode, formatDiscountBadge, rankCoupons } from "@/lib/coupon-ranking";

// Global Shared Components
import { RecentStoreTracker } from "@/components/ui/RecentStoreTracker";
import { StickyStoreAssistant } from "@/components/ui/StickyStoreAssistant";
import { ScrollTracker } from "@/components/ui/ScrollTracker";

// Store Composition Modules
import { StoreHero } from "@/components/modules/store/StoreHero";
import { ShoppingIntelligenceSummary } from "@/components/modules/store/ShoppingIntelligenceSummary";
import { SavingsStrategy } from "@/components/modules/store/SavingsStrategy";
import { OfferFeed } from "@/components/modules/store/OfferFeed";
import { AdditionalSavings } from "@/components/modules/store/AdditionalSavings";
import dynamic from "next/dynamic";

const TrustCenter = dynamic(() => import("@/components/modules/store/TrustCenter").then(mod => mod.TrustCenter), { ssr: true });
const ShoppingGuide = dynamic(() => import("@/components/modules/store/ShoppingGuide").then(mod => mod.ShoppingGuide), { ssr: true });
const DiscoveryRail = dynamic(() => import("@/components/modules/store/DiscoveryRail").then(mod => mod.DiscoveryRail), { ssr: true });
const BankOffers = dynamic(() => import("@/components/modules/store/BankOffers").then(mod => mod.BankOffers), { ssr: true });
const ShoppingTips = dynamic(() => import("@/components/modules/store/ShoppingTips").then(mod => mod.ShoppingTips), { ssr: true });
const StoreFAQSection = dynamic(() => import("@/components/modules/store/StoreFAQSection").then(mod => mod.StoreFAQSection), { ssr: true });

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        const stores = await merchantService.getAllStoreSlugs(50);
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
    let store: any = null;
    try {
        store = await merchantService.getMerchantBySlug(slug);
    } catch (e) {
        // Fallback
    }

    if (!store) return { title: "Store Coupon Codes & Deals" };

    const siteUrl = getSiteUrl();
    const { shortMonthYear, fullMonthYear } = getCurrentMonthYear();
    
    const offerLabel = store.activeOfferCount && store.activeOfferCount > 0 ? `${store.activeOfferCount} Verified Deals` : 'Verified Deals';
    
    const rawTitle = store.seoTitle 
        ? store.seoTitle 
        : `${store.name} Coupon Code (${shortMonthYear}): ${offerLabel}`;
    const ogTitle = cleanSeoTitle(rawTitle);

    const cashbackSnippet = store.cashbackRate ? `Earn ${store.cashbackRate} Cashback & ` : '';
    const rawDescription = store.seoDescription || `${cashbackSnippet}Save big with 100% verified ${store.name} coupon codes and promo codes for ${fullMonthYear}. Tested today by CouponHub.`;
    const ogDescription = refreshSeoDate(rawDescription);


    const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&type=store${store.logo ? `&logo=${encodeURIComponent(store.logo)}` : ''}`;

    return {
        title: ogTitle,
        description: ogDescription,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: `${siteUrl}/stores/${store.slug}`,
            siteName: "CouponHub",
            type: "website",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: ogTitle,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [ogImageUrl],
        },
        robots: (store.activeOfferCount && store.activeOfferCount > 0) ? { index: true, follow: true } : { index: false, follow: true }
    };
}

export default async function StorePage({ params }: PageProps) {
    const { slug } = await params;
    const store = await merchantService.getMerchantBySlug(slug);

    if (!store) {
        notFound();
    }
    
    // Fetch competitors
    const categoryIds = store.categories.map((c: any) => c.id);
    const competitors = await merchantService.getCompetitors(store.id, categoryIds, 6);
    
    // Fetch hub knowledge sections
    const bankOffers = await merchantService.getStoreBankOffers(store.id);
    const shoppingTips = await merchantService.getStoreShoppingTips(categoryIds);
    
    // Fetch coupons (prioritizing unexpired active offers with resilient ranking)
    const coupons = await couponService.getStoreCoupons(slug);
    const rankedCoupons = rankCoupons(coupons);
    const activeCoupons = rankedCoupons.map((c) => ({
        ...c,
        discountValue: c._formattedDiscount,
    }));

    const bestDeal = activeCoupons.length > 0 ? activeCoupons[0] : null;
    const summaryRows = activeCoupons.slice(0, 5);
    const hasStudent = store.contents.some(c => c.type === 'STUDENT');

    const lastCheckedText = activeCoupons.length > 0 
        ? formatDistanceToNow(new Date(Math.max(...activeCoupons.map((c: any) => new Date(c.createdAt).getTime()))), { addSuffix: true }) 
        : "today";

    const bestBankOffer = bankOffers.length > 0 ? bankOffers[0].discountValue : undefined;

    // Factual, Category-Aware FAQs
    const shippingContent = store.contents.find((c: any) => c.type === 'SHIPPING')?.content;
    const returnsContent = store.contents.find((c: any) => c.type === 'RETURNS')?.content;
    const customFaqStr = store.contents.find((c: any) => c.type === 'FAQ')?.content;
    
    let customFaqs: { question: string; answer: string }[] = [];
    if (customFaqStr) {
        try {
            const parsed = JSON.parse(customFaqStr);
            if (Array.isArray(parsed)) {
                customFaqs = parsed;
            }
        } catch {}
    }

    const defaultFaqs = [
        {
            question: `How do I redeem a verified ${store.name} coupon on CouponHub?`,
            answer: `Find the ${store.name} coupon or deal you want on this page. Click 'Activate Deal' or 'Copy Code'. If a promo code is displayed, copy and paste it into the coupon code box during checkout on the ${store.name} website or app. For activated deals, your discount is applied automatically.`
        },
        {
            question: `What is the biggest discount available for ${store.name} in India today?`,
            answer: bestDeal?.discountValue 
                ? `Today, the highest verified discount available for ${store.name} on CouponHub is ${bestDeal.discountValue}. Our coupon catalog is refreshed daily to ensure validity.`
                : `Discounts for ${store.name} change regularly based on ongoing seasonal campaigns. Check back frequently for the newest verified vouchers.`
        },
        {
            question: `Can I combine bank offers with ${store.name} promo codes?`,
            answer: bankOffers.length > 0
                ? `Yes, ${store.name} currently features ${bankOffers.length} bank and wallet offers. Many merchants allow stacking instant card discounts (e.g., HDFC, ICICI, SBI, Axis Bank) on top of promo codes if your cart meets the minimum purchase threshold.`
                : `Many online stores in India allow combining credit or debit card discounts (such as HDFC, ICICI, SBI, or Axis Bank) with coupon codes, provided your cart value satisfies the bank's promotional criteria.`
        },
        {
            question: `How does CouponHub verify ${store.name} coupons?`,
            answer: `CouponHub verifies ${store.name} promo codes and discounts directly through merchant affiliate feeds, official partnerships, and regular checkout testing. Expired or non-functional codes are promptly removed.`
        }
    ];

    if (shippingContent) {
        defaultFaqs.push({
            question: `Does ${store.name} offer free shipping in India?`,
            answer: shippingContent
        });
    }

    if (returnsContent) {
        defaultFaqs.push({
            question: `What is the return and refund policy for ${store.name}?`,
            answer: returnsContent
        });
    }

    // Deduplicate questions between default and stored FAQs
    const existingQuestions = new Set(defaultFaqs.map(f => f.question.toLowerCase().trim()));
    const additionalFaqs = customFaqs.filter(f => !existingQuestions.has(f.question.toLowerCase().trim()));
    const allFaqs = [...defaultFaqs, ...additionalFaqs];

    return (
        <div className="bg-background min-h-screen pb-24 relative">
            <ScrollTracker />
            <RecentStoreTracker storeSlug={store.slug} />
            <StickyStoreAssistant storeSlug={store.slug} storeName={store.name} />

            {/* STAGE 1: Immediate Answer (Hero) */}
            <StoreHero store={store} activeCoupons={activeCoupons} bestDeal={bestDeal} lastCheckedText={lastCheckedText} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
                
                <ShoppingIntelligenceSummary 
                    storeName={store.name}
                    bestCouponValue={bestDeal?.discountValue || undefined}
                    bestCashbackValue={store.cashbackRate || undefined}
                    bestBankOfferValue={bestBankOffer}
                />

                {/* STAGE 2: Savings Strategy Pipeline */}
                <SavingsStrategy store={store} bestDeal={bestDeal} />

                {/* STAGE 3: Active Offers */}
                <OfferFeed store={store} offers={activeCoupons} />

                {/* SEO & AI Overview Scannable Summary Table */}
                {summaryRows.length > 0 && (
                    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                            Top {store.name} Coupons &amp; Promo Codes Summary ({getCurrentMonthYear().fullMonthYear})
                        </h2>
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
                                    <th className="py-2.5 pr-4">Offer</th>
                                    <th className="py-2.5 pr-4">Savings</th>
                                    <th className="py-2.5 pr-4">Code</th>
                                    <th className="py-2.5 text-right">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {summaryRows.map((c) => {
                                    const code = cleanCouponCode(c.code);
                                    return (
                                        <tr key={`summary-${c.id}`}>
                                            <td className="py-2.5 pr-4 text-slate-800 dark:text-slate-200 font-medium">
                                                {c.title}
                                            </td>
                                            <td className="py-2.5 pr-4 font-bold text-brand-emerald whitespace-nowrap">
                                                {formatDiscountBadge(c.discountValue, c.discountType, c.title)}
                                            </td>
                                            <td className="py-2.5 pr-4 font-mono font-bold text-brand-indigo whitespace-nowrap">
                                                {code || "No code needed"}
                                            </td>
                                            <td className="py-2.5 text-right text-xs text-slate-500 whitespace-nowrap">
                                                {code ? "Promo Code" : "Instant Deal"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}
                
                {/* STAGE 4: More Savings Available */}
                <div className="space-y-12">
                    <AdditionalSavings store={store} hasStudent={hasStudent} />
                    <BankOffers storeSlug={store.slug} offers={bankOffers} />
                </div>

                {/* STAGE 5 & 6: Smart Shopping, Trust & FAQ */}
                <div id="shopping-guide" className="scroll-mt-24 space-y-12">
                    <ShoppingTips storeSlug={store.slug} tips={shoppingTips} />
                    <TrustCenter storeName={store.name} lastCheckedText={lastCheckedText} activeCouponsCount={activeCoupons.length} cashbackRate={store.cashbackRate} />
                    <ShoppingGuide storeName={store.name} storeSlug={store.slug} bestDeal={bestDeal} contents={store.contents} />
                    <StoreFAQSection storeName={store.name} faqs={allFaqs} />
                </div>

                {/* STAGE 7: Discovery */}
                <DiscoveryRail competitors={competitors} currentStoreSlug={store.slug} />
                
            </div>
            
            <StoreSchema store={store} coupons={activeCoupons} faqs={allFaqs} />
        </div>
    );
}


// Helper to generate JSON-LD for Store
function StoreSchema({ store, coupons, faqs = [] }: { store: any, coupons: any[], faqs?: any[] }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";
    
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${store.name} Coupons & Promo Codes`,
        description: store.seoDescription || store.description || `Best coupons and offers for ${store.name}`,
        url: `${siteUrl}/stores/${store.slug}`,
        mainEntity: {
            "@type": "ItemList",
            name: `${store.name} Offers`,
            numberOfItems: coupons.length,
            itemListElement: coupons.slice(0, 15).map((coupon: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Offer",
                    name: coupon.title,
                    description: coupon.description || coupon.title,
                    priceCurrency: "INR",
                    price: "0",
                    category: coupon.code ? "Promo Code" : "Deal",
                    availability: "https://schema.org/InStock",
                    areaServed: {
                        "@type": "Country",
                        name: "India",
                        identifier: "IN"
                    },
                    url: `${siteUrl}/stores/${store.slug}`
                }
            }))
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: store.name,
        url: store.website,
        logo: store.logo || `${siteUrl}/logo.jpg`,
        areaServed: "IN",
    };

    const merchantSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: store.name,
        url: store.website,
        image: store.logo || `${siteUrl}/logo.jpg`,
        description: store.description,
        areaServed: {
            "@type": "Country",
            name: "India"
        },
        ...(coupons.length > 0 ? {
            offers: {
                "@type": "AggregateOffer",
                offerCount: coupons.length,
                priceCurrency: "INR",
                lowPrice: 0,
                highPrice: 0
            }
        } : {})
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${store.name} Coupons & Promo Codes`,
        url: `${siteUrl}/stores/${store.slug}`,
        inLanguage: "en-IN",
        isPartOf: {
            "@type": "WebSite",
            name: "CouponHub",
            url: siteUrl,
        },
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", ".ai-store-summary"],
        },
    };

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

    const faqSchema = {
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />
            {faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
