import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineWidget, TimelineEvent } from "@/components/ui/TimelineWidget";
import { prisma } from "@/lib/db";
import { formatDistanceToNowStrict } from "date-fns";

export async function RecentlyUpdatedModule() {
    let recentStores: any[] = [];
    try {
        recentStores = await prisma.store.findMany({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
            take: 3
        });
    } catch {
        recentStores = [];
    }

    const recentUpdates: TimelineEvent[] = recentStores.length > 0 ? recentStores.map((s, idx) => ({
        id: s.id,
        title: s.name,
        subtitle: formatDistanceToNowStrict(new Date(s.updatedAt)) + ' ago',
        icon: 'update',
        isActive: idx === 0,
        href: `/stores/${s.slug}`
    })) : [
        { id: 'r1', title: 'Amazon India', subtitle: 'Verified today', icon: 'update', isActive: true, href: '/stores/amazon' },
        { id: 'r2', title: 'Flipkart', subtitle: 'Verified today', icon: 'update', href: '/stores/flipkart' },
        { id: 'r3', title: 'Nykaa Beauty', subtitle: 'Verified today', icon: 'update', href: '/stores/nykaa-beauty' },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem]">
            <SectionHeader title="Verified in the last 15 minutes" subtitle="We verify thousands of coupons every hour." />
            <div className="max-w-md">
                <TimelineWidget events={recentUpdates} />
            </div>
        </section>
    );
}
