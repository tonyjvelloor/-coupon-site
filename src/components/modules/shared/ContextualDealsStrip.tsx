import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { couponService } from "@/lib/services/coupon.service";
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { formatDiscountBadge, getOfferBadgeLabel } from "@/lib/coupon-ranking";

interface ContextualDealsStripProps {
    heading?: string;
    subtitle?: string;
    limit?: number;
}

export async function ContextualDealsStrip({
    heading = "Top Verified Promo Codes Ready to Apply",
    subtitle = "Copy a working code or activate a bank-stackable deal before checking out.",
    limit = 3,
}: ContextualDealsStripProps) {
    let offers: any[] = [];
    try {
        offers = await couponService.getBestCoupons(limit, 1);
    } catch {
        offers = [];
    }

    if (offers.length === 0) return null;

    return (
        <section className="my-12 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-slate-900/60 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-1">
                        <Tag className="w-3.5 h-3.5" />
                        Live Verified Offers
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {heading}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
                </div>
                <Link
                    href="/best-offers"
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-indigo hover:underline shrink-0"
                >
                    All Best Coupons <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {offers.map((coupon, index) => (
                    <PremiumOfferCard
                        key={coupon.id}
                        highlight={index === 0}
                        badgeLabel={getOfferBadgeLabel(coupon, index)}
                        coupon={{
                            ...coupon,
                            discountValue: formatDiscountBadge(
                                coupon.discountValue,
                                coupon.discountType,
                                coupon.title
                            ),
                        }}
                        storeName={coupon.merchantName}
                        storeLogo={coupon.merchantLogo}
                    />
                ))}
            </div>
        </section>
    );
}
