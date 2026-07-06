import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
    title: "Editorial Policy | CouponHub",
    description: "Learn how we source, verify, and publish coupons and deals on CouponHub.",
};

export default function EditorialPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            <Breadcrumbs items={[{ name: "Editorial Policy" }]} />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 prose prose-lg prose-violet dark:prose-invert max-w-none">
                    <h1>Our Editorial & Verification Policy</h1>
                    <p className="lead text-gray-500 dark:text-gray-400">Quality, accuracy, and user savings are our top priorities.</p>
                    
                    <h2>1. How We Source Deals</h2>
                    <p>
                        Our dedicated team and automated algorithms scan thousands of stores daily. We source deals directly from merchants, affiliate networks, user submissions, and exclusive partnerships to bring you the best discounts.
                    </p>

                    <h2>2. The Verification Process</h2>
                    <p>
                        Every coupon on CouponHub undergoes a strict verification process:
                    </p>
                    <ul>
                        <li><strong>Automated Testing:</strong> Our system tests codes at checkout for validity.</li>
                        <li><strong>Manual Review:</strong> Our editorial team verifies complex deals and exclusions.</li>
                        <li><strong>Community Feedback:</strong> We monitor user success rates and adjust scores accordingly.</li>
                    </ul>

                    <h2>3. Editorial Independence</h2>
                    <p>
                        While we partner with thousands of retailers, our editorial decisions are independent. A merchant cannot pay us to list a fake or expired coupon. If a deal is not good for our users, we will not publish it.
                    </p>
                    
                    <h2>4. Expired Coupons</h2>
                    <p>
                        We strive to remove or clearly label expired coupons immediately. Occasionally, merchants extend sales without notice. We may keep highly sought-after coupons visible (marked as expired) just in case they still work, and to provide you with active alternatives.
                    </p>

                    <h2>5. Corrections</h2>
                    <p>
                        If you spot an error or a coupon that no longer works, please let us know at <strong>support@couponhub.store</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
}
