import { Building2, Users, Trophy, Target, ShieldCheck, Clock, ThumbsUp } from "lucide-react";
import TrustWidget from "@/components/ui/TrustWidget";

export const metadata = {
    title: "About Us | CouponHub",
    description: "Learn about CouponHub. We are an AI-powered savings engine dedicated to finding, verifying, and delivering the absolute best coupon codes and flash deals on the internet.",
};

export default function AboutPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-gray-900 text-white py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        100% Verified Savings Engine
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">Your Trusted Deal Finder</h1>
                    <p className="text-xl text-violet-200 max-w-3xl mx-auto leading-relaxed">
                        We are on a mission to completely automate the way you save money online, powered by advanced AI and a dedicated team of deal experts.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">5000+</h3>
                        <p className="text-gray-500 font-medium">Partner Stores</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Daily</h3>
                        <p className="text-gray-500 font-medium">Verification Sweeps</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">1M+</h3>
                        <p className="text-gray-500 font-medium">Shoppers Helped</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">#1</h3>
                        <p className="text-gray-500 font-medium">AI Deal Tracker</p>
                    </div>
                </div>

                {/* Our Story / Mission */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why We Built CouponHub</h2>
                            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                <p>
                                    At <strong>CouponHub</strong>, we realized that the coupon industry was broken. Too many websites were filled with expired codes, misleading offers, and frustrating popups that wasted time instead of saving money.
                                </p>
                                <p>
                                    We decided to fix it. We built CouponHub as an <strong>intelligent savings engine</strong>. Instead of relying on manual data entry, we deploy advanced AI crawlers that scan top e-commerce sites 24/7 to find, test, and verify real discount codes and flash sales.
                                </p>
                                <ul className="space-y-4 mt-8">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full"><ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">No Fake Codes:</strong> Every coupon is tested. Look for the "Verified Today" badge for guaranteed savings.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-violet-100 dark:bg-violet-900/30 p-1 rounded-full"><Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">Real-Time Updates:</strong> Flash sales are added instantly via our automated deal pipeline.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full"><ThumbsUp className="w-4 h-4 text-orange-600 dark:text-orange-400" /></div>
                                        <span><strong className="text-gray-900 dark:text-white font-semibold">Clean Interface:</strong> A premium, ad-free experience designed to get you the code and get you to checkout quickly.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Trust Widget Embedded Here */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-100 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/10 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                            <TrustWidget platform="mixed" />
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 lg:p-16 border border-gray-100 dark:border-gray-800 text-center max-w-4xl mx-auto shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Built For Shoppers</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        CouponHub is dedicated to creating a transparent, value-driven experience for global audiences. (CouponHub is proudly operated by <strong>TheBrandManiacs</strong>).
                    </p>
                    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-gray-500">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> System Status: Active</span>
                        <span className="hidden sm:block">•</span>
                        <span>Partnerships: partnerships@couponhub.store</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
