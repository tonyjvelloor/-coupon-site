"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";

interface RedirectCountdownProps {
    destinationUrl: string;
    storeName?: string;
}

export default function RedirectCountdown({ destinationUrl, storeName }: RedirectCountdownProps) {
    const [progress, setProgress] = useState(0);
    const hasRedirected = useRef(false);

    // Fast redirect - 1.5 seconds total (just enough for content to render for bots)
    const REDIRECT_TIME_MS = 1500;
    const INTERVAL_MS = 50;

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / REDIRECT_TIME_MS) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= REDIRECT_TIME_MS && !hasRedirected.current) {
                hasRedirected.current = true;
                clearInterval(interval);
                window.location.href = destinationUrl;
            }
        }, INTERVAL_MS);

        return () => clearInterval(interval);
    }, [destinationUrl]);

    return (
        <div className="text-center space-y-4">
            {/* Animated loading indicator */}
            <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
                <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 1.76} 176`}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-violet-600 animate-pulse" />
                </div>
            </div>

            {/* Status text */}
            <div className="space-y-1">
                <p className="text-gray-700 font-medium flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                    Activating your deal...
                </p>
                <p className="text-sm text-gray-500">
                    Connecting to {storeName || "partner store"}
                </p>
            </div>

            {/* Instant proceed button (for impatient users) */}
            <a
                href={destinationUrl}
                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium text-sm"
            >
                Go now
                <ArrowRight className="w-4 h-4" />
            </a>
        </div>
    );
}
