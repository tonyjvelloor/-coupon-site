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

// Store Composition Modules
import { StoreHero } from "@/components/modules/store/StoreHero";
import { SavingsStrategy } from "@/components/modules/store/SavingsStrategy";
import { OfferFeed } from "@/components/modules/store/OfferFeed";
import { AdditionalSavings } from "@/components/modules/store/AdditionalSavings";
import { TrustCenter } from "@/components/modules/store/TrustCenter";
import { ShoppingGuide } from "@/components/modules/store/ShoppingGuide";
import { DiscoveryRail } from "@/components/modules/store/DiscoveryRail";

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

    return (
        <div className="bg-background min-h-screen pb-24 relative">
            <RecentStoreTracker storeSlug={store.slug} />
            <ExitIntentPopup />
            <StickyStoreAssistant storeSlug={store.slug} storeName={store.name} />

            {/* STAGE 1: Immediate Answer (Hero) */}
            <StoreHero store={store} activeCoupons={activeCoupons} bestDeal={bestDeal} />

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* STAGE 2: Savings Strategy Pipeline */}
                        <SavingsStrategy store={store} bestDeal={bestDeal} />

                        {/* STAGE 3: Active Offers */}
                        <OfferFeed store={store} offers={remainingOffers} />
                        
                        {/* STAGE 4: More Savings Available */}
                        <AdditionalSavings store={store} hasStudent={hasStudent} />

                        {/* STAGE 6: Smart Shopping */}
                        <ShoppingGuide storeName={store.name} contents={store.contents} />

                        {/* STAGE 7: Discovery */}
                        <DiscoveryRail competitors={competitors} />
                        
                    </div>

                    {/* Sidebar Area (Right 1/3) */}
                    <div className="space-y-8 lg:pl-4">
                        {/* STAGE 5: Evidence-Based Trust */}
                        <TrustCenter storeName={store.name} lastCheckedText={lastCheckedText} />
                    </div>
                </div>
            </div>
        </div>
    );
}
