import Link from "next/link";
import { couponService } from "@/lib/services/coupon.service";
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { BestOffersFilterGrid } from "@/components/modules/offers/BestOffersFilterGrid";
import { Sparkles, Tag, ShieldCheck, ArrowRight } from "lucide-react";
import { getSiteUrl, getCurrentMonthYear } from "@/lib/seo-utils";
import { cleanCouponCode, formatDiscountBadge, getOfferBadgeLabel } from "@/lib/coupon-ranking";

export const revalidate = 21600; // 6h ISR to minimize Neon Free compute wakeups

export const metadata = {
    title: "Best Coupons & Verified Promo Codes Today",
    description:
        "Browse the highest-value verified promo codes, bank card discounts, and top deals across leading Indian online stores.",
    alternates: { canonical: `${getSiteUrl()}/best-offers` },
};

export default async function BestOffersPage() {
    const coupons = await couponService.getBestCoupons(48, 2);
    const { fullMonthYear } = getCurrentMonthYear();

    const spotlightCodes = coupons.filter((c) => Boolean(cleanCouponCode(c.code))).slice(0, 6);
    const spotlightIds = new Set(spotlightCodes.map((c) => c.id));
    const remainingOffers = coupons.filter((c) => !spotlightIds.has(c.id));

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Hero */}
            <div className="relative overflow-hidden bg-slate-900 border-b border-gray-800 py-16 lg:py-24">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl mix-blend-screen opacity-50" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
                            Ranked by Real Savings · {fullMonthYear}
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white">
                        Best Verified{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-emerald-400">
                            Coupons &amp; Promo Codes
                        </span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
                        Top working promo codes prioritized above generic sales—scored by code availability, discount value, and bank-offer stacking.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-12 relative z-10">
                {/* Spotlight Top Promo Codes */}
                {spotlightCodes.length > 0 && (
                    <section>
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        Editor&apos;s Spotlight
                                    </span>
                                    <h2 className="text-2xl font-extrabold text-slate-900">
                                        Top Working Promo Codes Right Now
                                    </h2>
                                </div>
                                <Link
                                    href="/tools/card-vs-cashback-calculator"
                                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-indigo hover:underline"
                                >
                                    Check Bank Stacking Math <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {spotlightCodes.map((coupon, index) => (
                                    <PremiumOfferCard
                                        key={coupon.id}
                                        highlight={index === 0}
                                        badgeLabel={getOfferBadgeLabel(coupon, index)}
                                        coupon={{
                                            ...coupon,
                                            discountValue: formatDiscountBadge(
                                                coupon.discountValue,
                                                coupon.discountType,
                                                coupon.title
                                            ),
                                        }}
                                        storeName={coupon.merchantName}
                                        storeLogo={coupon.merchantLogo}
                                        source="best-offers-spotlight"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Scannable SEO / AI Overview Summary Table */}
                {spotlightCodes.length > 0 && (
                    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm overflow-x-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
                            <h2 className="text-xl font-bold text-slate-900">
                                Quick Summary: Best Verified Codes ({fullMonthYear})
                            </h2>
                        </div>
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs">
                                    <th className="py-3 pr-4">Store</th>
                                    <th className="py-3 pr-4">Offer</th>
                                    <th className="py-3 pr-4">Savings</th>
                                    <th className="py-3 pr-4">Promo Code</th>
                                    <th className="py-3 text-right">Store Page</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {spotlightCodes.map((c) => (
                                    <tr key={`row-${c.id}`} className="hover:bg-slate-50/70">
                                        <td className="py-3 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                                            {c.merchantName}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-700">{c.title}</td>
                                        <td className="py-3 pr-4 font-bold text-brand-emerald whitespace-nowrap">
                                            {formatDiscountBadge(c.discountValue, c.discountType, c.title)}
                                        </td>
                                        <td className="py-3 pr-4 font-mono font-bold text-brand-indigo whitespace-nowrap">
                                            {cleanCouponCode(c.code)}
                                        </td>
                                        <td className="py-3 text-right whitespace-nowrap">
                                            <Link
                                                href={`/stores/${c.merchantSlug}`}
                                                className="text-brand-indigo font-semibold hover:underline"
                                            >
                                                All Offers →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* Interactive Filtered Offers Grid */}
                {coupons.length > 0 ? (
                    <BestOffersFilterGrid offers={remainingOffers.length > 0 ? remainingOffers : coupons} />
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-gray-600 text-lg mb-4">
                            Browse our full store directory for live brand offers and bank card guides.
                        </p>
                        <Link
                            href="/stores"
                            className="inline-flex items-center gap-2 bg-brand-indigo text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Explore Partner Stores <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
