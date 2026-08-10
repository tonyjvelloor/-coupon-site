import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { getExperimentVariant } from "@/lib/ab-testing";

// Modular Homepage Composition Layer
import { HeroModule } from "@/components/modules/homepage/HeroModule";
import { TrustMarkersModule } from "@/components/modules/homepage/TrustMarkersModule";
import { PopularStoresModule } from "@/components/modules/homepage/PopularStoresModule";
import { PersonalizedFeedModule } from "@/components/modules/homepage/PersonalizedFeedModule";
import { BestOffersModule } from "@/components/modules/homepage/BestOffersModule";
import { SavingsModule } from "@/components/modules/homepage/SavingsModule";
import { UpcomingSalesModule } from "@/components/modules/homepage/UpcomingSalesModule";
import { ShoppingTipsModule } from "@/components/modules/homepage/ShoppingTipsModule";
import { RecentlyUpdatedModule } from "@/components/modules/homepage/RecentlyUpdatedModule";
import { CategoriesModule } from "@/components/modules/homepage/CategoriesModule";

export const revalidate = 0; // Disable static generation for A/B testing page

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
