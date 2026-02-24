"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, BadgeCheck, Zap } from "lucide-react";

const stats = [
    { icon: Users, value: 50000, label: "Happy Users", suffix: "+" },
    { icon: BadgeCheck, value: 500, label: "Verified Stores", suffix: "+" },
    { icon: TrendingUp, value: 95, label: "Success Rate", suffix: "%" },
    { icon: Zap, value: 24, label: "Hour Support", suffix: "/7" },
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
        <span className="animated-number font-bold text-2xl md:text-3xl">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function TrustBadges() {
    return (
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
            {stats.map((stat, index) => (
                <div
                    key={stat.label}
                    className="trust-badge glass-card float-animation dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    <stat.icon className="trust-badge-icon" />
                    <div className="flex flex-col">
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
