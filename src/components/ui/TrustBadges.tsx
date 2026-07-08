"use client";

import { TrendingUp, Users, BadgeCheck, Zap } from "lucide-react";

const stats = [
    { icon: BadgeCheck, value: "50+", label: "Verified Stores" },
    { icon: Zap, value: "250+", label: "Live Deals" },
    { icon: TrendingUp, value: "98%", label: "Accuracy" },
    { icon: Users, value: "Real-time", label: "Verification" },
];

export default function TrustBadges() {
    return (
        <div className="w-full flex flex-row items-center justify-start xl:justify-between gap-2 xl:gap-3 overflow-x-auto no-scrollbar py-2 px-1 mt-6">
            {stats.map((stat, index) => (
                <div
                    key={stat.label}
                    className="trust-badge glass-card float-animation flex-shrink-0 whitespace-nowrap dark:bg-gray-800 dark:border-gray-700 !px-3.5 !py-2 font-medium"
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    <stat.icon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex flex-col items-start leading-tight">
                        <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-white">
                            {stat.value}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                            {stat.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
