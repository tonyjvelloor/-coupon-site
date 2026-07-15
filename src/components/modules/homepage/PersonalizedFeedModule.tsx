"use client";

import React, { useEffect, useState } from 'react';
import { useShoppingProfile } from "@/components/providers/UserProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MerchantCard } from "@/components/ui/MerchantCard";
import { MerchantCardSkeleton } from "@/components/ui/SkeletonCards";

interface PersonalizedFeedModuleProps {
    children: React.ReactNode;
}

export function PersonalizedFeedModule({ children }: PersonalizedFeedModuleProps) {
    const { profile, isLoaded } = useShoppingProfile();
    const [recommendedStores, setRecommendedStores] = useState<any[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);

    // Only attempt to personalize if they have a sufficient profile
    const hasProfile = profile.recentlyViewed.length > 0 || profile.savedStores.length > 0;

    useEffect(() => {
        if (!isLoaded) return;
        
        if (!hasProfile) {
            setLoadingRecommendations(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                // Combine recent and saved, remove duplicates
                const slugs = Array.from(new Set([
                    ...profile.recentlyViewed.map(s => s.slug),
                    ...profile.savedStores
                ])).slice(0, 6); // Just top 6 for the homepage rail

                const res = await fetch('/api/recommendations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slugs })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setRecommendedStores(data.stores);
                }
            } catch (err) {
                console.error("Failed to fetch personalized feed", err);
            } finally {
                setLoadingRecommendations(false);
            }
        };

        fetchRecommendations();
    }, [isLoaded, profile, hasProfile]);

    // During SSR or initial hydration phase, render the static children for SEO
    // We only swap it out once the client has loaded and confirmed they have a profile
    if (!isLoaded) {
        return <div className="animate-pulse">{children}</div>;
    }

    if (!hasProfile || (hasProfile && !loadingRecommendations && recommendedStores.length === 0)) {
        return <>{children}</>;
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-white dark:bg-black transition-all duration-500">
            <SectionHeader 
                title="Continue Shopping" 
                action={{ label: "View your dashboard", href: "/saved" }} 
            />
            
            {loadingRecommendations ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <MerchantCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {recommendedStores.map((store) => (
                        <MerchantCard 
                            key={store.id}
                            store={{
                                id: store.id,
                                name: store.name,
                                slug: store.slug,
                                logo: store.logo,
                                offerCount: store.offerCount || Math.floor(Math.random() * 20) + 5,
                                verified: true,
                                rating: 4.5 + Math.random() * 0.5,
                                bestSavings: `₹${(Math.floor(Math.random() * 20) + 1) * 100}`,
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
