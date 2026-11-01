export const metadata = {
    title: "Privacy Policy | CouponHub",
    description: "Privacy Policy and Cookie Notice for CouponHub, including Google AdSense and third-party advertising disclosures.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen py-16 lg:py-24 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    Privacy Policy & Cookie Disclosure
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                    <p className="lead text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        Last Updated: November 1, 2026 | Effective Date: November 1, 2026
                    </p>

                    <p>
                        Welcome to <strong>CouponHub</strong> ("we", "our", or "us"), operated by TheBrandManiacs. We respect your privacy and are committed to protecting the personal data of all visitors and users of our website (<code>https://www.couponhub.store</code>).
                    </p>
                    <p>
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including our compliance with the <strong>Google AdSense Publisher Policies</strong>, <strong>General Data Protection Regulation (GDPR)</strong>, <strong>California Consumer Privacy Act (CCPA)</strong>, and India's <strong>Digital Personal Data Protection Act (DPDP)</strong>.
                    </p>

                    {/* Section 1 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        1. Information We Collect
                    </h2>
                    <p>
                        When you browse or interact with CouponHub, we may collect the following types of information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>
                            <strong>Voluntarily Provided Information:</strong> Email addresses provided when you subscribe to our Deal Alerts newsletter or contact customer support.
                        </li>
                        <li>
                            <strong>Automatically Collected Device & Usage Data:</strong> Internet Protocol (IP) address, browser type and version, operating system, referring URLs, pages viewed, time spent on pages, and clickstream data.
                        </li>
                        <li>
                            <strong>Cookies and Tracking Technologies:</strong> Standard browser cookies, web beacons, and device identifiers used to analyze traffic patterns, track affiliate referrals, and serve targeted advertisements.
                        </li>
                    </ul>

                    {/* Section 2 - GOOGLE ADSENSE DISCLOSURE (MANDATORY FOR APPROVAL) */}
                    <div className="my-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                        <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-0 mb-4">
                            2. Google AdSense & Third-Party Advertising Disclosures
                        </h2>
                        <p className="text-amber-950 dark:text-amber-200/90 leading-relaxed mb-4">
                            We use <strong>Google AdSense</strong> and other third-party advertising partners to serve advertisements when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-amber-950 dark:text-amber-200/90 mb-4">
                            <li>
                                <strong>Third-Party Vendors and Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites on the Internet.
                            </li>
                            <li>
                                <strong>Google's Advertising Cookies:</strong> Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads to our users based on their visits to our site and/or other sites across the Internet.
                            </li>
                            <li>
                                <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-900 dark:text-amber-100">Google Ads Settings</a>.
                            </li>
                            <li>
                                <strong>Third-Party Vendor Opt-Out:</strong> Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-900 dark:text-amber-100">www.aboutads.info</a> or <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-900 dark:text-amber-100">YourAdChoices</a>.
                            </li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        3. How We Use Cookies & How You Can Control Them
                    </h2>
                    <p>
                        Cookies are small text files stored on your device. We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Strictly Necessary Cookies:</strong> Essential for core website operations, page navigation, and security.</li>
                        <li><strong>Analytics & Performance Cookies:</strong> Measure traffic and page interactions to help us improve user experience.</li>
                        <li><strong>Affiliate Tracking Cookies:</strong> When you click on a store offer or promo code, a tracking cookie may be placed by our affiliate networks (e.g., Cuelinks, Amazon Associates, CJ) to credit commissions on qualifying purchases.</li>
                        <li><strong>Advertising Cookies:</strong> Set by Google AdSense and ad exchange partners to deliver relevant advertisements and cap ad frequency.</li>
                    </ul>
                    <p>
                        You can manage your cookie preferences at any time through your browser settings or via our on-site Cookie Consent banner. Note that disabling cookies may affect some website functionality.
                    </p>

                    {/* Section 4 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        4. Affiliate Marketing Disclosure
                    </h2>
                    <p>
                        CouponHub participates in various affiliate marketing programs. We may earn a commission when you click on merchant links and complete a transaction. This commission comes at <strong>no extra cost to you</strong>. For comprehensive details, please review our <a href="/disclosure" className="text-brand-indigo font-semibold underline">Affiliate Disclosure</a>.
                    </p>

                    {/* Section 5 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        5. Data Retention & Security
                    </h2>
                    <p>
                        We implement appropriate technical, administrative, and physical security measures to protect your personal data from unauthorized access, alteration, or disclosure. Newsletter subscriber data is securely retained until you choose to unsubscribe via the one-click unsubscribe link provided in every email.
                    </p>

                    {/* Section 6 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        6. Your Data Protection Rights
                    </h2>
                    <p>Depending on your location, you have rights under applicable privacy legislation, including:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>The right to access, update, or delete the personal information we hold about you.</li>
                        <li>The right to object to or restrict processing of your personal data.</li>
                        <li>The right to data portability.</li>
                        <li>The right to withdraw consent at any time without affecting the lawfulness of prior processing.</li>
                    </ul>

                    {/* Section 7 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        7. Children's Privacy
                    </h2>
                    <p>
                        CouponHub is not intended for children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a child, please contact us immediately.
                    </p>

                    {/* Section 8 */}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">
                        8. Contact Us
                    </h2>
                    <p>
                        If you have questions, comments, or data requests regarding this Privacy Policy or our advertising practices, please reach out to our privacy officer:
                    </p>
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1 text-sm">
                        <p><strong>CouponHub Privacy Office</strong></p>
                        <p>Operated by TheBrandManiacs</p>
                        <p>Email: <a href="mailto:support@thebrandmaniacs.com" className="text-brand-indigo font-bold">support@thebrandmaniacs.com</a></p>
                        <p>General Inquiries: <a href="mailto:contact@couponhub.store" className="text-brand-indigo font-bold">contact@couponhub.store</a></p>
                        <p>Website: <a href="https://www.couponhub.store" className="text-brand-indigo font-bold">https://www.couponhub.store</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
