import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Scale, ShieldCheck, CreditCard } from "lucide-react";
import { getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Compare Stores Side-by-Side: Coupons, Cashback & Policies | CouponHub",
    description:
        "Compare India's top online shopping platforms side-by-side — Amazon vs Flipkart, Myntra vs AJIO, Zomato vs Swiggy, Nykaa vs Myntra, and electronics retailers.",
    alternates: {
        canonical: `${getSiteUrl()}/compare`,
    },
};

const COMPARISON_PAIRS = [
    {
        slug: "amazon-vs-flipkart",
        title: "Amazon vs Flipkart",
        category: "Everything & Electronics",
        summary: "Compare Prime vs Plus shipping perks, SBI/HDFC vs Axis/ICICI bank instant discounts, and return windows across smartphones and appliances.",
    },
    {
        slug: "myntra-vs-ajio",
        title: "Myntra vs AJIO",
        category: "Fashion & Apparel",
        summary: "Side-by-side breakdown of Myntra Insider discounts vs AJIO Reliance card codes, convenience fees, and EORS vs All Stars sale markdowns.",
    },
    {
        slug: "zomato-vs-swiggy",
        title: "Zomato vs Swiggy",
        category: "Food Delivery & Quick Commerce",
        summary: "Compare Zomato Gold vs Swiggy One delivery benefits, bank card promos, and restaurant coupon caps for daily food orders.",
    },
    {
        slug: "nykaa-beauty-vs-myntra",
        title: "Nykaa vs Myntra Beauty",
        category: "Beauty & Skincare",
        summary: "Evaluate Pink Friday vs Myntra beauty gift hampers, BOGO skincare promos, and authentic brand warranty guarantees.",
    },
    {
        slug: "croma-retail-vs-reliance-digital",
        title: "Croma vs Reliance Digital",
        category: "Appliances & Laptops",
        summary: "Check in-store pickup options, No-Cost EMI bank tie-ups, and extended warranty costs on TVs, laptops, and home appliances.",
    },
    {
        slug: "decathlon-vs-puma",
        title: "Decathlon vs Puma India",
        category: "Sportswear & Fitness",
        summary: "Compare activewear pricing, clearance outlet discounts, and app-exclusive coupon codes for running gear and sports accessories.",
    },
    {
        slug: "healthkart-vs-wellbeing-nutrition",
        title: "HealthKart vs Wellbeing Nutrition",
        category: "Health & Supplements",
        summary: "Compare subscription savings, authenticity verification, and bundle coupon codes on whey protein, multivitamins, and daily nutrition.",
    },
    {
        slug: "tata-cliq-vs-myntra",
        title: "Tata CLiQ vs Myntra",
        category: "Lifestyle & Luxury Fashion",
        summary: "Evaluate Tata NeuCoins rewards and luxury brand markdowns against Myntra seasonal fashion coupons and express returns.",
    },
];

export default function CompareHubPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 lg:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
                        <Scale className="w-4 h-4 text-emerald-400" />
                        Side-by-Side Store Intelligence
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                        Compare Top Indian Online Stores
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Evaluate active coupon availability, bank credit card discounts, shipping thresholds, and return policies before placing your order.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {COMPARISON_PAIRS.map((pair) => (
                        <Link
                            key={pair.slug}
                            href={`/compare/${pair.slug}`}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg hover:border-brand-indigo/40 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full mb-3">
                                    {pair.category}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-indigo transition-colors mb-2">
                                    {pair.title}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    {pair.summary}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-indigo">
                                View Full Comparison <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Editorial Comparison Methodology */}
                <div className="mt-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        What We Evaluate in Every Store Comparison
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-gray-900 dark:text-white block mb-1">Active Offer Depth &amp; Return Windows</strong>
                                We pull live active offer counts, merchant shipping minimums, and official return timelines directly from verified store feeds so you can pick the more reliable storefront for expensive purchases.
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-gray-900 dark:text-white block mb-1">Bank Discounts &amp; Stacking Rules</strong>
                                Different platforms partner with different Indian banks during major sales. Pair our store comparisons with our{" "}
                                <Link href="/tools/card-vs-cashback-calculator" className="text-brand-indigo font-semibold underline">
                                    Card vs. Cashback Calculator
                                </Link>{" "}
                                to verify net effective checkout prices.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
