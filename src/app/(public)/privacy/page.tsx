export const metadata = {
    title: "Privacy Policy | CouponHub by TheBrandManiacs",
    description: "Privacy Policy for CouponHub. Operated by TheBrandManiacs.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none text-gray-600">
                    <p className="lead text-xl text-gray-900 font-medium mb-8">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <p>
                        Welcome to CouponHub. This Privacy Policy describes how TheBrandManiacs ("we", "us", or "our") collects, uses, and discloses your information when you use our website.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us for support, or create an account (if applicable). This may be:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Usage Data: Information about how you use our website, including pages visited and coupons clicked.</li>
                        <li>Device Information: Browser type, IP address, and other technical details.</li>
                        <li>Cookies: We use cookies to improve your experience and track affiliate referrals.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process affiliate transactions (tracking which store links you click).</li>
                        <li>Send you newsletters or updates (only if you subscribe).</li>
                        <li>Prevent fraud and ensure security.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Affiliate Disclosure</h2>
                    <p>
                        CouponHub is an affiliate marketing website operated by <strong>TheBrandManiacs</strong>. This means we may earn a commission when you click on links to various merchant sites and make a purchase. This does not affect the price you pay and helps us keep our service free.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Third-Party Links</h2>
                    <p>
                        Our website contains links to third-party websites (online stores). We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any store you visit.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at: <br />
                        <strong className="text-violet-600">support@thebrandmaniacs.com</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
