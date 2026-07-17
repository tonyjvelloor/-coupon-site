import Link from "next/link";
import NewsletterSignup from "@/components/ui/NewsletterSignup";

const footerLinks = {
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
            <footer className="bg-inverse-surface text-inverse-on-surface py-16 mt-20 transition-colors duration-300">
                <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-12 max-w-container-max mx-auto">
                    <div className="col-span-1 md:col-span-1">
                        <div className="font-headline-lg font-bold text-white mb-6 tracking-tight">couponhub</div>
                        <p className="text-surface-variant font-body-md text-body-md mb-8 opacity-80">Your ultimate destination for verified coupons, exclusive deals, and maximum cashback.</p>
                        <div className="flex gap-4">
                            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="#">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>facebook</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="#">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-brand-indigo transition-all text-white" href="#">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>mail</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-title-md font-bold text-white mb-6">Top Stores</h4>
                        <ul className="space-y-4 text-surface-variant font-body-md text-body-md opacity-80">
                            {footerLinks.stores.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-secondary-fixed transition-colors">
                                        {link.name} Coupons
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
                        <h4 className="font-title-md font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-surface-variant font-body-md text-body-md opacity-80">
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
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-16 pt-8 border-t border-surface-variant/20 flex flex-col md:flex-row justify-between items-center gap-4 text-surface-variant font-body-md text-body-md opacity-60">
                    <p>© {currentYear} couponhub. All rights reserved.</p>
                    <p>Verified savings updated daily.</p>
                </div>
            </footer>
        </>
    );
}
