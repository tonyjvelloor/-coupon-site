import { Metadata } from "next";
import dynamic from 'next/dynamic';

// Modular Homepage Composition Layer
import { HeroModule } from "@/components/modules/homepage/HeroModule";
import { TrustMarkersModule } from "@/components/modules/homepage/TrustMarkersModule";
import { PopularStoresModule } from "@/components/modules/homepage/PopularStoresModule";
import { SeasonalSpotlightBanner } from "@/components/modules/homepage/SeasonalSpotlightBanner";
import { FeaturedGuidesModule } from "@/components/modules/homepage/FeaturedGuidesModule";
import { AdBannerHorizontal } from "@/components/ui/AdBanner";
const BestOffersModule = dynamic(() => import("@/components/modules/homepage/BestOffersModule").then(mod => mod.BestOffersModule), { ssr: true });
const UpcomingSalesModule = dynamic(() => import("@/components/modules/homepage/UpcomingSalesModule").then(mod => mod.UpcomingSalesModule), { ssr: true });
const CategoriesModule = dynamic(() => import("@/components/modules/homepage/CategoriesModule").then(mod => mod.CategoriesModule), { ssr: true });
const NewsletterModule = dynamic(() => import("@/components/modules/homepage/NewsletterModule").then(mod => mod.NewsletterModule), { ssr: true });

export const revalidate = 21600; // 6h edge cache to keep Neon Free compute usage low

export const metadata: Metadata = {
    title: "CouponHub | Verified Coupons, Bank Offers & Sale Guides in India (Nov 2026)",
    description: "Find verified November 2026 coupon codes, Black Friday & Pink Friday deals, bank card discounts, and practical shopping guides for Amazon, Flipkart, Myntra, Ajio & more.",
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store",
    },
};

// Dynamic Imports for heavy below-the-fold components
// (Newsletter moved to Footer)

export default async function Home() {
    return (
        <div className="min-h-screen pb-24">
            
            {/* 1. HERO SECTION (Search & Trending Searches) */}
            <HeroModule 
                copyVariant="control" 
                layoutVariant="control" 
                topDeals={[]} 
            />

            {/* 2. Confidence Proof */}
            <TrustMarkersModule />

            {/* 2.5 SEASONAL SALE SPOTLIGHT */}
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-2">
                <SeasonalSpotlightBanner />
            </div>

            {/* MAIN CONTENT - MODULAR ORCHESTRATION */}
            <div className="space-y-6 py-6">
                
                {/* 3. Start Shopping (Merchant Grid) */}
                <PopularStoresModule />

                {/* 3.5 Upcoming Sales Timeline */}
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <UpcomingSalesModule />
                </div>

                {/* 4. Trending Right Now (Categories) */}
                <CategoriesModule />

                {/* 4.5 In-feed Compliant Ad Placement (renders only when slot env is set) */}
                <AdBannerHorizontal className="my-8" />

                {/* 5. Today's Biggest Savings */}
                <BestOffersModule />

                {/* 5.5 Original Editorial Buying Guides & Calculators */}
                <FeaturedGuidesModule />

                {/* 6. Newsletter Capture Engine */}
                <NewsletterModule />
            </div>
        </div>
    );
}
