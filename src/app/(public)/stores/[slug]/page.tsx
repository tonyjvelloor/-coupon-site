import { merchantService } from "@/lib/services/merchant.service";
import { couponService } from "@/lib/services/coupon.service";
import { categoryService } from "@/lib/services/category.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

// Global Shared Components
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import { RecentStoreTracker } from "@/components/ui/RecentStoreTracker";
import { StickyStoreAssistant } from "@/components/ui/StickyStoreAssistant";
import { ScrollTracker } from "@/components/ui/ScrollTracker";

// Store Composition Modules
import { StoreHero } from "@/components/modules/store/StoreHero";
import { ShoppingIntelligenceSummary } from "@/components/modules/store/ShoppingIntelligenceSummary";
import { SavingsStrategy } from "@/components/modules/store/SavingsStrategy";
import { OfferFeed } from "@/components/modules/store/OfferFeed";
import { AdditionalSavings } from "@/components/modules/store/AdditionalSavings";
import { TrustCenter } from "@/components/modules/store/TrustCenter";
import { ShoppingGuide } from "@/components/modules/store/ShoppingGuide";
import { DiscoveryRail } from "@/components/modules/store/DiscoveryRail";
import { BankOffers } from "@/components/modules/store/BankOffers";
import { ShoppingTips } from "@/components/modules/store/ShoppingTips";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        const stores = await merchantService.getAllStoreSlugs();
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
    const store = await merchantService.getMerchantBySlug(slug);

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
    const competitors = await merchantService.getCompetitors(store.id, categoryIds, 3);
    
    // Fetch hub knowledge sections
    const bankOffers = await merchantService.getStoreBankOffers(store.id);
    const shoppingTips = await merchantService.getStoreShoppingTips(categoryIds);
    
    // Fetch coupons and filter active
    const coupons = await couponService.getStoreCoupons(slug);
    const now = new Date();
    const activeCoupons = coupons.filter(c => !c.expiresAt || c.expiresAt > now);
    
    // Sort so deals with discountValue are higher for bestDeal
    activeCoupons.sort((a, b) => {
        const aVal = a.discountValue ? parseInt(a.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
        const bVal = b.discountValue ? parseInt(b.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
        return bVal - aVal;
    });

    const bestDeal = activeCoupons.length > 0 ? activeCoupons[0] : null;
    const remainingOffers = activeCoupons.length > 1 ? activeCoupons.slice(1) : [];
    const hasStudent = store.contents.some(c => c.type === 'STUDENT');

    const lastCheckedText = activeCoupons.length > 0 
        ? formatDistanceToNow(new Date(Math.max(...activeCoupons.map((c: any) => new Date(c.createdAt).getTime()))), { addSuffix: true }) 
        : "today";

    const bestBankOffer = bankOffers.length > 0 ? bankOffers[0].discountValue : undefined;

    return (
        <div className="bg-background min-h-screen pb-24 relative">
            <ScrollTracker />
            <RecentStoreTracker storeSlug={store.slug} />
            <ExitIntentPopup />
            <StickyStoreAssistant storeSlug={store.slug} storeName={store.name} />

            {/* STAGE 1: Immediate Answer (Hero) */}
            <StoreHero store={store} activeCoupons={activeCoupons} bestDeal={bestDeal} />

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
                <OfferFeed store={store} offers={remainingOffers} />
                
                {/* STAGE 4: More Savings Available */}
                <div className="space-y-12">
                    <AdditionalSavings store={store} hasStudent={hasStudent} />
                    <BankOffers storeSlug={store.slug} offers={bankOffers} />
                </div>

                {/* STAGE 5 & 6: Smart Shopping & Trust */}
                <div id="shopping-guide" className="scroll-mt-24 space-y-12">
                    <ShoppingTips storeSlug={store.slug} tips={shoppingTips} />
                    <TrustCenter storeName={store.name} lastCheckedText={lastCheckedText} activeCouponsCount={activeCoupons.length} />
                    <ShoppingGuide storeName={store.name} contents={store.contents} />
                </div>

                {/* STAGE 7: Discovery */}
                <DiscoveryRail competitors={competitors} />
                
            </div>
            
            <StoreSchema store={store} coupons={activeCoupons} />
        </div>
    );
}


// Helper to generate JSON-LD for Store
function StoreSchema({ store, coupons }: { store: any, coupons: any[] }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${store.name} Coupons & Promo Codes`,
        description: store.seoDescription || store.description || `Best coupons and offers for ${store.name}`,
        url: `${siteUrl}/stores/${store.slug}`,
        hasPart: {
            "@type": "ItemList",
            name: `${store.name} Offers`,
            itemListElement: coupons.slice(0, 10).map((coupon: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: coupon.title
                    },
                    priceCurrency: "USD",
                    price: "0",
                    description: coupon.description || coupon.title,
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
        logo: store.logo || `${siteUrl}/logo.png`,
    };

    const merchantSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: store.name,
        url: store.website,
        image: store.logo || `${siteUrl}/logo.png`,
        description: store.description
    };

    let faqSchema = null;
    const faqContent = store.contents?.find((c: any) => c.type === 'FAQ')?.content;
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
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
