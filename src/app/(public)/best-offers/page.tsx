import { prisma } from "@/lib/db";
import CouponCard from "@/components/ui/CouponCard";
import { Sparkles } from "lucide-react";

export const metadata = {
    title: "Best Offers & Hot Deals | CouponHub",
    description: "Browse the best verified coupons and hot deals of the day. Save massive amounts on your shopping.",
};

async function getBestOffers() {
    const coupons = await prisma.coupon.findMany({
        where: {
            OR: [
                { isFeatured: true },
                { isVerified: true },
                { discountType: "percentage" }, // Assuming high percentage deals are good
            ],
            expiresAt: {
                gte: new Date(), // Only active coupons
            },
        },
        include: { store: true },
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });
    return coupons;
}

export default async function BestOffersPage() {
    const coupons = await getBestOffers();

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                        <h1 className="text-3xl lg:text-5xl font-bold">Best Offers & Hot Deals</h1>
                    </div>
                    <p className="text-xl text-violet-100 max-w-2xl mx-auto">
                        Handpicked heavily discounted deals and verified functional coupons just for you.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                {coupons.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <CouponCard
                                key={coupon.id}
                                coupon={coupon}
                                storeName={coupon.store.name}
                                storeLogo={coupon.store.logo}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No hot deals found at the moment. Please check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
