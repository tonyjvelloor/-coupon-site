"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MerchantNavProps {
    storeSlug: string;
}

export default function MerchantNav({ storeSlug }: MerchantNavProps) {
    const pathname = usePathname();
    const basePath = `/stores/${storeSlug}`;
    
    // Check if we're on the main store page or a subpage
    const isMainPage = pathname === basePath;

    // We use hash links for smooth scrolling on the main page.
    // If we're on a sub-page, we link back to the main page's hash.
    const links = [
        { name: "Coupons", href: basePath },
        { name: "Save More", href: isMainPage ? "#save-more" : `${basePath}#save-more` },
        { name: "Shopping Guide", href: isMainPage ? "#shopping-guide" : `${basePath}#shopping-guide` },
        { name: "About", href: isMainPage ? "#about" : `${basePath}#about` },
    ];

    // Simple active state logic based on hash would require scroll spy, 
    // but for simplicity we'll just check pathname for the "Coupons" tab
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 mt-6">
            <nav className="flex gap-6 overflow-x-auto no-scrollbar">
                {links.map((link) => {
                    const isActive = link.name === "Coupons" && isMainPage;
                    
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
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
