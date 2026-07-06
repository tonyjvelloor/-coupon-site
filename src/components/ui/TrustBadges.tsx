"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, BadgeCheck, Zap } from "lucide-react";

const stats = [
    { icon: Users, value: 50000, label: "Happy Users", suffix: "+" },
    { icon: BadgeCheck, value: 500, label: "Verified Stores", suffix: "+" },
    { icon: TrendingUp, value: 95, label: "Success Rate", suffix: "%" },
    { icon: Zap, value: 24, label: "Support", suffix: "/7" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 50;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <span className="animated-number font-bold text-lg md:text-xl text-gray-900 dark:text-white">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

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
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                            {stat.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
