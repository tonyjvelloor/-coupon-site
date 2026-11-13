import Link from "next/link";
import { Building2, ShieldCheck, Clock, BookOpen, Tag, FileText } from "lucide-react";
import TrustWidget from "@/components/ui/TrustWidget";
import { prisma } from "@/lib/db";
import { getAllBlogPosts } from "@/lib/blog-data";

export const revalidate = 3600;

export const metadata = {
    title: "About Us | CouponHub",
    description: "Learn about CouponHub, our deal verification methodology, editorial standards, and transparent affiliate & advertising model for Indian online shoppers.",
};

export default async function AboutPage() {
    let activeStoresCount = 300;
    let activeCouponsCount = 2400;
    let guidesCount = 12;

    try {
        const [storesCount, couponsCount, posts] = await Promise.all([
            prisma.store.count({ where: { isActive: true, activeOfferCount: { gt: 0 } } }),
            prisma.coupon.count({ where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
            getAllBlogPosts(),
        ]);
        if (storesCount > 0) activeStoresCount = storesCount;
        if (couponsCount > 0) activeCouponsCount = couponsCount;
        if (posts.length > 0) guidesCount = posts.length;
    } catch {
        // Fallback to conservative baseline figures when DB is unavailable during build
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-gray-900 text-white py-20 lg:py-28 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        Editorial Savings &amp; Deal Intelligence
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">About CouponHub</h1>
                    <p className="text-xl text-violet-200 max-w-3xl mx-auto leading-relaxed">
                        CouponHub helps shoppers in India compare verified promo codes, bank credit card discounts, and seasonal sale schedules without sifting through expired clutter.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {/* Factual Live Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{activeStoresCount}+</h3>
                        <p className="text-gray-500 font-medium">Stores with Live Offers</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Tag className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{activeCouponsCount.toLocaleString("en-IN")}</h3>
                        <p className="text-gray-500 font-medium">Active Deals Listed</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-7 h-7 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Daily</h3>
                        <p className="text-gray-500 font-medium">Expiry &amp; Feed Sweeps</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
                        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{guidesCount}+</h3>
                        <p className="text-gray-500 font-medium">Buying &amp; Sale Guides</p>
                    </div>
                </div>

                {/* Our Story / Mission */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why We Built CouponHub</h2>
                            <div className="space-y-5 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                <p>
                                    Online shoppers often waste minutes testing expired coupon codes at checkout without knowing the minimum cart requirement, bank card exclusions, or category caps.
                                </p>
                                <p>
                                    CouponHub combines structured merchant feeds, bank offer terms, and original editorial buying guides to clarify <strong>which discount stacks best</strong> before you check out.
                                </p>
                                <ul className="space-y-4 mt-6">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full"><ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">Clear Offer Terms:</strong> We highlight minimum spend limits, card exclusions, and expiration dates alongside codes.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-violet-100 dark:bg-violet-900/30 p-1 rounded-full"><Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">Seasonal &amp; Bank Calculators:</strong> Built-in tools such as our Card vs. Cashback Calculator help compare instant discounts against No-Cost EMI fees and rewards.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full"><FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">Transparent Funding:</strong> CouponHub is free to browse and is supported by affiliate commissions and display advertising partners including Google AdSense, clearly separated from editorial recommendations.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <TrustWidget />
                    </div>
                </div>

                {/* Publisher & Transparency Info */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 lg:p-14 border border-gray-100 dark:border-gray-800 text-center max-w-4xl mx-auto shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Publisher Transparency</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        CouponHub (<code>https://www.couponhub.store</code>) is published and operated by <strong>TheBrandManiacs</strong> in Bengaluru, India.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-violet-700 dark:text-violet-400 mb-6">
                        <Link href="/editorial-policy" className="hover:underline">Editorial Policy</Link>
                        <Link href="/how-we-verify" className="hover:underline">How We Verify</Link>
                        <Link href="/disclosure" className="hover:underline">Affiliate &amp; Ad Disclosure</Link>
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link>
                        <Link href="/contact" className="hover:underline">Contact Us</Link>
                    </div>
                    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500">
                        <span>Support: support@couponhub.store</span>
                        <span className="hidden sm:block">•</span>
                        <span>Partnerships: partnerships@couponhub.store</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
