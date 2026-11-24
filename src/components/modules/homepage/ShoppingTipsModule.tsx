import { SectionHeader } from "@/components/ui/SectionHeader";
import { KnowledgeCard } from "@/components/ui/KnowledgeCard";
import { prisma } from "@/lib/db";

export async function ShoppingTipsModule() {
    let dbTips: any[] = [];
    try {
        dbTips = await prisma.shoppingTip.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 4
        });
    } catch {
        dbTips = [];
    }

    const tips = dbTips.length > 0 ? dbTips : [
        { id: 't1', title: 'Stack bank card offers on Amazon', description: 'Check HDFC, ICICI, and SBI instant discount caps before checking out on electronics or appliances.', icon: 'credit_card', category: 'Bank Offers', href: '/banks/hdfc' },
        { id: 't2', title: 'How CouponHub verifies codes', description: 'See how our editorial process screens promo codes, minimum spend rules, and expiration dates.', icon: 'verified', category: 'Methodology', href: '/how-we-verify' },
        { id: 't3', title: 'Compare instant discount vs. cashback', description: 'Use our interactive calculator to factor in 18% GST on No-Cost EMI interest and processing fees.', icon: 'compare_arrows', category: 'Tools', href: '/tools/card-vs-cashback-calculator' },
        { id: 't4', title: 'Track seasonal sale calendars', description: 'Plan big-ticket buys around Black Friday, Cyber Monday, Myntra EORS, and festive sale windows.', icon: 'event', category: 'Guides', href: '/blog' },
    ];

    return (
        <div className="lg:col-span-2">
            <SectionHeader 
                title="Shopping Tips" 
                action={{ label: "Read more guides", href: "/knowledge" }} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip) => (
                    <KnowledgeCard key={tip.id} article={tip} />
                ))}
            </div>
        </div>
    );
}
