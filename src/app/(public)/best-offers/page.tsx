import { couponService } from "@/lib/services/coupon.service";
import CouponCard from "@/components/ui/CouponCard";
import { Sparkles } from "lucide-react";

export const metadata = {
    title: "Best Offers & Hot Deals | CouponHub",
    description: "Browse the best verified coupons and hot deals of the day. Save massive amounts on your shopping.",
};

async function getBestOffers() {
    return await couponService.getRecentCoupons(50);
}

export default async function BestOffersPage() {
    const coupons = await getBestOffers();

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero */}
            <div className="relative overflow-hidden bg-slate-900 border-b border-gray-800 py-16 lg:py-24">
                {/* Background Glow Blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold tracking-wide text-gray-300 uppercase">Daily Handpicked Deals</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white">
                        Best Offers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient bg-[length:200%_auto]">Hot Deals</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
                        Save massive amounts on your shopping with verified functional coupons that actually work.
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
                                storeName={coupon.merchantName}
                                storeLogo={coupon.merchantLogo}
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
