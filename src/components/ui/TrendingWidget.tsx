import { prisma } from "@/lib/db";
import Link from "next/link";
import { TrendingUp, Flame } from "lucide-react";

export default async function TrendingWidget() {
    // Link Equity Engine: Fetch top clicked active coupons
    const trendingCoupons = await prisma.coupon.findMany({
        where: {
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
        },
        orderBy: { clicks: 'desc' },
        take: 5,
        include: { merchantIdentity: { include: { store: true } } }
    });

    if (trendingCoupons.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Trending Deals</h3>
            </div>
            
            <div className="space-y-4">
                {trendingCoupons.map((coupon, index) => (
                    <Link 
                        key={coupon.id} 
                        href={`/stores/${coupon.merchantIdentity?.store?.slug}`}
                        className="flex items-start gap-3 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700 text-gray-400 font-semibold text-sm group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                            {index + 1}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 transition-colors line-clamp-2">
                                {coupon.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                {coupon.merchantIdentity?.store?.name}
                                {coupon.clicks > 100 && (
                                    <span className="flex items-center text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-[10px] font-bold ml-1">
                                        <Flame className="w-3 h-3 mr-0.5" /> Hot
                                    </span>
                                )}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
