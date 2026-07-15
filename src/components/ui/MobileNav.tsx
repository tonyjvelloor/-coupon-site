"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Tag, Store, Bookmark, User } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Search", href: "/search", icon: Search },
        { name: "Deals", href: "/deals", icon: Tag },
        { name: "Stores", href: "/stores", icon: Store },
        { name: "Saved", href: "/saved", icon: Bookmark },
        { name: "Profile", href: "/profile", icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith('/stores') && item.href === '/stores');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                                isActive ? "text-primary" : "text-surface-500 hover:text-surface-900 dark:hover:text-surface-100"
                            }`}
                            style={{ minWidth: "48px", minHeight: "48px" }} // Enforce 48px touch target
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
