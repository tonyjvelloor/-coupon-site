import Link from "next/link";
import Image from "next/image";

interface StoreCardProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate: string | null;
        offerCount: number;
        description?: string | null;
        primaryCategory?: string; // We'll pass the primary category name
    };
    variant?: 'directory' | 'trending';
}

export default function StoreCard({ store, variant = 'directory' }: StoreCardProps) {
    const renderLogo = (sizeClasses: string, fallbackClasses: string) => (
        <div className={`${sizeClasses} bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:ring-2 ring-brand-indigo/20 transition-all`}>
            {store.logo && store.logo.trim() !== '' ? (
                <Image 
                    unoptimized 
                    src={store.logo}
                    alt={`${store.name} coupons`}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain p-1.5"
                />
            ) : (
                <span className={`font-bold uppercase ${fallbackClasses}`}>
                    {store.name.charAt(0)}
                </span>
            )}
        </div>
    );

    if (variant === 'trending') {
        return (
            <article className="bg-surface-card p-space-md rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full border border-slate-100 dark:border-slate-800">
                <div>
                    <div className="flex items-start justify-between mb-space-sm">
                        <div className="flex items-center gap-space-sm min-w-0 pr-2">
                            {renderLogo('w-12 h-12', 'text-xl text-slate-400')}
                            <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors truncate">{store.name}</h3>
                                    <span className="material-symbols-outlined text-verified-emerald text-[16px] shrink-0" title="Verified Partner">verified</span>
                                </div>
                                <span className="font-body-sm text-body-sm text-text-muted truncate block">{store.primaryCategory || 'Store'}</span>
                            </div>
                        </div>
                        <span className="font-label-badge text-label-badge bg-brand-indigo-light text-primary px-2 py-0.5 rounded-full shrink-0">
                            {store.offerCount} Offers
                        </span>
                    </div>
                    <div className="mb-space-sm">
                        {store.cashbackRate ? (
                            <span className="inline-flex items-center gap-1 font-label-badge text-label-badge bg-verified-emerald-bg text-secondary px-2.5 py-1 rounded-lg">
                                <span className="material-symbols-outlined text-[14px]">percent</span>
                                {store.cashbackRate}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 font-label-badge text-label-badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                                <span className="material-symbols-outlined text-[14px]">local_offer</span>
                                Top Coupons inside
                            </span>
                        )}
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted mb-space-md line-clamp-2">
                        {store.description || `Find the latest ${store.name} coupons, promo codes, and discount deals.`}
                    </p>
                </div>
                <Link 
                    href={`/stores/${store.slug}`}
                    className="inline-flex items-center justify-between w-full bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-primary font-label-btn text-label-btn px-space-md py-space-xs rounded-xl transition-all mt-auto"
                >
                    <span>View {store.offerCount} Offers</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
            </article>
        );
    }

    // Directory Variant
    return (
        <article className="store-item bg-surface-card p-space-md rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full group border border-slate-100 dark:border-slate-800">
            <div>
                <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-space-xs min-w-0 pr-2">
                        {renderLogo('w-10 h-10', 'text-lg text-slate-400')}
                        <div className="min-w-0">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">{store.name}</h3>
                            <span className="font-body-sm text-body-sm text-text-muted truncate block">{store.primaryCategory || 'Store'}</span>
                        </div>
                    </div>
                    <span className="font-label-badge text-label-badge bg-brand-indigo-light text-primary px-2 py-0.5 rounded-full shrink-0">
                        {store.offerCount} Offers
                    </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted my-space-xs line-clamp-1">
                    {store.description || `Find the latest ${store.name} coupons.`}
                </p>
                <div className="mb-space-sm">
                    {store.cashbackRate ? (
                        <span className="font-label-badge text-label-badge bg-verified-emerald-bg text-secondary px-2 py-0.5 rounded">
                            {store.cashbackRate}
                        </span>
                    ) : (
                        <span className="font-label-badge text-label-badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded">
                            Top Deals
                        </span>
                    )}
                </div>
            </div>
            <Link 
                href={`/stores/${store.slug}`}
                className="inline-flex items-center justify-between text-primary font-label-btn text-label-btn pt-space-xs hover:underline mt-auto"
            >
                <span>View Offers</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
        </article>
    );
}
