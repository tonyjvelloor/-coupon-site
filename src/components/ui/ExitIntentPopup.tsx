"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import NewsletterSignup from "./NewsletterSignup";

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        // Only trigger once per session
        if (hasTriggered) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
                setIsVisible(true);
                setHasTriggered(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasTriggered]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="p-8">
                    <NewsletterSignup />
                    <p className="text-center text-xs text-gray-400 mt-4">
                        No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
