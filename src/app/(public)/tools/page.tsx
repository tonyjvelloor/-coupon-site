import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Wrench } from "lucide-react";
import { ToolsHubClient } from "@/components/modules/tools/ToolsHubClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

export const metadata: Metadata = {
    title: "Free Shopping Tools & Discount Calculators",
    description: "Explore free shopping tools by CouponHub India. Calculate stacked discounts, bank card savings, and access embeddable verified deal widgets for creators.",
    alternates: {
        canonical: `${siteUrl}/tools`,
    },
    openGraph: {
        title: "Free Shopping Tools & Discount Calculators | CouponHub India",
        description: "Calculate stacked discounts and bank card savings. Free tools and embeddable deal badges for Indian shoppers and creators.",
        url: `${siteUrl}/tools`,
        siteName: "CouponHub India",
        type: "website",
    },
};

export default function ToolsIndexPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
            {/* Header & Breadcrumbs */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <Link href="/" className="hover:text-brand-indigo transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-slate-900 dark:text-white font-medium">Tools</span>
                    </nav>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Smart Shopping & Savings Tools
                        </h1>
                    </div>
                    <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl text-base md:text-lg">
                        Free calculators, discount stacking optimizers, and embeddable coupon badges to help shoppers save more and creators syndicate verified deals across the web.
                    </p>
                </div>
            </div>

            {/* Content Hub Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ToolsHubClient />

                {/* Educational Content & SEO Guide */}
                <div className="mt-20 max-w-4xl mx-auto prose dark:prose-invert prose-slate">
                    <h2 className="text-2xl font-bold tracking-tight">Why Smart Shopping Tools Matter in India</h2>
                    <p>
                        Indian e-commerce is unique: major sales on platforms like Amazon India, Flipkart, Myntra, and Ajio rarely offer a single discount. Instead, maximum savings are achieved through a <strong>layered discount stack</strong>:
                    </p>
                    <ul>
                        <li><strong>Base Product Discount:</strong> The marked-down price during mega sale events (e.g., 40% to 70% off MRP).</li>
                        <li><strong>Platform / Store Coupon:</strong> Alpha-numeric promo codes applied at checkout for an extra ₹200 to ₹1,000 off.</li>
                        <li><strong>Instant Bank Card Discount:</strong> 10% instant discount when paying with eligible HDFC, SBI, ICICI, or Axis Bank cards.</li>
                        <li><strong>Payment Gateway Cashback:</strong> Flat ₹25 to ₹100 cashback via UPI providers like Google Pay, PhonePe, and Cred Pay.</li>
                    </ul>
                    <p>
                        Our <Link href="/tools/discount-calculator" className="text-brand-indigo font-bold hover:underline">Discount Calculator</Link> does all the math instantly, eliminating checkout surprises.
                    </p>

                    <h3 className="text-xl font-bold mt-8">For Bloggers, Reviewers & Webmasters (Parasite SEO & Syndication)</h3>
                    <p>
                        If you write shopping roundups, tech reviews, or gift guides on platforms like Medium, LinkedIn Pulse, Reddit, Substack, or GitHub, you can use our <strong>Deal Embed Badges</strong> above. These badges link directly to verified store pages on CouponHub, providing your readers with real-time, working promo codes without cluttering your content.
                    </p>
                </div>
            </div>
        </div>
    );
}
