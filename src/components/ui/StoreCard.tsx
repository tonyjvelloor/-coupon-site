import Link from "next/link";
import Image from "next/image";
import { Store as StoreIcon, ChevronRight, Tag, Wallet } from "lucide-react";

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
            className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-4 hover:border-surface-300 dark:hover:border-surface-600 transition-colors flex flex-col h-full"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 relative bg-surface-50 dark:bg-white rounded border border-surface-100 flex items-center justify-center shrink-0">
                    {store.logo ? (
                        <Image
                            src={store.logo}
                            alt={store.name}
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <StoreIcon className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{store.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-700 px-1.5 py-0.5 rounded">
                            <Tag className="w-3 h-3" />
                            {store.offerCount} Offers
                        </span>
                        {store.cashbackRate && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                                <Wallet className="w-3 h-3" />
                                {store.cashbackRate}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            {store.description && (
                <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mt-2">
                    {store.description}
                </p>
            )}
        </Link>
    );
}
