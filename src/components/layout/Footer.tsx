import Link from "next/link";
import { Ticket, Mail, MapPin } from "lucide-react";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import CategoryLinkWall from "@/components/ui/CategoryLinkWall";

const footerLinks = {
    // ...

    stores: [
        { name: "Amazon", href: "/stores/amazon" },
        { name: "Flipkart", href: "/stores/flipkart" },
        { name: "Myntra", href: "/stores/myntra" },
        { name: "AJIO", href: "/stores/ajio" },
        { name: "All Stores", href: "/stores" },
    ],
    categories: [
        { name: "Fashion", href: "/category/fashion" },
        { name: "Electronics", href: "/category/electronics" },
        { name: "Food & Dining", href: "/category/food-dining" },
        { name: "Travel", href: "/category/travel" },
        { name: "All Categories", href: "/categories" },
    ],
    company: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <NewsletterSignup />
            <CategoryLinkWall />
            <footer className="bg-gray-900 text-gray-300">
                {/* Main Footer */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Brand */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                    <Ticket className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">CouponHub</span>
                            </Link>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                Your trusted destination for the best coupons, promo codes, and
                                deals. Save money on every purchase with verified offers from top
                                stores.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-violet-400" />
                                    <span>contact@couponhub.store</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-violet-400" />
                                    <span>Global Operations</span>
                                </div>
                            </div>
                        </div>

                        {/* Popular Stores */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Popular Stores</h3>
                            <ul className="space-y-2">
                                {footerLinks.stores.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Categories</h3>
                            <ul className="space-y-2">
                                {footerLinks.categories.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                © {currentYear} CouponHub. All rights reserved.
                            </p>
                            <p className="text-sm text-gray-500">
                                Made with ❤️ for smart shoppers worldwide
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
