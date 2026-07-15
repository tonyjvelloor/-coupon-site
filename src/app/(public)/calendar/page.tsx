import { Icon } from "@/components/ui/Icon";
import { Metadata } from "next";
import { saleService } from "@/lib/services/sale.service";
import { merchantService } from "@/lib/services/merchant.service";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Shopping Calendar 2026 | Upcoming Sales & Events | CouponHub",
    description: "Plan your purchases around India's biggest sales. Never miss Prime Day, Big Billion Days, Great Indian Festival, and more.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store"}/calendar`,
    }
};

export const revalidate = 3600; // revalidate every hour

const STATUS_CONFIG: Record<string, { label: string; color: string; border: string }> = {
    PRIME_DAY: { label: "Amazon", color: "bg-blue-100 text-blue-700", border: "border-blue-200" },
    BLACK_FRIDAY: { label: "Black Friday", color: "bg-gray-900 text-white", border: "border-gray-700" },
    SALE: { label: "Sale Event", color: "bg-primary text-white", border: "border-primary-200" },
};

export default async function CalendarPage() {
    const [sales, featuredStores] = await Promise.all([
        saleService.getUpcomingSales(10),
        merchantService.getFeaturedMerchants(6),
    ]);

    // Always show a curated base calendar alongside any DB-driven events
    const staticEvents = [
        { id: 's1', storeName: 'Amazon', storeSlug: 'amazon', title: 'Prime Day Sale', startDate: 'July 18', endDate: 'July 19', description: 'Biggest discounts on Electronics, Alexa devices, and Fashion. Expect 40-70% off.', type: 'PRIME_DAY' },
        { id: 's2', storeName: 'Amazon & Flipkart', storeSlug: 'amazon', title: 'Independence Day Sale', startDate: 'Aug 8', endDate: 'Aug 12', description: 'Patriotic deals on mobiles, laptops, and appliances from top brands.', type: 'SALE' },
        { id: 's3', storeName: 'Flipkart', storeSlug: 'flipkart', title: 'Big Billion Days', startDate: 'September', endDate: 'September', description: 'The ultimate Flipkart sale of the year. Expect massive iPhone and Samsung drops.', type: 'SALE' },
        { id: 's4', storeName: 'Amazon', storeSlug: 'amazon', title: 'Great Indian Festival', startDate: 'October', endDate: 'October', description: "Amazon's festive season sale. Huge bank card discounts expected on every category.", type: 'SALE' },
        { id: 's5', storeName: 'Myntra', storeSlug: 'myntra', title: 'End of Reason Sale', startDate: 'December', endDate: 'December', description: "Myntra's fashion extravaganza. Up to 80% off on top brands.", type: 'SALE' },
    ];

    // Merge DB events first, then static fallback for any not already covered
    const dbIds = new Set(sales.map(s => s.title));
    const allEvents = [
        ...sales,
        ...staticEvents.filter(e => !dbIds.has(e.title))
    ];

    return (
        <div className="bg-surface-50 min-h-screen pb-24">
            {/* Hero */}
            <div className="bg-white border-b border-surface-200 py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 font-bold text-sm px-4 py-2 rounded-full mb-6 border border-primary-200">
                        <Icon name="event" className="text-[16px]" /> Shopping Calendar 2026
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline-lg font-bold text-slate-900 mb-4">
                        Plan Every Purchase.<br />Miss No Sale.
                    </h1>
                    <p className="text-lg text-surface-500 max-w-xl mx-auto">
                        Every major Indian shopping event, curated in one place. Set reminders and save the most money all year long.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-surface-200 rounded-full hidden md:block"></div>

                    <div className="space-y-8">
                        {allEvents.map((event, idx) => {
                            const config = STATUS_CONFIG[event.type] || STATUS_CONFIG.SALE;
                            const isNext = idx === 0;

                            return (
                                <div key={event.id} className="relative flex flex-col md:flex-row gap-6 md:gap-12 items-start group">
                                    {/* Timeline Dot */}
                                    <div className="hidden md:flex w-16 items-center justify-center relative z-10 shrink-0">
                                        <div className={`w-6 h-6 rounded-full bg-white border-4 ${isNext ? 'border-primary shadow-md scale-125' : 'border-surface-300'} group-hover:scale-125 transition-transform`}></div>
                                    </div>

                                    {/* Card */}
                                    <div className={`flex-1 bg-white rounded-2xl border ${isNext ? 'border-primary-200 shadow-md' : 'border-surface-200 shadow-sm'} p-6 hover:shadow-md transition w-full relative overflow-hidden`}>
                                        {isNext && (
                                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                                Up Next
                                            </div>
                                        )}
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
                                                        {event.storeName}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-slate-900 mb-1">{event.title}</h2>
                                                <p className="text-surface-500 text-sm">{event.description}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-primary flex items-center justify-end gap-1.5 text-lg">
                                                    <Icon name="calendar_month" className="text-[18px]" />
                                                    <span>{event.startDate}</span>
                                                </div>
                                                {event.storeSlug && (
                                                    <Link href={`/stores/${event.storeSlug}`} className="text-xs text-surface-400 hover:text-primary transition mt-1 block">
                                                        View Store →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center gap-3">
                                            <button className="flex items-center justify-center gap-2 py-2 px-5 bg-surface-50 hover:bg-surface-100 border border-surface-200 text-surface-700 font-semibold rounded-xl transition text-sm">
                                                <Icon name="notifications_none" className="text-[18px]" /> Remind Me
                                            </button>
                                            {event.storeSlug && (
                                                <Link href={`/stores/${event.storeSlug}`} className="flex items-center justify-center gap-2 py-2 px-5 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 font-semibold rounded-xl transition text-sm">
                                                    <Icon name="local_offer" className="text-[16px]" /> See Coupons
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Strategy Tip */}
                <div className="mt-16 bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center">
                    <Icon name="tips_and_updates" className="text-4xl text-primary-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Tip: Stack Your Savings</h3>
                    <p className="text-surface-600 max-w-lg mx-auto mb-6">
                        During any sale, use a promo code <strong>+</strong> cashback <strong>+</strong> bank card offer together. A ₹10,000 laptop can realistically cost ₹7,000.
                    </p>
                    <Link href="/stores" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition">
                        Browse All Stores <Icon name="arrow_forward" className="text-[16px]" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
