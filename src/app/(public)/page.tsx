import { Metadata } from "next";
import dynamic from 'next/dynamic';

// Modular Homepage Composition Layer
import { HeroModule } from "@/components/modules/homepage/HeroModule";
import { PopularStoresModule } from "@/components/modules/homepage/PopularStoresModule";
import { PersonalizedFeedModule } from "@/components/modules/homepage/PersonalizedFeedModule";
import { BestOffersModule } from "@/components/modules/homepage/BestOffersModule";
import { SavingsModule } from "@/components/modules/homepage/SavingsModule";
import { UpcomingSalesModule } from "@/components/modules/homepage/UpcomingSalesModule";
import { ShoppingTipsModule } from "@/components/modules/homepage/ShoppingTipsModule";
import { RecentlyUpdatedModule } from "@/components/modules/homepage/RecentlyUpdatedModule";
import { CategoriesModule } from "@/components/modules/homepage/CategoriesModule";

export const revalidate = 900;

export const metadata: Metadata = {
    title: "CouponHub | Save more every time you shop online",
    description: "Find verified coupons, cashback offers, payment discounts, and shopping tips for thousands of stores.",
};

// Dynamic Imports for heavy below-the-fold components
const DynamicNewsletter = dynamic(() => import('@/components/ui/NewsletterSignup'), { ssr: false });

export default function Home() {
    return (
        <div className="bg-background min-h-screen pb-24">
            
            {/* 1. HERO SECTION */}
            <HeroModule />

            {/* MAIN CONTENT - MODULAR ORCHESTRATION */}
            <div className="space-y-4 py-8">
                
                {/* 2. Popular Today (Intent) / Personalized Feed */}
                <PersonalizedFeedModule>
                    <PopularStoresModule />
                </PersonalizedFeedModule>

                {/* 3. Today's Best Coupons (Money Section) - Surface background inside module */}
                <BestOffersModule />

                {/* 4. Savings (Cashback & Card Offers) - White background inside module */}
                <SavingsModule />

                {/* Grid for Sales & Tips - White background */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-white dark:bg-black">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* 5. Upcoming Shopping Events */}
                        <UpcomingSalesModule />

                        {/* 6. Shopping Tips */}
                        <ShoppingTipsModule />
                    </div>
                </section>

                {/* 7. Recently Updated (Freshness Signal) - Surface background inside module */}
                <RecentlyUpdatedModule />

                {/* 8. Categories (Browsing behavior last) - White background inside module */}
                <CategoriesModule />

                {/* 9. Newsletter */}
                <div className="py-16">
                    <DynamicNewsletter />
                </div>

            </div>
        </div>
    );
}
