import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { CreditCard, Tag, ShieldCheck, ChevronDown, Sparkles, ExternalLink } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 900;

export async function generateStaticParams() {
    try {
        const banks = await prisma.bank.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return banks.map((b) => ({ slug: b.slug }));
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const bank = await prisma.bank.findUnique({
        where: { slug, isActive: true },
    });

    if (!bank) return { title: "Bank Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const ogTitle = bank.seoTitle || `${bank.name} Credit Card Offers & Coupons – ${monthYear} | CouponHub`;
    const ogDescription = bank.description || `Maximize your savings with verified ${bank.name} credit and debit card offers for ${monthYear}. Discover instant discounts, cashback deals, and promotional vouchers.`;

    return {
        title: ogTitle,
        description: ogDescription,
        alternates: {
            canonical: `${siteUrl}/banks/${bank.slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: `${siteUrl}/banks/${bank.slug}`,
            siteName: "CouponHub",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
        },
    };
}

export default async function BankPage({ params }: PageProps) {
    const { slug } = await params;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    const bank = await prisma.bank.findUnique({
        where: { slug, isActive: true },
        include: {
            bankOffers: {
                where: { isActive: true },
                include: { store: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!bank) {
        notFound();
    }

    // Query coupons tagged with this bank
    const bankKeyword = bank.name.replace(/Bank|Card/i, '').trim();
    const bankCoupons = await prisma.coupon.findMany({
        where: {
            bank: { contains: bankKeyword, mode: 'insensitive' },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        take: 6,
        include: {
            merchantIdentity: {
                include: { store: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    const faqs = [
        {
            question: `How do I redeem ${bank.name} instant card discounts at checkout in India?`,
            answer: `Select ${bank.name} Credit or Debit Card as your payment method on the merchant checkout page. If a promotional code is required, enter it into the voucher box first. When you enter your eligible ${bank.name} card number, the instant discount will automatically apply to your payable total.`,
        },
        {
            question: `Can I combine ${bank.name} card offers with store promo codes?`,
            answer: `Yes, in most cases major Indian retailers (like Amazon, Flipkart, Myntra, and Swiggy) allow stacking site-wide coupon codes with ${bank.name} instant bank discounts, as long as the post-coupon order total meets the minimum spend requirement.`,
        },
        {
            question: `What is the minimum transaction value required for ${bank.name} discounts?`,
            answer: `Minimum transaction requirements typically range from ₹1,500 on fashion and beauty orders to ₹5,000–₹15,000 on consumer electronics and smartphones. Check the specific terms listed on each offer card above.`,
        },
        {
            question: `Do ${bank.name} debit cards qualify for the same offers as credit cards?`,
            answer: `Many promotional campaigns cover both ${bank.name} credit and debit cards. However, peak sale discounts (such as no-cost EMI and bonus instant rebates) may occasionally be reserved for credit cardholders. Check the terms on each deal.`,
        },
    ];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Banks",
                item: `${siteUrl}/banks`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: bank.name,
                item: `${siteUrl}/banks/${bank.slug}`,
            },
        ],
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${bank.name} Credit Card Offers & Coupons`,
        description: bank.description || `Verified ${bank.name} discounts and offers in India.`,
        url: `${siteUrl}/banks/${bank.slug}`,
        mainEntity: {
            "@type": "ItemList",
            name: `${bank.name} Verified Offers`,
            numberOfItems: bank.bankOffers.length,
            itemListElement: bank.bankOffers.map((offer, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Offer",
                    name: offer.discountDetails,
                    description: offer.terms || offer.discountDetails,
                    priceCurrency: "INR",
                    price: "0",
                    areaServed: {
                        "@type": "Country",
                        name: "India",
                        identifier: "IN",
                    },
                    url: offer.store ? `${siteUrl}/stores/${offer.store.slug}` : `${siteUrl}/banks/${bank.slug}`,
                },
            })),
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
            },
        })),
    };

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs
                    items={[
                        { name: "Banks", href: "/banks" },
                        { name: bank.name },
                    ]}
                />
            </div>

            {/* Header */}
            <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12 mb-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 overflow-hidden relative shrink-0">
                            {bank.logo ? (
                                <Image unoptimized src={bank.logo} alt={bank.name} fill className="object-cover" />
                            ) : (
                                <CreditCard className="w-10 h-10 text-brand-indigo" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-verified-emerald bg-verified-emerald-bg px-2.5 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Hand-Tested Card Deals
                                </span>
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                                    {bank.bankOffers.length} Active Deals
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {bank.name} Offers & Coupons
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-3xl leading-relaxed">
                                {bank.description || `Maximize your savings with verified ${bank.name} credit and debit card instant discounts across top Indian online merchants.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Store-Linked Bank Offers */}
                <section>
                    <div className="flex items-center gap-2.5 mb-6">
                        <CreditCard className="w-6 h-6 text-brand-indigo" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Top Store Discounts for {bank.name}
                        </h2>
                    </div>

                    {bank.bankOffers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bank.bankOffers.map((offer) => (
                                <div key={offer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                                {offer.store?.logo ? (
                                                    <Image unoptimized src={offer.store.logo} alt={offer.store.name} width={40} height={40} className="object-contain" />
                                                ) : (
                                                    <Icon name="storefront" className="text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white">{offer.store?.name || "Multiple Merchants"}</h3>
                                                <span className="text-xs font-semibold text-verified-emerald bg-verified-emerald-bg px-2 py-0.5 rounded-full">
                                                    Verified Offer
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-base font-extrabold text-brand-indigo mb-2">
                                            {offer.discountDetails}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                            {offer.terms || "Standard terms and conditions apply."}
                                        </p>
                                    </div>
                                    <Link 
                                        href={offer.store ? `/stores/${offer.store.slug}` : "/stores"} 
                                        className="block w-full text-center bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-brand-indigo font-bold py-2.5 rounded-xl transition-colors text-sm"
                                    >
                                        View {offer.store?.name || "Merchant"} Coupons
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active offers currently</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Check back soon as new {bank.name} promotional codes and instant discounts are added daily.
                            </p>
                        </div>
                    )}
                </section>

                {/* Bank Coupons Feed if tagged */}
                {bankCoupons.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2.5 mb-6">
                            <Tag className="w-6 h-6 text-verified-emerald" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Verified {bank.name} Promo Codes & Vouchers
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bankCoupons.map((coupon) => {
                                const store = coupon.merchantIdentity?.store;
                                return (
                                    <div key={coupon.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                {store && (
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {store.name}
                                                    </span>
                                                )}
                                                <span className="text-xs font-bold text-brand-indigo bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                                                    {coupon.code ? "PROMO CODE" : "ACTIVATED DEAL"}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">
                                                {coupon.title}
                                            </h4>
                                            {coupon.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                                    {coupon.description}
                                                </p>
                                            )}
                                        </div>
                                        {store && (
                                            <Link
                                                href={`/stores/${store.slug}`}
                                                className="text-xs font-bold text-brand-indigo flex items-center gap-1 hover:underline"
                                            >
                                                Redeem on {store.name} <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Visible FAQ Section */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions about {bank.name} Offers
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                            >
                                <summary className="flex items-center justify-between p-4 md:p-5 cursor-pointer font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <span className="text-sm md:text-base pr-4">{faq.question}</span>
                                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:-rotate-180" />
                                </summary>
                                <div className="px-4 md:px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </div>
    );
}
