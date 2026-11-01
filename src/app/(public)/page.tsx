import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { getExperimentVariant } from "@/lib/ab-testing";

// Modular Homepage Composition Layer
import { HeroModule } from "@/components/modules/homepage/HeroModule";
import { TrustMarkersModule } from "@/components/modules/homepage/TrustMarkersModule";
import { PopularStoresModule } from "@/components/modules/homepage/PopularStoresModule";
import { DiwaliFestiveBanner } from "@/components/modules/homepage/DiwaliFestiveBanner";
import { AdBannerHorizontal } from "@/components/ui/AdBanner";
const PersonalizedFeedModule = dynamic(() => import("@/components/modules/homepage/PersonalizedFeedModule").then(mod => mod.PersonalizedFeedModule), { ssr: true });
const BestOffersModule = dynamic(() => import("@/components/modules/homepage/BestOffersModule").then(mod => mod.BestOffersModule), { ssr: true });
const SavingsModule = dynamic(() => import("@/components/modules/homepage/SavingsModule").then(mod => mod.SavingsModule), { ssr: true });
const UpcomingSalesModule = dynamic(() => import("@/components/modules/homepage/UpcomingSalesModule").then(mod => mod.UpcomingSalesModule), { ssr: true });
const ShoppingTipsModule = dynamic(() => import("@/components/modules/homepage/ShoppingTipsModule").then(mod => mod.ShoppingTipsModule), { ssr: true });
const RecentlyUpdatedModule = dynamic(() => import("@/components/modules/homepage/RecentlyUpdatedModule").then(mod => mod.RecentlyUpdatedModule), { ssr: true });
const CategoriesModule = dynamic(() => import("@/components/modules/homepage/CategoriesModule").then(mod => mod.CategoriesModule), { ssr: true });
const NewsletterModule = dynamic(() => import("@/components/modules/homepage/NewsletterModule").then(mod => mod.NewsletterModule), { ssr: true });

export const revalidate = 3600; // Enable edge caching to save DB compute

export const metadata: Metadata = {
    title: "CouponHub | Save More with Verified Diwali Coupons & Promo Codes",
    description: "Find verified Diwali 2026 coupons, festive cashback offers, payment discounts, and shopping tips for Amazon, Flipkart, Ajio, Tata CLiQ & 100+ stores.",
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store",
    },
};

// Dynamic Imports for heavy below-the-fold components
// (Newsletter moved to Footer)

import { prisma } from "@/lib/db";

export default async function Home() {
    const heroCopyVariant = await getExperimentVariant("HOME_HERO_COPY");
    const heroLayoutVariant = await getExperimentVariant("HOME_HERO_LAYOUT");
    
    let heroDeals: any[] = [];
    if (heroLayoutVariant === "deals_in_hero") {
        heroDeals = await prisma.coupon.findMany({
            where: { isFeatured: true, expiresAt: { gt: new Date() } },
            take: 3,
            include: { merchantIdentity: { include: { store: true } } }
        });
    }

    return (
        <div className="min-h-screen pb-24">
            
            {/* 1. HERO SECTION (Search & Trending Searches) */}
            <HeroModule 
                copyVariant={heroCopyVariant} 
                layoutVariant={heroLayoutVariant} 
                topDeals={heroDeals} 
            />

            {/* 2. Confidence Proof */}
            <TrustMarkersModule />

            {/* 2.5 DIWALI FESTIVE SPOTLIGHT */}
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2">
                <DiwaliFestiveBanner />
            </div>

            {/* MAIN CONTENT - MODULAR ORCHESTRATION */}
            <div className="space-y-6 py-6">
                
                {/* 3. Start Shopping (Merchant Grid) */}
                <PopularStoresModule />

                {/* 3.5 Upcoming Festive Sales Timeline */}
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <UpcomingSalesModule />
                </div>

                {/* 4. Trending Right Now (Categories) */}
                <CategoriesModule />

                {/* 4.5 In-feed Compliant Ad Placement */}
                <AdBannerHorizontal className="my-8" />

                {/* 5. Today's Biggest Savings */}
                <BestOffersModule />

                {/* 6. Newsletter Capture Engine */}
                <NewsletterModule />
            </div>
        </div>
    );
}
