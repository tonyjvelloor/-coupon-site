import { prisma } from "@/lib/db";
import { MerchantCard } from "@/components/ui/MerchantCard";
import Link from "next/link";

const FALLBACK_POPULAR_STORES = [
    { id: 'store-amazon', name: 'Amazon', slug: 'amazon', logo: null, offerCount: 45, rating: 4.9, bestSavings: '₹1,500' },
    { id: 'store-flipkart', name: 'Flipkart', slug: 'flipkart', logo: null, offerCount: 38, rating: 4.8, bestSavings: '₹2,000' },
    { id: 'store-myntra', name: 'Myntra', slug: 'myntra', logo: null, offerCount: 32, rating: 4.8, bestSavings: '₹1,200' },
    { id: 'store-swiggy', name: 'Swiggy', slug: 'swiggy', logo: null, offerCount: 25, rating: 4.7, bestSavings: '₹250' },
    { id: 'store-ajio', name: 'AJIO', slug: 'ajio', logo: null, offerCount: 29, rating: 4.7, bestSavings: '₹800' },
    { id: 'store-off-duty', name: 'Off-Duty', slug: 'off-duty', logo: null, offerCount: 4, rating: 4.9, bestSavings: '15% OFF' },
];

export async function PopularStoresModule() {
    let popularStores: any[] = [];
    try {
        popularStores = await prisma.store.findMany({
            where: { isActive: true },
            take: 6,
            orderBy: { clicks: "desc" },
        });
    } catch (err) {
        console.error("[PopularStoresModule] DB query failed, using fallback stores:", err);
    }

    const storesToDisplay = popularStores.length ? popularStores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        logo: store.logo,
        offerCount: store.offerCount || 10,
        verified: true,
        rating: 4.8,
        bestSavings: store.cashbackRate ? `${store.cashbackRate} Cashback` : '₹500',
    })) : FALLBACK_POPULAR_STORES;


    return (
        <section className="bg-white py-16 transition-colors duration-300">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-display-lg text-title-md font-bold text-slate-900">Start Shopping</h2>
                        <p className="font-body-md text-body-md text-slate-500 mt-2">Find the highest cashback and best coupons for your favorite stores.</p>
                    </div>
                    <Link href="/stores" className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-brand-indigo hover:text-indigo-700 font-bold transition-colors">
                        View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storesToDisplay.map((store) => (
                        <MerchantCard 
                            key={store.id}
                            store={{
                                id: store.id,
                                name: store.name,
                                slug: store.slug,
                                logo: store.logo,
                                offerCount: store.offerCount,
                                verified: true,
                                rating: store.rating || 4.8,
                                bestSavings: store.bestSavings || '₹500',
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
