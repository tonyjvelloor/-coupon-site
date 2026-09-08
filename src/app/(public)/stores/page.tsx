import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import StoresDirectoryClient from "./StoresDirectoryClient";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "All Stores Directory - Verified Partner Stores & Cashback Offers",
    description:
        "Browse India's top shopping destinations. Get tested coupon codes, exclusive cashback up to 25%, and glitch deals updated every morning.",
};

async function getStoresData() {
    const stores = await prisma.store.findMany({
        where: { activeOfferCount: { gt: 0 } },
        orderBy: { name: "asc" },
        include: {
            storeCategories: {
                include: {
                    category: true
                }
            }
        }
    });

    return stores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        logo: store.logo,
        cashbackRate: store.cashbackRate,
        offerCount: store.activeOfferCount,
        description: store.description,
        primaryCategory: store.storeCategories?.[0]?.category?.name || 'Retail',
        isFeatured: store.isFeatured
    }));
}

async function getCategoriesData() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: {
            id: true,
            name: true,
            slug: true
        }
    });
    return categories;
}

export default async function StoresPage() {
    const [stores, categories] = await Promise.all([getStoresData(), getCategoriesData()]);

    return (
        <div className="flex flex-col w-full bg-surface-page min-h-screen">
            {/* Top Breadcrumb & Stat Banner Bar */}
            <section className="w-full bg-surface-container-low py-space-sm">
                <div className="max-w-max-width mx-auto px-gutter-desktop flex flex-wrap items-center justify-between gap-space-sm text-body-sm text-text-muted">
                    <nav className="flex items-center gap-space-xs font-body-sm">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">home</span>
                            <span>Home</span>
                        </Link>
                        <span className="text-outline-variant">/</span>
                        <span className="text-on-surface font-semibold">All Stores Directory</span>
                    </nav>
                    <div className="flex items-center gap-space-md">
                        <span className="inline-flex items-center gap-1 font-label-badge text-label-badge bg-verified-emerald-bg text-verified-emerald px-space-xs py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[14px]">bolt</span>
                            <span>{stores.length}+ Merchants Tested Today</span>
                        </span>
                        <span className="hidden md:inline-flex items-center gap-1 text-text-muted">
                            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                            Guaranteed UPI Cashback Tracked
                        </span>
                    </div>
                </div>
            </section>

            {/* Interactive Client Component for Search, Grid, and Directory */}
            <StoresDirectoryClient stores={stores} categories={categories} />

            {/* Trust & Value Proposition Block */}
            <section className="w-full bg-surface-card py-space-2xl">
                <div className="max-w-max-width mx-auto px-gutter-desktop">
                    <div className="text-center max-w-2xl mx-auto mb-space-xl">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Why Shop Through CouponHub Partner Stores?</h2>
                        <p className="font-body-md text-body-md text-text-muted">We bridge the gap between shoppers and actual savings with zero expired clutter.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
                        <div className="bg-surface-page p-space-lg rounded-2xl flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-verified-emerald-bg text-verified-emerald flex items-center justify-center mb-space-sm">
                                <span className="material-symbols-outlined text-[26px]">fact_check</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">100% Tested Daily</h3>
                            <p className="font-body-sm text-body-sm text-text-muted">Human coupon editors personally check checkout pages everyday to weed out broken expired codes.</p>
                        </div>
                        <div className="bg-surface-page p-space-lg rounded-2xl flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-brand-indigo-light text-primary flex items-center justify-center mb-space-sm">
                                <span className="material-symbols-outlined text-[26px]">payments</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Direct Bank / UPI</h3>
                            <p className="font-body-sm text-body-sm text-text-muted">Your cashback tracks automatically and transfers straight into your GPay, PhonePe, or Savings Bank.</p>
                        </div>
                        <div className="bg-surface-page p-space-lg rounded-2xl flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-hot-coral-bg text-hot-coral flex items-center justify-center mb-space-sm">
                                <span className="material-symbols-outlined text-[26px]">layers</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Double Savings Hack</h3>
                            <p className="font-body-sm text-body-sm text-text-muted">Stack coupon discount promo codes on the merchant cart AND receive CouponHub extra cashback on top.</p>
                        </div>
                        <div className="bg-surface-page p-space-lg rounded-2xl flex flex-col items-start">
                            <div className="w-12 h-12 rounded-xl bg-deal-amber-bg text-deal-amber flex items-center justify-center mb-space-sm">
                                <span className="material-symbols-outlined text-[26px]">lock_open</span>
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">Zero Hidden Fees</h3>
                            <p className="font-body-sm text-body-sm text-text-muted">No premium paywalls. 100% free forever for all consumers with instant browser auto-apply benefits.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Glitch & WhatsApp VIP Community Banner */}
            <section className="w-full bg-secondary text-on-secondary py-space-xl">
                <div className="max-w-max-width mx-auto px-gutter-desktop">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full font-label-badge text-label-badge mb-space-xs">
                                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                                PRICE GLITCH ALERTS
                            </div>
                            <h3 className="font-headline-lg text-headline-lg font-extrabold mb-space-xs text-on-secondary">
                                Never Miss 90% Off Glitch Deals Again!
                            </h3>
                            <p className="font-body-md text-body-md opacity-90 text-on-secondary">
                                Join 45,000+ smart deal hunters who get 0-minute alerts before flash pricing errors get corrected.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
                            <a 
                                href="https://wa.me" 
                                target="_blank" 
                                rel="noopener"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-headline-sm text-headline-sm px-space-xl py-space-sm rounded-xl font-bold transition-all shadow-md"
                            >
                                <span className="material-symbols-outlined text-[22px]">chat</span>
                                <span>Join VIP WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Structured Data for Google Rich Snippets & Discovery */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "All Stores Directory - Verified Partner Stores & Cashback Offers",
                        description: "Browse verified coupons, discount codes, and cashback offers across top online shopping stores in India.",
                        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store"}/stores`,
                        mainEntity: {
                            "@type": "ItemList",
                            name: "Partner Stores & Brands",
                            numberOfItems: stores.length,
                            itemListElement: stores.slice(0, 50).map((s, idx) => ({
                                "@type": "ListItem",
                                position: idx + 1,
                                item: {
                                    "@type": "Store",
                                    name: s.name,
                                    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store"}/stores/${s.slug}`,
                                    image: s.logo || undefined,
                                    description: s.description || undefined
                                }
                            }))
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Home",
                                item: process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store"
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "All Stores",
                                item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store"}/stores`
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
