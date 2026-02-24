"use client";

import { useState, useEffect } from "react";
import { Clock, Flame } from "lucide-react";

interface CountdownTimerProps {
    expiresAt?: Date | string | null;
    className?: string;
}

export default function CountdownTimer({ expiresAt, className = "" }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!expiresAt) return;

        const targetDate = new Date(expiresAt);

        const updateTime = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setIsExpired(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    if (!mounted || !expiresAt || isExpired) return null;

    const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;

    return (
        <div className={`countdown-box inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border ${isUrgent
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 animate-pulse-slow'
                : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50'
            } ${className}`}>
            {isUrgent ? <Flame className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span className="tabular-nums tracking-wider uppercase">
                {timeLeft.days > 0 && `${timeLeft.days}D `}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            {isUrgent && <span className="ml-1 opacity-80">LEFT!</span>}
        </div>
    );
}
