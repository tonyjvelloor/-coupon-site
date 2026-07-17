import { SavingsCard } from "@/components/ui/SavingsCard";
import { prisma } from "@/lib/db";
import Link from "next/link";

export async function SavingsModule() {
    const cashbackStores = await prisma.store.findMany({
        where: { isActive: true, cashbackRate: { not: null } },
        orderBy: { clicks: 'desc' },
        take: 4
    });

    const savingsData = cashbackStores.length > 0 ? cashbackStores.map(s => ({
        id: s.id,
        storeName: s.name,
        storeSlug: s.slug,
        logo: s.logo,
        value: s.cashbackRate || 'Up to 5%',
        type: 'cashback' as const,
        label: s.cashbackType || 'Cashback'
    })) : [
        { id: '1', storeName: 'Amazon', storeSlug: 'amazon', logo: null, value: '5%', type: 'cashback' as const, label: 'Cashback' },
        { id: '2', storeName: 'Flipkart', storeSlug: 'flipkart', logo: null, value: '4%', type: 'cashback' as const, label: 'Cashback' },
        { id: '3', storeName: 'Myntra', storeSlug: 'myntra', logo: null, value: '7%', type: 'cashback' as const, label: 'Cashback' },
        { id: '4', storeName: 'Ajio', storeSlug: 'ajio', logo: null, value: '10%', type: 'cashback' as const, label: 'Cashback' },
    ];

    if (!savingsData.length) return null;

    return (
        <section className="bg-surface-container-low dark:bg-black py-16 transition-colors duration-300">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-display-lg text-title-md font-bold text-on-surface dark:text-white">Extra Savings</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mt-2">Stack these with coupons for maximum value.</p>
                    </div>
                    <Link href="/cashback" className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-brand-indigo font-bold transition-colors">
                        View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {savingsData.map((saving) => (
                        <SavingsCard key={saving.id} savings={saving} />
                    ))}
                </div>
            </div>
        </section>
    );
}
