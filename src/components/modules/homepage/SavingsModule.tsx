import { SectionHeader } from "@/components/ui/SectionHeader";
import { SavingsCard } from "@/components/ui/SavingsCard";
import { prisma } from "@/lib/db";

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
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-white dark:bg-black">
            <SectionHeader 
                title="Extra Savings" 
                subtitle="Stack these with coupons for maximum value."
                action={{ label: "View all cashback", href: "/cashback" }} 
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {savingsData.map((saving) => (
                    <SavingsCard key={saving.id} savings={saving} />
                ))}
            </div>
        </section>
    );
}
