import { Shield, CheckCircle2, Clock, Activity, Search } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "How We Verify Coupons | CouponHub",
    description: "Learn about the CouponHub Commerce Intelligence Platform and how we verify, curate, and guarantee merchant information and offers.",
};

export default function HowWeVerifyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-6">
                    <Shield className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Our Verification Guarantee
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    CouponHub is a Commerce Intelligence Platform. We don't just list coupons; we build a verified knowledge graph of merchant policies, offers, and shopping intelligence.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Manual Editorial Review</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Every merchant profile is reviewed by our editorial team. We don't scrape and publish blindly. Our editors verify student discounts, return windows, and shipping thresholds directly from the official merchant sources.
                    </p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Freshness & Timestamps</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Coupons expire and policies change. We display exactly when a merchant was last verified. If an offer is stale, it loses its verification badge. We believe in evidence over claims.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Structured Knowledge</h3>
                    <p className="text-gray-600 leading-relaxed">
                        We extract raw data and turn it into structured facts. From cashback percentages to EMI availability, we ensure you have the exact factual data needed to make a purchasing decision, stripped of marketing fluff.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI & Answer Engines</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Our platform is designed to be easily read by AI answer engines (like ChatGPT and Perplexity). We expose our structured knowledge graph so AI tools can accurately cite our verified data.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Ready to start saving smarter?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/stores"
                        className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-sm"
                    >
                        Browse Verified Stores
                    </Link>
                    <Link
                        href="/categories"
                        className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Explore Categories
                    </Link>
                </div>
            </div>
        </div>
    );
}
