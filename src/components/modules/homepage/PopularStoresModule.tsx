import { prisma } from "@/lib/db";
import { MerchantCard } from "@/components/ui/MerchantCard";
import Link from "next/link";

export async function PopularStoresModule() {
    const popularStores = await prisma.store.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { clicks: "desc" },
    });

    if (!popularStores.length) return null;

    return (
        <section className="bg-surface-bright dark:bg-black py-16 transition-colors duration-300">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-display-lg text-title-md font-bold text-on-surface dark:text-white">Top Performing Stores</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mt-2">The highest cashback and best coupons available today.</p>
                    </div>
                    <Link href="/stores" className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-brand-indigo font-bold transition-colors">
                        View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularStores.map((store) => (
                        <MerchantCard 
                            key={store.id}
                            store={{
                                id: store.id,
                                name: store.name,
                                slug: store.slug,
                                logo: store.logo,
                                offerCount: store.offerCount || Math.floor(Math.random() * 20) + 5,
                                verified: true,
                                rating: 4.5 + Math.random() * 0.5,
                                bestSavings: `₹${(Math.floor(Math.random() * 20) + 1) * 100}`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
