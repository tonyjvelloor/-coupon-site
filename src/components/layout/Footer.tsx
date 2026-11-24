import Link from "next/link";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { CookiePreferencesButton } from "@/components/ui/CookiePreferencesButton";

const footerLinks = {
    stores: [
        { name: "Amazon Coupons", href: "/stores/amazon" },
        { name: "Flipkart Coupons", href: "/stores/flipkart" },
        { name: "Myntra Coupons", href: "/stores/myntra" },
        { name: "AJIO Coupons", href: "/stores/ajio" },
        { name: "All Partner Stores", href: "/stores" },
    ],
    categories: [
        { name: "Fashion Deals", href: "/best/fashion-coupons" },
        { name: "Electronics Deals", href: "/best/electronics-coupons" },
        { name: "Food & Dining", href: "/best/food-dining-coupons" },
        { name: "Travel Offers", href: "/best/travel-coupons" },
        { name: "Store Comparisons", href: "/compare" },
        { name: "All Categories", href: "/categories" },
    ],
    company: [
        { name: "About Us", href: "/about" },
        { name: "Blog & Guides", href: "/blog" },
        { name: "Editorial Policy", href: "/editorial-policy" },
        { name: "How We Verify Deals", href: "/how-we-verify" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Affiliate & Ad Disclosure", href: "/disclosure" },
        { name: "Site Map", href: "/html-sitemap" },
    ],
    popular: [
        { name: "My Cards Offer Finder", href: "/tools/card-finder" },
        { name: "Card vs. Cashback Tool", href: "/tools/card-vs-cashback-calculator" },
        { name: "Savings Calculators", href: "/tools" },
        { name: "HDFC Card Offers", href: "/banks/hdfc" },
        { name: "ICICI Card Offers", href: "/banks/icici" },
        { name: "SBI Card Discounts", href: "/banks/sbi" },
        { name: "Seasonal Sale Events", href: "/events" },
        { name: "First Order Coupons", href: "/offers/new-user-coupons" },
    ]
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <NewsletterSignup />
            <footer className="bg-inverse-surface text-inverse-on-surface py-16 mt-20 transition-colors duration-300">
                <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-5 gap-12 max-w-container-max mx-auto">
                    <div className="col-span-1 md:col-span-1">
                        <div className="font-headline-lg font-bold text-white mb-6 tracking-tight">couponhub</div>
                        <p className="text-surface-variant font-body-md text-body-md mb-8 opacity-80">
                            Editorial deal curation, verified promo codes, bank offer guides, and savings calculators for online shoppers in India.
                        </p>
                        <div className="flex gap-4">
                            <Link aria-label="CouponHub Blog" className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="/blog">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>article</span>
                            </Link>
                            <Link aria-label="RSS Feed" className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="/feed.xml">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>rss_feed</span>
                            </Link>
                            <Link aria-label="Contact CouponHub" className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="/contact">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>mail</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-title-md font-bold text-white mb-6">Top Stores</h4>
                        <ul className="space-y-4 text-surface-variant font-body-md text-body-md opacity-80">
                            {footerLinks.stores.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-secondary-fixed transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-title-md font-bold text-white mb-6">Top Categories</h4>
                        <ul className="space-y-4 text-surface-variant font-body-md text-body-md opacity-80">
                            {footerLinks.categories.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-secondary-fixed transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-title-md font-bold text-white mb-6">Savings &amp; Banks</h4>
                        <ul className="space-y-4 text-surface-variant font-body-md text-body-md opacity-80">
                            {footerLinks.popular.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-secondary-fixed transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-title-md font-bold text-white mb-6">Company &amp; Policies</h4>
                        <ul className="space-y-3 text-surface-variant font-body-md text-body-md opacity-80">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-secondary-fixed transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-16 pt-8 border-t border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-surface-variant font-body-md text-body-md opacity-80">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                        <p>© {currentYear} CouponHub. All rights reserved. Operated by TheBrandManiacs.</p>
                        <CookiePreferencesButton />
                    </div>
                    <p className="text-xs text-center md:text-right">
                        Advertiser Disclosure: We may earn affiliate commissions and display advertising through partners like Google AdSense.
                    </p>
                </div>
            </footer>
        </>
    );
}
