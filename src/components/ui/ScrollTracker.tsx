"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ScrollTracker() {
    useEffect(() => {
        let maxScroll = 0;
        const thresholds = [25, 50, 75, 100];
        const reported = new Set<number>();

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            const scrollPercent = (scrollTop / docHeight) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                thresholds.forEach(threshold => {
                    if (maxScroll >= threshold && !reported.has(threshold)) {
                        reported.add(threshold);
                        trackEvent('scroll_depth', { depth: threshold, url: window.location.pathname });
                    }
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return null;
}
