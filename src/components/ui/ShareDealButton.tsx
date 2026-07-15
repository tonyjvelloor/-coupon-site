"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ShareDealButtonProps {
    dealId: string;
    title: string;
    storeName?: string;
    className?: string;
}

export default function ShareDealButton({ dealId, title, storeName, className = "" }: ShareDealButtonProps) {
    const [isShared, setIsShared] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = `${window.location.origin}/go/${dealId}`;
        const shareTitle = storeName ? `${storeName} Deal: ${title}` : title;
        const shareText = `Found this amazing deal on CouponHub: ${shareTitle}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareUrl);
                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
            }
        } catch (error) {
            console.log("Error sharing", error);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`group relative p-2 rounded-full transition-all duration-300 bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 ${className}`}
            title="Share this deal"
            aria-label="Share this deal"
        >
            {isShared ? (
                <Check className="w-4 h-4" />
            ) : (
                <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
        </button>
    );
}
