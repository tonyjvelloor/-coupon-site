"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function WhatsAppBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-[#25D366] text-white py-2 px-4 sticky top-0 z-[100] shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <a 
                    href="https://wa.me/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center sm:justify-start gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto text-sm sm:text-base"
                >
                    <MessageCircle className="w-5 h-5 animate-pulse" />
                    <span className="font-semibold text-center sm:text-left">
                        Join our WhatsApp for exclusive daily glitches & 90% off deals!
                    </span>
                    <span className="hidden sm:inline-flex bg-white/20 px-3 py-1 rounded-full text-xs font-bold ml-2">
                        Join Now
                    </span>
                </a>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Dismiss banner"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
