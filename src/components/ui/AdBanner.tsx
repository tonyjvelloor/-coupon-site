"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
    slot?: string;
    format?: "auto" | "horizontal" | "vertical" | "rectangle";
    responsive?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export default function AdBanner({
    slot,
    format = "auto",
    responsive = true,
    className = "",
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    useEffect(() => {
        if (pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className={`ad-container my-6 flex justify-center ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-2697580332564903"
                data-ad-slot={slot || ""}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}

/** Horizontal banner ad for between content sections */
export function AdBannerHorizontal({ className = "" }: { className?: string }) {
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            <AdBanner format="horizontal" />
        </div>
    );
}

/** Sidebar/vertical ad for blog sidebars */
export function AdBannerSidebar() {
    return (
        <div className="sticky top-24">
            <AdBanner format="vertical" />
        </div>
    );
}

/** In-article rectangle ad */
export function AdBannerInArticle({ className = "" }: { className?: string }) {
    return (
        <div className={`my-8 ${className}`}>
            <AdBanner format="rectangle" />
        </div>
    );
}
