import { SectionHeader } from "@/components/ui/SectionHeader";
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { couponService } from "@/lib/services/coupon.service";
import { formatDiscountBadge, getOfferBadgeLabel } from "@/lib/coupon-ranking";

const FALLBACK_BEST_OFFERS = [
    {
        id: "fallback-klook-unpack",
        title: "Extra ₹2,000 Off on Indian Hotels & Curated Experiences",
        description: "Apply promo code at Klook checkout on qualifying bookings.",
        code: "UNPACKINDIA",
        type: "coupon",
        discountType: "fixed",
        discountValue: "₹2,000 OFF",
        affiliateUrl: "https://www.klook.com/en-IN/",
        isVerified: true,
        isExclusive: true,
        merchantName: "Klook",
        merchantSlug: "klook",
        merchantLogo: "/images/stores/klook.jpg",
        expiresAt: null,
    },
    {
        id: "fallback-tatacliq-neu",
        title: "Tata CLiQ Luxury: Flat 12% Off for New Users + Bank Card Stacking",
        description: "Valid on select luxury fashion & watches.",
        code: "LUXNEW",
        type: "coupon",
        discountType: "percentage",
        discountValue: "12% OFF",
        affiliateUrl: "https://www.tatacliq.com/",
        isVerified: true,
        isExclusive: false,
        merchantName: "Tata Cliq",
        merchantSlug: "tata-cliq",
        merchantLogo: "/images/stores/tata-cliq.jpg",
        expiresAt: null,
    },
    {
        id: "fallback-nykaa-first",
        title: "Flat 20% Off on First Beauty & Skincare Order + Pink Friday Combos",
        description: "Apply at checkout on eligible skincare and cosmetics orders.",
        code: "NYKAA20",
        type: "coupon",
        discountType: "percentage",
        discountValue: "20% OFF",
        affiliateUrl: "https://www.nykaa.com/",
        isVerified: true,
        isExclusive: false,
        merchantName: "Nykaa Beauty",
        merchantSlug: "nykaa-beauty",
        merchantLogo: null,
        expiresAt: null,
    },
    {
        id: "fallback-airindia-mc",
        title: "Up to ₹600 Instant Off on Flight Bookings with Mastercard",
        description: "Applicable on domestic & select international routes.",
        code: "FLYMASTER",
        type: "coupon",
        discountType: "fixed",
        discountValue: "₹600 OFF",
        affiliateUrl: "https://www.airindiaexpress.com/",
        isVerified: true,
        isExclusive: false,
        merchantName: "Air India Express",
        merchantSlug: "air-india-express",
        merchantLogo: null,
        expiresAt: null,
    },
];

export async function BestOffersModule() {
    let bestCoupons: any[] = [];
    try {
        bestCoupons = await couponService.getBestCoupons(8, 1);
    } catch (err) {
        console.error("[BestOffersModule] Query failed, using fallback spotlight offers:", err);
    }

    const displayCoupons = bestCoupons.length > 0 ? bestCoupons : FALLBACK_BEST_OFFERS;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-slate-50 rounded-[2.5rem]">
            <SectionHeader
                title="Top Verified Coupons & Promo Codes"
                subtitle="Highest-value working promo codes and bank-stackable offers curated across top Indian stores."
                action={{ label: "View all top coupons", href: "/best-offers" }}
            />
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible gap-6 md:pb-0">
                {displayCoupons.map((coupon, index) => (
                    <div key={coupon.id} className="shrink-0 snap-start w-[300px] md:w-auto">
                        <PremiumOfferCard
                            highlight={index === 0}
                            badgeLabel={getOfferBadgeLabel(coupon, index)}
                            coupon={{
                                id: coupon.id,
                                title: coupon.title,
                                description: coupon.description,
                                code: coupon.code,
                                type: coupon.code ? "coupon" : coupon.type || "deal",
                                discountType: coupon.discountType,
                                discountValue: formatDiscountBadge(
                                    coupon.discountValue,
                                    coupon.discountType,
                                    coupon.title
                                ),
                                affiliateUrl: coupon.affiliateUrl || `/stores/${coupon.merchantSlug || ""}`,
                                isVerified: coupon.isVerified ?? true,
                                isExclusive: coupon.isExclusive ?? false,
                                expiresAt: coupon.expiresAt,
                                storeId: coupon.store?.id || coupon.storeId || null,
                            }}
                            storeName={coupon.merchantName || "Partner Store"}
                            storeLogo={coupon.merchantLogo}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
