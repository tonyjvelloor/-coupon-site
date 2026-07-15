'use client';

import { useEffect } from "react";

interface RecentStoreTrackerProps {
    storeSlug: string;
}

export function RecentStoreTracker({ storeSlug }: RecentStoreTrackerProps) {
    useEffect(() => {
        try {
            const history = JSON.parse(localStorage.getItem('recentlyViewedStores') || '[]');
            if (!history.includes(storeSlug)) {
                const newHistory = [storeSlug, ...history].slice(0, 5); // Keep last 5
                localStorage.setItem('recentlyViewedStores', JSON.stringify(newHistory));
            } else {
                // move to front
                const newHistory = [storeSlug, ...history.filter((s: string) => s !== storeSlug)];
                localStorage.setItem('recentlyViewedStores', JSON.stringify(newHistory));
            }
        } catch (error) {
            console.error("Failed to track recent store:", error);
        }
    }, [storeSlug]);

    return null;
}
