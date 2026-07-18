import Link from "next/link";
import Image from "next/image";
import { Tag, Wallet } from "lucide-react";

interface StoreCardProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate: string | null;
        offerCount: number;
        description?: string | null;
    };
}

export default function StoreCard({ store }: StoreCardProps) {
    return (
        <Link
            href={`/stores/${store.slug}`}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/60 p-4 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col h-full group"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 relative bg-white rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                    {store.logo ? (
                        <Image
                            src={store.logo}
                            alt={store.name}
                            fill
                            className="object-contain p-1.5"
                        />
                    ) : (
                        <Image
                            src={`https://icon.horse/icon/${store.slug.replace(/-/g, '')}.com`}
                            alt={store.name}
                            fill
                            className="object-contain p-1.5"
                            unoptimized
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{store.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                            <Tag className="w-3 h-3" />
                            {store.offerCount} Offers
                        </span>
                        {store.cashbackRate && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                                <Wallet className="w-3 h-3" />
                                {store.cashbackRate}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {store.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                    {store.description}
                </p>
            )}
        </Link>
    );
}
