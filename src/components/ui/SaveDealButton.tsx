"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

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
            setIsSaved(true);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    return (
        <button
            onClick={toggleSave}
            className={`group relative p-2 rounded-full transition-all duration-300 ${isSaved
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-400"
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
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25"></span>
            )}
        </button>
    );
}
