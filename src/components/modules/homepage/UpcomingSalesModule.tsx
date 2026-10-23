import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineWidget, TimelineEvent } from "@/components/ui/TimelineWidget";
import { getAllSaleEvents } from "@/lib/events-data";
import { format } from "date-fns";

export async function UpcomingSalesModule() {
    let sales: any[] = [];
    try {
        sales = await getAllSaleEvents();
    } catch (e) {
        // Fallback
    }

    const upcomingSales: TimelineEvent[] = sales.length > 0 ? sales.map(s => {
        const isDiwali = s.slug.includes("diwali") || s.slug.includes("indian-festival");
        const sDate = s.date instanceof Date ? s.date : new Date(s.date);
        
        return { 
            id: s.id, 
            title: s.title, 
            subtitle: s.subtitle || format(sDate, 'MMMM do'), 
            icon: s.icon || (isDiwali ? 'celebration' : 'event'), 
            isActive: isDiwali || false
        };
    }) : [
        { id: 'e1', title: 'Diwali Sale 2026', subtitle: 'Live Now', icon: 'celebration', isActive: true },
        { id: 'e2', title: 'Amazon Great Indian Festival', subtitle: 'Live Now', icon: 'local_fire_department', isActive: true },
        { id: 'e3', title: 'Flipkart Big Billion Days', subtitle: 'Live Now', icon: 'shopping_bag', isActive: true },
        { id: 'e4', title: 'Myntra End of Reason Sale', subtitle: 'Coming in December', icon: 'style' },
    ];

    return (
        <div className="lg:col-span-1">
            <SectionHeader title="Upcoming Sales" />
            <TimelineWidget events={upcomingSales} />
        </div>
    );
}
