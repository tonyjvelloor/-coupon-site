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
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col h-full"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 relative bg-gray-50 dark:bg-white rounded border border-gray-100 flex items-center justify-center shrink-0">
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
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{store.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                            <Tag className="w-3 h-3" />
                            {store.offerCount} Offers
                        </span>
                        {store.cashbackRate && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                <Wallet className="w-3 h-3" />
                                {store.cashbackRate}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            {store.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    {store.description}
                </p>
            )}
        </Link>
    );
}
