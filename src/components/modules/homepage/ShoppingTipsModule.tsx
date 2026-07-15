import { SectionHeader } from "@/components/ui/SectionHeader";
import { KnowledgeCard } from "@/components/ui/KnowledgeCard";
import { prisma } from "@/lib/db";

export async function ShoppingTipsModule() {
    const dbTips = await prisma.shoppingTip.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 4
    });

    const tips = dbTips.length > 0 ? dbTips : [
        { id: 't1', title: 'Use HDFC cards on Amazon', description: 'Get an instant 10% discount during major sales by keeping an HDFC card ready.', icon: 'credit_card', category: 'Bank Offers', href: '/guides/hdfc-amazon' },
        { id: 't2', title: 'Activate cashback before checkout', description: 'Always click through CouponHub to ensure your session is tracked for cashback.', icon: 'touch_app', category: 'Cashback', href: '/guides/cashback-tracking' },
        { id: 't3', title: 'Compare cashback providers', description: 'Rates change daily. Always check the store page to see who offers the most.', icon: 'compare_arrows', category: 'Strategy', href: '/guides/compare-cashback' },
        { id: 't4', title: 'Check student discounts', description: 'UNiDAYS and StudentBeans offer stackable 10-15% discounts at major fashion retailers.', icon: 'school', category: 'Discounts', href: '/guides/student-discounts' },
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
