"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MerchantNavProps {
    storeSlug: string;
    hasFaq: boolean;
    hasGuide: boolean;
}

export default function MerchantNav({ storeSlug, hasFaq, hasGuide }: MerchantNavProps) {
    const pathname = usePathname();
    const basePath = `/stores/${storeSlug}`;

    const links = [
        { name: "Coupons", href: basePath },
        ...(hasFaq ? [{ name: "FAQ", href: `${basePath}/faq` }] : []),
        ...(hasGuide ? [{ name: "Buying Guide", href: `${basePath}/buying-guide` }] : []),
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 mt-6">
            <nav className="flex gap-6">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                                isActive 
                                    ? "border-violet-600 text-violet-600" 
                                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
