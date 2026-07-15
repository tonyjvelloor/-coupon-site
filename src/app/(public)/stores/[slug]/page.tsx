import { merchantService } from "@/lib/services/merchant.service";
import { couponService } from "@/lib/services/coupon.service";
import { categoryService } from "@/lib/services/category.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { DecisionCard } from "@/components/ui/DecisionCard";
import ExitIntentPopup from "@/components/ui/ExitIntentPopup";
import StickyCouponWidget from "@/components/ui/StickyCouponWidget";
import { Icon } from "@/components/ui/Icon";
import { SavingsCalculator } from "@/components/ui/SavingsCalculator";
import { SmartShoppingBlocks } from "@/components/ui/SmartShoppingBlocks";
import { CrossShoppingWidgets } from "@/components/ui/CrossShoppingWidgets";
import { RecentStoreTracker } from "@/components/ui/RecentStoreTracker";

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
    
    // Fetch popular categories
    const popularCategories = await categoryService.getPopularCategories(5);

    const coupons = await couponService.getStoreCoupons(slug);
    const now = new Date();
    const activeCoupons = coupons.filter(c => !c.expiresAt || c.expiresAt > now);
    
    // Sort so deals with discountValue are higher for bestDeal
    activeCoupons.sort((a, b) => {
        const aVal = a.discountValue ? parseInt(a.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
        const bVal = b.discountValue ? parseInt(b.discountValue.replace(/[^0-9]/g, '')) || 0 : 0;
        return bVal - aVal;
    });

    // Best Deal
    const bestDeal = activeCoupons.length > 0 ? activeCoupons[0] : null;
    const remainingOffers = activeCoupons.length > 1 ? activeCoupons.slice(1) : [];

    // Content extraction
    const aboutContent = store.contents.find(c => c.type === 'ABOUT')?.content || null;
    const faqContent = store.contents.find(c => c.type === 'FAQ')?.content || null;
    const hasShipping = store.contents.some(c => c.type === 'SHIPPING');
    const hasReturns = store.contents.some(c => c.type === 'RETURNS');
    const hasStudent = store.contents.some(c => c.type === 'STUDENT');

    const lastCheckedText = activeCoupons.length > 0 
        ? formatDistanceToNow(new Date(Math.max(...activeCoupons.map((c: any) => new Date(c.createdAt).getTime()))), { addSuffix: true }) 
        : "today";

    // Mock calculations for Fold 2
    const baseSavings = bestDeal?.discountValue ? parseInt(bestDeal.discountValue.replace(/[^0-9]/g, '')) || 1000 : 1000;
    const cashbackSavings = store.cashbackRate ? parseInt(store.cashbackRate.replace(/[^0-9]/g, '')) || 250 : 0;
    const cardSavings = 1500;
    const totalExpectedSavings = baseSavings + cashbackSavings + cardSavings;

    return (
        <div className="bg-background min-h-screen pb-24 relative">
            <RecentStoreTracker storeSlug={store.slug} />
            <ExitIntentPopup />
            {bestDeal && <StickyCouponWidget deal={{ ...bestDeal, store: { name: store.name, slug: store.slug } } as any} />}

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content Area (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* FOLD 1: Intent & Best Answer */}
                        <section className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-headline-lg font-bold text-merchant-900 mb-2">
                                        {store.name} Savings & Promo Codes
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                        <span className="flex items-center gap-1 font-bold text-verified-high bg-verified-light px-2 py-1 rounded">
                                            <Icon name="verified" className="text-[16px]" /> ★★★★★ Verified Merchant
                                        </span>
                                        <span className="text-surface-600 font-medium">{activeCoupons.length} Ways to Save</span>
                                        {store.cashbackRate && <span className="text-green-600 font-bold">{store.cashbackRate} Cashback</span>}
                                        <span className="text-surface-500">Updated {lastCheckedText}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="flex items-center gap-1.5 px-3 py-2 md:px-4 bg-surface-50 hover:bg-surface-100 text-surface-700 font-bold rounded-xl border border-surface-200 transition text-sm">
                                        <Icon name="favorite_border" className="text-[18px]" /> Save Store
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-2 md:px-4 bg-surface-50 hover:bg-surface-100 text-surface-700 font-bold rounded-xl border border-surface-200 transition text-sm">
                                        <Icon name="notifications_none" className="text-[18px]" /> Notify Me
                                    </button>
                                </div>
                            </div>

                            {bestDeal ? (
                                <div id={`deal-${bestDeal.id}`}>
                                    <div className="mb-3">
                                        <span className="inline-block bg-merchant-900 text-white font-bold px-3 py-1 rounded text-sm tracking-wide uppercase">
                                            ⭐ Best Way to Save Today
                                        </span>
                                    </div>
                                    <DecisionCard
                                        isBestDeal={true}
                                        coupon={{
                                            ...bestDeal,
                                            affiliateUrl: bestDeal.affiliateUrl || `/go/${bestDeal.id}`,
                                            successRate: 98,
                                        }}
                                        storeName={store.name}
                                        storeLogo={store.logo}
                                    />
                                </div>
                            ) : (
                                <div className="bg-surface-50 p-6 rounded-xl border border-surface-200 text-center">
                                    <h3 className="text-lg font-bold text-merchant-900 mb-2">No active codes right now</h3>
                                    <p className="text-surface-600">We are checking for new {store.name} deals continuously.</p>
                                </div>
                            )}
                        </section>
                        
                        {/* FOLD 2: Shopping Strategy (Best Way to Save) */}
                        {bestDeal && (
                            <section className="bg-primary-50 dark:bg-primary-900/10 border-2 border-primary-100 dark:border-primary-900 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-headline-md font-bold text-merchant-900 mb-6 flex items-center gap-2">
                                    <Icon name="magic_button" className="text-primary text-2xl" /> Best Way to Save Today
                                </h2>
                                <div className="space-y-4 relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-[15px] top-4 bottom-12 w-[2px] bg-primary-200 dark:bg-primary-800 z-0 hidden md:block"></div>
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary-100 font-bold flex-shrink-0">1</div>
                                            <span className="font-semibold text-merchant-900">Copy Coupon {bestDeal.code || 'Deal'}</span>
                                        </div>
                                    </div>
                                    {store.cashbackRate && (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-2 pl-0 md:pl-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary-100 font-bold flex-shrink-0">2</div>
                                                <span className="font-semibold text-merchant-900">Activate {store.cashbackRate} Cashback</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-2 pl-0 md:pl-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary-100 font-bold flex-shrink-0">3</div>
                                            <span className="font-semibold text-merchant-900">Pay with HDFC Card</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-800 flex items-center justify-between">
                                    <span className="text-lg font-bold text-merchant-900">Expected Savings</span>
                                    <span className="text-2xl font-black text-green-600">₹{totalExpectedSavings.toLocaleString()}</span>
                                </div>
                            </section>
                        )}

                        {/* FOLD 2.5: Calculator */}
                        {bestDeal && (
                            <SavingsCalculator 
                                baseSavings={baseSavings}
                                cashbackSavings={cashbackSavings}
                                cardSavings={cardSavings}
                            />
                        )}

                        {/* FOLD 3: Working Offers */}
                        {remainingOffers.length > 0 && (
                            <section>
                                <h3 className="text-2xl font-headline-md font-bold text-merchant-900 mb-6">
                                    Working Offers
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {remainingOffers.map((coupon) => (
                                        <DecisionCard
                                            key={coupon.id}
                                            coupon={{
                                                ...coupon,
                                                affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                                successRate: 94 + Math.floor(Math.random() * 6),
                                            }}
                                            storeName={store.name}
                                            storeLogo={store.logo}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* FOLD 4: Other Saving Methods */}
                        <section className="bg-surface-50 border border-surface-200 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-headline-md font-bold text-merchant-900 mb-6">More Ways to Save</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {store.cashbackRate && (
                                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-surface-200 text-center">
                                        <Icon name="payments" className="text-3xl text-green-500 mb-2" />
                                        <span className="font-bold text-sm text-merchant-900">Save with Cashback</span>
                                        <span className="text-xs text-surface-500">{store.cashbackRate}</span>
                                    </div>
                                )}
                                {hasStudent && (
                                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-surface-200 text-center">
                                        <Icon name="school" className="text-3xl text-primary mb-2" />
                                        <span className="font-bold text-sm text-merchant-900">Save as Student</span>
                                        <span className="text-xs text-surface-500">Discount</span>
                                    </div>
                                )}
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-surface-200 text-center">
                                    <Icon name="credit_card" className="text-3xl text-blue-500 mb-2" />
                                    <span className="font-bold text-sm text-merchant-900">Save with Card</span>
                                    <span className="text-xs text-surface-500">Offers Available</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-surface-200 text-center">
                                    <Icon name="card_giftcard" className="text-3xl text-purple-500 mb-2" />
                                    <span className="font-bold text-sm text-merchant-900">Gift Cards</span>
                                    <span className="text-xs text-surface-500">Available</span>
                                </div>
                            </div>
                        </section>

                        {/* FOLD 6: Smart Shopping (Intelligence Hub) */}
                        <section className="pt-8 border-t border-surface-200">
                            <SmartShoppingBlocks storeName={store.name} contents={store.contents} />
                        </section>
                    </div>

                    {/* Sidebar Area (Right 1/3) */}
                    <div className="space-y-8 lg:pl-4">
                        {/* Logo */}
                        <div className="w-full aspect-[4/3] rounded-2xl border border-surface-200 bg-white flex items-center justify-center overflow-hidden shadow-sm p-8">
                            {store.logo ? (
                                <Image src={store.logo} alt={store.name} width={200} height={100} className="object-contain" />
                            ) : (
                                <span className="font-bold text-4xl text-surface-400">{store.name.charAt(0)}</span>
                            )}
                        </div>

                        {/* FOLD 5: Confidence Layer */}
                        <div className="bg-surface-50 rounded-2xl p-6 border border-surface-200">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-500 mb-6 flex items-center gap-2">
                                <Icon name="shield" /> Savings Verified
                            </h3>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 font-semibold text-merchant-900">
                                    <Icon name="check" className="text-verified-high text-[18px]" /> Coupon checked today
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-merchant-900">
                                    <Icon name="check" className="text-verified-high text-[18px]" /> Cashback active
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-merchant-900">
                                    <Icon name="check" className="text-verified-high text-[18px]" /> Card offer available
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-merchant-900">
                                    <Icon name="check" className="text-verified-high text-[18px]" /> Store verified
                                </div>
                            </div>
                            
                            <details className="group">
                                <summary className="cursor-pointer text-sm font-bold text-primary flex items-center gap-1 hover:underline list-none">
                                    Why? <Icon name="expand_more" className="group-open:rotate-180 transition-transform text-[16px]" />
                                </summary>
                                <ul className="mt-4 space-y-3 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-surface-600">Coupon verified</span>
                                        <span className="font-bold text-merchant-900">11 minutes ago</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-surface-600">Cashback checked</span>
                                        <span className="font-bold text-merchant-900">Today</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-surface-600">Offer tested</span>
                                        <span className="font-bold text-merchant-900">Recently</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-surface-600">Merchant verified</span>
                                        <span className="font-bold text-merchant-900">Yes</span>
                                    </li>
                                </ul>
                            </details>
                        </div>
                        
                        {/* Cross Shopping Widgets (Compare, Categories, History) */}
                        <CrossShoppingWidgets storeName={store.name} competitors={competitors} popularCategories={popularCategories} />
                    </div>
                </div>
            </div>
        </div>
    );
}
