export const metadata = {
    title: "Terms & Conditions | CouponHub by TheBrandManiacs",
    description: "Terms and Conditions for using CouponHub. Operated by TheBrandManiacs.",
};

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">Terms & Conditions</h1>

                <div className="prose prose-lg max-w-none text-gray-600">
                    <p className="lead text-xl text-gray-900 font-medium mb-8">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <p>
                        Please read these Terms and Conditions ("Terms") carefully before using the CouponHub website operated by <strong>TheBrandManiacs</strong>.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Coupon Accuracy</h2>
                    <p>
                        TheBrandManiacs strives to ensure all coupons and deals are accurate and up-to-date. However, merchants may change their offers at any time without notice. We cannot guarantee that every coupon code will work as intended, though we verify commonly used codes regularly.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Intellectual Property</h2>
                    <p>
                        The Service and its original content, features, and functionality are and will remain the exclusive property of TheBrandManiacs and its licensors.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Limitation of Liability</h2>
                    <p>
                        In no event shall TheBrandManiacs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at: <br />
                        <strong className="text-violet-600">support@thebrandmaniacs.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
