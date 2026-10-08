import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { CreditCard, ShieldCheck, Tag, ShoppingBag, ArrowRight } from "lucide-react";

interface PageProps {
    params: Promise<{ bankSlug: string; storeSlug: string }>;
}

export const revalidate = 3600; // 1-hour cache

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bankSlug, storeSlug } = await params;
    
    const [bank, store] = await Promise.all([
        prisma.bank.findUnique({ where: { slug: bankSlug, isActive: true } }),
        prisma.store.findUnique({ where: { slug: storeSlug, isActive: true } })
    ]);

    if (!bank || !store) return { title: "Offer Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";
    const shortMonthYear = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date());
    const fullMonthYear = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date());

    const title = `${store.name} ${bank.name} Credit Card Offer (${shortMonthYear}) - Extra Discount`;
    const description = `Get 100% verified ${bank.name} credit and debit card offers for ${store.name} in ${fullMonthYear}. Combine bank discounts with ${store.name} coupons for maximum savings.`;

    return {
        title,
        description,
        alternates: {
            canonical: `${siteUrl}/banks/${bank.slug}/${store.slug}`,
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}/banks/${bank.slug}/${store.slug}`,
            siteName: "CouponHub India",
            type: "website",
        },
    };
}

export default async function BankStoreOfferPage({ params }: PageProps) {
    const { bankSlug, storeSlug } = await params;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    // 1. Fetch Bank and Store details
    const [bank, store] = await Promise.all([
        prisma.bank.findUnique({ where: { slug: bankSlug, isActive: true } }),
        prisma.store.findUnique({ where: { slug: storeSlug, isActive: true } })
    ]);

    if (!bank || !store) {
        notFound();
    }

    // 2. Fetch specific BankOffer if one explicitly links these two
    const bankOffer = await prisma.bankOffer.findFirst({
        where: {
            bankId: bank.id,
            storeId: store.id,
            isActive: true,
        },
    });

    // 3. Fetch Coupons for the Store (optionally filtering by the bank name)
    const bankKeyword = bank.name.replace(/Bank|Card/i, '').trim();
    const bankCoupons = await prisma.coupon.findMany({
        where: {
            merchantIdentity: {
                storeId: store.id
            },
            bank: { contains: bankKeyword, mode: 'insensitive' },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
    });

    // Fallback if no specific bank coupons exist: show best store coupons
    const storeCoupons = await prisma.coupon.findMany({
        where: {
            merchantIdentity: {
                storeId: store.id
            },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        orderBy: { isVerified: 'desc' },
        take: bankCoupons.length > 0 ? 3 : 6,
    });

    const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date());

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* SEO Breadcrumbs */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Banks", href: "/banks" },
                            { label: bank.name, href: `/banks/${bank.slug}` },
                            { label: store.name, href: `/banks/${bank.slug}/${store.slug}` },
                        ]}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 pb-12 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Logos */}
                        <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            {store.logo ? (
                                <div className="w-20 h-20 relative bg-white rounded-xl shadow-sm border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
                                    <Image src={store.logo} alt={store.name} width={64} height={64} className="object-contain" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center text-xl font-bold text-slate-500">
                                    {store.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="text-2xl text-slate-300 font-light">×</div>
                            {bank.logo ? (
                                <div className="w-20 h-20 relative bg-white rounded-xl shadow-sm border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
                                    <Image src={bank.logo} alt={bank.name} width={64} height={64} className="object-contain" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-8 h-8 text-slate-500" />
                                </div>
                            )}
                        </div>

                        {/* Title & Copy */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-outfit tracking-tight mb-4">
                                {store.name} <span className="text-primary-600">{bank.name}</span> Card Offers
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                                {bankOffer 
                                    ? bankOffer.discountDetails 
                                    : `Maximize your savings at ${store.name} using your ${bank.name} credit or debit card. Combine exclusive bank instant discounts with working promo codes for ${monthYear}.`}
                            </p>
                            
                            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                                    <ShieldCheck className="w-4 h-4" />
                                    100% Verified Offers
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
                                    <Tag className="w-4 h-4" />
                                    Stackable Discounts
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Offers) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bank Specific Coupons */}
                        {bankCoupons.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-primary-500" />
                                    Active {bank.name} Coupons for {store.name}
                                </h2>
                                <div className="space-y-4">
                                    {bankCoupons.map((coupon) => (
                                        <div key={coupon.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">{coupon.title}</h3>
                                                {coupon.description && (
                                                    <p className="text-slate-600 text-sm line-clamp-2">{coupon.description}</p>
                                                )}
                                            </div>
                                            <div className="shrink-0 w-full sm:w-auto">
                                                <Link 
                                                    href={`/stores/${store.slug}?coupon=${coupon.id}`}
                                                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                                                >
                                                    {coupon.code ? "Show Code" : "Activate Deal"}
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Store Coupons */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-primary-500" />
                                Top {store.name} Promo Codes (Stackable)
                            </h2>
                            <p className="text-slate-600 text-sm">
                                You can often apply these coupon codes at checkout <strong>before</strong> entering your {bank.name} card details to double your savings.
                            </p>
                            <div className="space-y-4">
                                {storeCoupons.map((coupon) => (
                                    <div key={coupon.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{coupon.title}</h3>
                                            {coupon.description && (
                                                <p className="text-slate-600 text-sm line-clamp-2">{coupon.description}</p>
                                            )}
                                        </div>
                                        <div className="shrink-0 w-full sm:w-auto">
                                            <Link 
                                                href={`/stores/${store.slug}?coupon=${coupon.id}`}
                                                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                                            >
                                                {coupon.code ? "Show Code" : "Activate Deal"}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-4 text-center">
                                <Link 
                                    href={`/stores/${store.slug}`}
                                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                                >
                                    View all {store.activeOfferCount} {store.name} offers
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 font-outfit mb-4 text-lg border-b border-slate-100 pb-3">
                                How to use {bank.name} offers on {store.name}
                            </h3>
                            <ol className="space-y-4 text-sm text-slate-600">
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">1</span>
                                    <span>Copy a stackable <strong>{store.name} coupon code</strong> from above.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">2</span>
                                    <span>Proceed to {store.name}'s checkout and paste the code to get your base discount.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">3</span>
                                    <span>On the payment screen, select Credit/Debit card and enter your <strong>{bank.name} card details</strong>.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-none w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">4</span>
                                    <span>The {bank.name} instant discount or cashback offer will automatically apply to the final amount.</span>
                                </li>
                            </ol>
                        </div>
                        
                        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-sm">
                            <h3 className="font-bold font-outfit mb-2 text-lg">Looking for more {bank.name} discounts?</h3>
                            <p className="text-slate-300 text-sm mb-4">
                                Browse all active {bank.name} credit card offers across top merchants.
                            </p>
                            <Link 
                                href={`/banks/${bank.slug}`}
                                className="inline-flex w-full justify-center items-center gap-2 bg-white text-slate-900 font-bold py-2.5 px-4 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                View all {bank.name} Offers
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: title,
                        description: description,
                        publisher: {
                            "@type": "Organization",
                            name: "CouponHub India",
                            url: siteUrl
                        }
                    })
                }}
            />
        </div>
    );
}
