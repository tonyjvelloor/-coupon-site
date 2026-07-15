import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineWidget, TimelineEvent } from "@/components/ui/TimelineWidget";
import { prisma } from "@/lib/db";
import { formatDistanceToNowStrict, format } from "date-fns";

export async function UpcomingSalesModule() {
    const sales = await prisma.saleEvent.findMany({
        where: { isActive: true },
        orderBy: { date: 'asc' },
        take: 5
    });

    // Fallback to mocks if DB is empty for demo purposes
    const upcomingSales: TimelineEvent[] = sales.length > 0 ? sales.map(s => {
        const isPast = s.date.getTime() < Date.now();
        const diffDays = (s.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const isActive = !isPast && diffDays < 5; // Active if it's within the next 5 days
        
        return { 
            id: s.id, 
            title: s.title, 
            subtitle: s.subtitle || format(s.date, 'MMMM do'), 
            icon: s.icon, 
            isActive 
        };
    }) : [
        { id: 'e1', title: 'Prime Day', subtitle: '3 days away', icon: 'local_fire_department', isActive: true },
        { id: 'e2', title: 'Big Billion Days', subtitle: 'September', icon: 'event' },
        { id: 'e3', title: 'Great Indian Festival', subtitle: 'October', icon: 'celebration' },
        { id: 'e4', title: 'Diwali Sale', subtitle: 'October', icon: 'festival' },
    ];

    return (
        <div className="lg:col-span-1">
            <SectionHeader title="Upcoming Sales" />
            <TimelineWidget events={upcomingSales} />
        </div>
    );
}
