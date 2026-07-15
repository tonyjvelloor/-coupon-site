import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { saleService } from "@/lib/services/sale.service";

export async function ShoppingCalendarWidget() {
    const sales = await saleService.getUpcomingSales(3);

    if (sales.length === 0) return null;

    return (
        <section className="bg-surface-50 dark:bg-surface-900 border-y border-surface-200 dark:border-surface-800 py-12">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Icon name="event" className="text-primary" /> Upcoming Sales
                        </h2>
                        <p className="text-surface-500 mt-1">Don't miss the biggest drops of the year.</p>
                    </div>
                    <Link href="/calendar" className="text-primary font-bold hover:underline hidden sm:block">
                        View Full Calendar &rarr;
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sales.map((sale, index) => (
                        <div key={sale.id} className={`bg-white dark:bg-surface-950 border ${index === 0 ? 'border-2 border-primary-100 dark:border-primary-900' : 'border-surface-200 dark:border-surface-800'} rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition ${index > 1 ? 'hidden md:block' : ''}`}>
                            {index === 0 && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    Soonest
                                </div>
                            )}
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{sale.title}</h3>
                            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400 text-sm mb-4">
                                <Icon name="calendar_today" className="text-[16px]" /> {sale.startDate}
                                {sale.storeName && (
                                    <span className="bg-surface-100 text-surface-700 px-2 py-0.5 rounded text-xs ml-2 font-semibold">
                                        {sale.storeName}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-surface-500 mb-4">{sale.description}</p>
                            <button className={`w-full flex items-center justify-center gap-2 py-2 font-bold rounded-xl transition ${index === 0 ? 'bg-surface-100 hover:bg-primary hover:text-white text-slate-900' : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200'}`}>
                                <Icon name={index === 0 ? "notifications_active" : "notifications_none"} className="text-[18px]" /> Remind Me
                            </button>
                        </div>
                    ))}
                </div>
                
                <Link href="/calendar" className="mt-6 text-primary font-bold hover:underline sm:hidden block text-center">
                    View Full Calendar &rarr;
                </Link>
            </div>
        </section>
    );
}
