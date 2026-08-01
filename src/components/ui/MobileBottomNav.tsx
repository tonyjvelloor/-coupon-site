"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, LayoutGrid, Heart } from "lucide-react";
import { useGlobalSearch } from "../providers/GlobalSearchProvider";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { openSearch } = useGlobalSearch();

    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: Home
        },
        {
            name: "Search",
            action: openSearch,
            icon: Search
        },
        {
            name: "Categories",
            href: "/categories",
            icon: LayoutGrid
        },
        {
            name: "Saved",
            href: "/saved",
            icon: Heart
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = item.href === pathname;
                    const Icon = item.icon;
                    
                    const content = (
                        <>
                            <Icon className={`w-6 h-6 mb-1 ${isActive ? "text-brand-indigo" : "text-slate-400"}`} />
                            <span className={`text-[10px] font-medium ${isActive ? "text-brand-indigo" : "text-slate-500"}`}>
                                {item.name}
                            </span>
                        </>
                    );

                    const className = "flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] pt-1";

                    if (item.href) {
                        return (
                            <Link key={item.name} href={item.href} className={className}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button key={item.name} onClick={item.action} className={className}>
                            {content}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
