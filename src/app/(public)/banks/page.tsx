import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { CreditCard, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

export const metadata: Metadata = {
    title: "Bank & Credit Card Offers in India – HDFC, ICICI, SBI & Axis Deals | CouponHub",
    description: "Discover verified credit and debit card instant discounts, no-cost EMI offers, and cashback vouchers for HDFC, ICICI, SBI, Axis, and Kotak banks across India.",
    alternates: {
        canonical: `${siteUrl}/banks`,
    },
    openGraph: {
        title: "Bank & Credit Card Offers in India – CouponHub",
        description: "Save with verified credit and debit card instant discounts across leading Indian banks.",
        url: `${siteUrl}/banks`,
        siteName: "CouponHub",
        type: "website",
    },
};

export const revalidate = 3600;

export default async function BanksIndexPage() {
    const banks = await prisma.bank.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
            _count: { select: { bankOffers: { where: { isActive: true } } } },
        },
    });

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
                name: "Bank Offers",
                item: `${siteUrl}/banks`,
            },
        ],
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Bank & Credit Card Offers in India",
        description: "Explore verified bank discounts, cashback, and promo codes for leading Indian banks.",
        url: `${siteUrl}/banks`,
        mainEntity: {
            "@type": "ItemList",
            name: "Supported Indian Banks",
            numberOfItems: banks.length,
            itemListElement: banks.map((bank, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: bank.name,
                url: `${siteUrl}/banks/${bank.slug}`,
            })),
        },
    };

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs
                    items={[
                        { name: "Banks", href: "/banks" },
                    ]}
                />
            </div>

            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-indigo to-indigo-900 text-white py-14 mb-10 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-md">
                <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-4">
                        <CreditCard className="w-4 h-4" /> Bank & Payment Partner Offers
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        India's Best Credit & Debit Card Offers
                    </h1>
                    <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Stack instant bank card discounts on top of verified merchant promo codes to maximize your checkout savings at Amazon, Flipkart, Myntra, and more.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Bank Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banks.map((bank) => (
                        <Link
                            key={bank.id}
                            href={`/banks/${bank.slug}`}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-lg hover:border-brand-indigo/40 transition-all group"
                        >
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
                                        {bank.logo ? (
                                            <Image unoptimized src={bank.logo} alt={bank.name} width={56} height={56} className="object-cover" />
                                        ) : (
                                            <Icon name="account_balance" className="w-7 h-7 text-brand-indigo" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">
                                            {bank.name}
                                        </h2>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-verified-emerald bg-verified-emerald-bg px-2.5 py-0.5 rounded-full mt-1">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Verified Deals
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                    {bank.description || `Discover hand-tested credit and debit card offers for ${bank.name}.`}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    {bank._count.bankOffers} Active Offers
                                </span>
                                <span className="text-xs font-bold text-brand-indigo flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    View Offers <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Educational Stacking Guide */}
                <section className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2.5 text-brand-indigo font-bold text-sm uppercase tracking-wider mb-2">
                            <Sparkles className="w-4 h-4" /> Pro Shopping Strategy
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                            How to Stack Bank Offers with Coupons in India
                        </h2>
                        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            <p>
                                <strong>1. Find Merchant Coupons First:</strong> Apply store-wide or category promo codes from CouponHub on your cart before proceeding to the payment step.
                            </p>
                            <p>
                                <strong>2. Check Payment Gateway Offers:</strong> On the checkout screen, select your card provider (HDFC, ICICI, SBI, Axis, or Kotak). Many merchants trigger an automatic 10% instant discount when you enter your 16-digit card number.
                            </p>
                            <p>
                                <strong>3. Verify Cart Minimums:</strong> Most instant bank rebates require a minimum order value (e.g. ₹2,500 on fashion or ₹5,000–₹10,000 on electronics). Ensure your cart post-coupon still satisfies the threshold.
                            </p>
                        </div>
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
        </div>
    );
}
