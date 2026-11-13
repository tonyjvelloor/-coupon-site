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

    // Avoid rendering empty ad units without a valid AdSense slot ID;
    // AdSense Auto Ads uses the <head> script until manual slots are configured.
    const resolvedSlot = slot?.trim() || "";

    useEffect(() => {
        if (!resolvedSlot || pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [resolvedSlot]);

    if (!resolvedSlot) return null;

    return (
        <div className={`ad-container my-6 flex justify-center ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-2697580332564903"}
                data-ad-slot={resolvedSlot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}

/** Horizontal banner ad for between content sections */
export function AdBannerHorizontal({ className = "", slot }: { className?: string; slot?: string }) {
    const envSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL;
    if (!envSlot) return null;
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
            <AdBanner format="horizontal" slot={envSlot} />
        </div>
    );
}

/** Sidebar/vertical ad for blog sidebars */
export function AdBannerSidebar({ slot }: { slot?: string }) {
    const envSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
    if (!envSlot) return null;
    return (
        <div className="sticky top-24">
            <AdBanner format="vertical" slot={envSlot} />
        </div>
    );
}

/** In-article rectangle ad */
export function AdBannerInArticle({ className = "", slot }: { className?: string; slot?: string }) {
    const envSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE;
    if (!envSlot) return null;
    return (
        <div className={`my-8 ${className}`}>
            <AdBanner format="rectangle" slot={envSlot} />
        </div>
    );
}
