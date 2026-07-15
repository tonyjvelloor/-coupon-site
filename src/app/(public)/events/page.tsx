import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
    title: "Upcoming Shopping Events & Sales - CouponHub",
    description:
        "Track upcoming sales events like Prime Day, Black Friday, and Diwali. Never miss a huge discount again.",
};

export const revalidate = 3600;

export default async function EventsIndexPage() {
    const events = await prisma.saleEvent.findMany({
        where: { isActive: true },
        orderBy: { date: "asc" },
    });

    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Shopping Events & Sales</h1>
                    <p className="text-orange-100 text-lg max-w-2xl">
                        Mark your calendar for the biggest savings of the year. Discover early access deals and prepare for massive price drops.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const isPast = new Date(event.date) < new Date();
                        return (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className={`bg-white rounded-xl border p-6 flex flex-col hover:shadow-lg transition-all group ${
                                    isPast ? 'border-gray-200 opacity-75' : 'border-orange-200 hover:border-orange-500'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                        <Icon name={event.icon || "event"} className="text-2xl" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        isPast ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {isPast ? 'Ended' : 'Upcoming'}
                                    </div>
                                </div>
                                
                                <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                                    {event.title}
                                </h2>
                                <p className="text-sm text-gray-500 mb-4">{event.subtitle}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-gray-700">
                                        {new Date(event.date).toLocaleDateString(undefined, {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-orange-600 font-bold group-hover:underline">View Deals</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {events.length === 0 && (
                    <div className="text-center py-20">
                        <Icon name="event_busy" className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No Upcoming Events</h3>
                        <p className="text-gray-500 mt-2">Check back later for new sale events.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
