"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SaveDealButtonProps {
    dealId: string;
    className?: string;
}

export default function SaveDealButton({ dealId, className = "" }: SaveDealButtonProps) {
    const [isSaved, setIsSaved] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check if deal is saved in localStorage
        const savedDeals = JSON.parse(localStorage.getItem("savedDeals") || "[]");
        setIsSaved(savedDeals.includes(dealId));
    }, [dealId]);

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const savedDeals = JSON.parse(localStorage.getItem("savedDeals") || "[]");

        if (isSaved) {
            // Remove from saved
            const updated = savedDeals.filter((id: string) => id !== dealId);
            localStorage.setItem("savedDeals", JSON.stringify(updated));
            setIsSaved(false);
        } else {
            // Add to saved
            savedDeals.push(dealId);
            localStorage.setItem("savedDeals", JSON.stringify(savedDeals));
            trackEvent('deal_saved', { dealId });
            setIsSaved(true);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <button
            onClick={toggleSave}
            className={`group relative p-2 rounded-full transition-all duration-300 ${isSaved
                    ? "bg-indigo-50 text-brand-indigo hover:bg-indigo-100"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-brand-indigo"
                } ${className}`}
            title={isSaved ? "Remove from saved" : "Save this deal"}
            aria-label={isSaved ? "Remove from saved" : "Save this deal"}
        >
            <Heart
                className={`w-5 h-5 transition-all duration-300 ${isSaved ? "fill-current" : ""
                    } ${isAnimating ? "scale-125" : "scale-100"}`}
            />
            {/* Pulse effect on save */}
            {isAnimating && (
                <span className="absolute inset-0 rounded-full bg-brand-indigo animate-ping opacity-25"></span>
            )}
        </button>
    );
}
