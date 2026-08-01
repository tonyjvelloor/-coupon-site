import { prisma } from "@/lib/db";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";

export async function BestOffersModule() {
    const bestCoupons = await prisma.coupon.findMany({
        where: {
            type: "deal",
            isFeatured: true,
            expiresAt: { gt: new Date() },
        },
        include: { merchantIdentity: { include: { store: true } } },
        take: 8,
        orderBy: { qualityScore: "desc" },
    });

    if (!bestCoupons.length) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-slate-50 rounded-[2.5rem]">
            <SectionHeader 
                title="Today's Biggest Savings" 
                subtitle="These are the exact offers people are using to save big right now."
                action={{ label: "View all deals", href: "/best-offers" }} 
            />
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible gap-6 md:pb-0">
                {bestCoupons.map((coupon, index) => (
                    <div key={coupon.id} className="shrink-0 snap-start w-[300px] md:w-auto">
                        <PremiumOfferCard 
                            badgeLabel={index < 2 ? "Most Popular" : undefined}
                        coupon={{
                            id: coupon.id,
                            title: coupon.title,
                            description: coupon.description,
                            code: coupon.code,
                            type: coupon.type,
                            discountValue: coupon.discountValue || "SPECIAL DEAL",
                            affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                            isVerified: true,
                            isExclusive: coupon.isExclusive,
                            expiresAt: coupon.expiresAt
                        }}
                        storeName={coupon.merchantIdentity?.store?.name || 'Store'}
                        storeLogo={coupon.merchantIdentity?.store?.logo}
                    />
                    </div>
                ))}
            </div>
        </section>
    );
}
