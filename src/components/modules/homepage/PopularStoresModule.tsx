import { prisma } from "@/lib/db";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MerchantCard } from "@/components/ui/MerchantCard";

export async function PopularStoresModule() {
    const popularStores = await prisma.store.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { clicks: "desc" },
    });

    if (!popularStores.length) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto">
            <SectionHeader 
                title="People are loving these stores right now" 
                action={{ label: "View all stores", href: "/stores" }} 
            />
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible gap-4 md:pb-0">
                {popularStores.map((store) => (
                    <div key={store.id} className="shrink-0 snap-start w-[240px] md:w-auto">
                        <MerchantCard 
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
                    </div>
                ))}
            </div>
        </section>
    );
}
