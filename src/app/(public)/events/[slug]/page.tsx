import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 900;

export async function generateStaticParams() {
    try {
        const events = await prisma.saleEvent.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return events.map((e) => ({ slug: e.slug }));
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const event = await prisma.saleEvent.findUnique({
        where: { slug, isActive: true },
    });

    if (!event) return { title: "Event Not Found" };

    const ogTitle = event.seoTitle || `${event.title} Offers & Coupons | CouponHub`;
    const ogDescription = event.description || `Find the best deals and biggest price drops for ${event.title}.`;

    return {
        title: ogTitle,
        description: ogDescription,
    };
}

export default async function EventPage({ params }: PageProps) {
    const { slug } = await params;

    const event = await prisma.saleEvent.findUnique({
        where: { slug, isActive: true },
        include: {
            store: true,
        },
    });

    if (!event) {
        notFound();
    }

    const isPast = new Date(event.date) < new Date();
    
    // In a real app, we would fetch coupons linked to this SaleEvent or tagged with it.
    // For now, we'll just fetch some global featured coupons if it's a global event,
    // or store-specific coupons if it's a store event.
    let deals = [];
    if (event.storeId) {
        deals = await prisma.coupon.findMany({
            where: { merchantIdentity: { canonicalStoreId: event.storeId }, isVerified: true },
            orderBy: { createdAt: "desc" },
            take: 12,
            include: { merchantIdentity: { include: { store: true } } }
        });
    } else {
        deals = await prisma.coupon.findMany({
            where: { isFeatured: true, isVerified: true },
            orderBy: { createdAt: "desc" },
            take: 12,
            include: { merchantIdentity: { include: { store: true } } }
        });
    }

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs items={[
                    { name: "Events", href: "/events" },
                    { name: event.title }
                ]} />
            </div>

            {/* Header */}
            <section className="bg-slate-900 text-white py-16 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
                
                <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-orange-400 font-semibold mb-6">
                        <Icon name={event.icon || "local_fire_department"} className="text-xl" />
                        {isPast ? 'Ended on' : 'Starts on'} {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                        })}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-headline-lg font-bold mb-6 tracking-tight">
                        {event.title}
                    </h1>
                    
                    <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                        {event.description || event.subtitle || `Discover the massive discounts and offers dropping for ${event.title}.`}
                    </p>

                    {event.store && (
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-slate-400">Exclusive event by:</span>
                            <Link href={`/store/${event.store.slug}`} className="text-white font-bold underline decoration-orange-500 underline-offset-4">
                                {event.store.name}
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="loyalty" className="text-2xl text-orange-600" />
                        <h2 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white">
                            {event.title} Deals
                        </h2>
                    </div>

                    {deals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {deals.map((deal) => (
                                <Link key={deal.id} href={`/out?url=${encodeURIComponent(deal.affiliateUrl)}&source=event-page&couponId=${deal.id}`} target="_blank" className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all flex flex-col h-full group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                                            {deal.discountValue || deal.type}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {deal.title}
                                    </h3>
                                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-4 flex-grow">
                                        {deal.description}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-surface-100 dark:border-surface-800 text-sm font-semibold text-center text-orange-600">
                                        {deal.code ? 'Show Coupon Code' : 'Get Deal'}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
                            <Icon name="inventory_2" className="text-4xl text-surface-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No deals revealed yet</h3>
                            <p className="text-surface-500 max-w-md mx-auto mb-6">
                                The deals for this event haven't been revealed or are currently being updated.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
