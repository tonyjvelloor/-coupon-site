import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { getExperimentVariant } from "@/lib/ab-testing";

// Modular Homepage Composition Layer
import { HeroModule } from "@/components/modules/homepage/HeroModule";
import { TrustMarkersModule } from "@/components/modules/homepage/TrustMarkersModule";
import { PopularStoresModule } from "@/components/modules/homepage/PopularStoresModule";
const PersonalizedFeedModule = dynamic(() => import("@/components/modules/homepage/PersonalizedFeedModule").then(mod => mod.PersonalizedFeedModule), { ssr: true });
const BestOffersModule = dynamic(() => import("@/components/modules/homepage/BestOffersModule").then(mod => mod.BestOffersModule), { ssr: true });
const SavingsModule = dynamic(() => import("@/components/modules/homepage/SavingsModule").then(mod => mod.SavingsModule), { ssr: true });
const UpcomingSalesModule = dynamic(() => import("@/components/modules/homepage/UpcomingSalesModule").then(mod => mod.UpcomingSalesModule), { ssr: true });
const ShoppingTipsModule = dynamic(() => import("@/components/modules/homepage/ShoppingTipsModule").then(mod => mod.ShoppingTipsModule), { ssr: true });
const RecentlyUpdatedModule = dynamic(() => import("@/components/modules/homepage/RecentlyUpdatedModule").then(mod => mod.RecentlyUpdatedModule), { ssr: true });
const CategoriesModule = dynamic(() => import("@/components/modules/homepage/CategoriesModule").then(mod => mod.CategoriesModule), { ssr: true });

export const revalidate = 3600; // Enable edge caching to save DB compute

export const metadata: Metadata = {
    title: "CouponHub | Save more every time you shop online",
    description: "Find verified coupons, cashback offers, payment discounts, and shopping tips for thousands of stores.",
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store",
    },
};

// Dynamic Imports for heavy below-the-fold components
// (Newsletter moved to Footer)

export default async function Home() {
    const heroCopyVariant = await getExperimentVariant("HOME_HERO_COPY");

    return (
        <div className="min-h-screen pb-24">
            
            {/* 1. HERO SECTION (Search & Trending Searches) */}
            <HeroModule variant={heroCopyVariant} />

            {/* 2. Confidence Proof */}
            <TrustMarkersModule />

            {/* MAIN CONTENT - MODULAR ORCHESTRATION */}
            <div className="space-y-4 py-8">
                
                {/* 3. Start Shopping (Merchant Grid) */}
                <PopularStoresModule />

                {/* 4. Trending Right Now (Categories) */}
                <CategoriesModule />

                {/* 5. Today's Biggest Savings */}
                <BestOffersModule />

            </div>
        </div>
    );
}
