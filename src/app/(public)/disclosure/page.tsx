import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
    title: "Affiliate Disclosure | CouponHub",
    description: "Read our affiliate disclosure to understand how CouponHub is funded and our relationship with merchants.",
};

export default function DisclosurePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            <Breadcrumbs items={[{ name: "Affiliate Disclosure" }]} />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 prose prose-lg prose-violet dark:prose-invert max-w-none">
                    <h1>Affiliate Disclosure</h1>
                    <p className="lead text-gray-500 dark:text-gray-400">Honesty and transparency are core to our mission.</p>
                    
                    <h2>How We Make Money</h2>
                    <p>
                        CouponHub is a free service for shoppers. To keep our platform running, we use affiliate links. When you click on a coupon or a store link on CouponHub and make a purchase, we may earn a small commission from the merchant at <strong>no additional cost to you</strong>.
                    </p>

                    <h2>Does This Affect The Deals?</h2>
                    <p>
                        No. Our primary goal is to help you save money. Our algorithms and editorial team surface the best deals based on their actual value, regardless of affiliate relationships. We prioritize verified, high-value coupons above all else.
                    </p>
                    
                    <h2>Amazon Associate Disclosure</h2>
                    <p>
                        As an Amazon Associate, CouponHub earns from qualifying purchases.
                    </p>

                    <h2>Our Commitment</h2>
                    <p>
                        We promise to never let our affiliate relationships influence our editorial content or the deals we choose to feature. We will always present you with the best available savings.
                    </p>
                </div>
            </div>
        </div>
    );
}
