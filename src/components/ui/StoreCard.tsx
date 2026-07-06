import Link from "next/link";
import Image from "next/image";
import { Store as StoreIcon, ChevronRight } from "lucide-react";

interface StoreCardProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate: string | null;
        offerCount: number;
    };
}

export default function StoreCard({ store }: StoreCardProps) {
    return (
        <Link
            href={`/stores/${store.slug}`}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-500 transition-all duration-300 group flex flex-col items-center text-center h-full"
        >
            {/* Logo */}
            <div className="w-20 h-20 relative bg-gray-50 dark:bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {store.logo ? (
                    <Image
                        src={store.logo}
                        alt={store.name}
                        fill
                        className="object-contain p-2"
                    />
                ) : (
                    <StoreIcon className="w-10 h-10 text-gray-400" />
                )}
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{store.name}</h3>
            {store.cashbackRate && (
                <span className="inline-block px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg mb-2">
                    {store.cashbackRate} Cashback
                </span>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                {store.description}
            </div>

            {/* Arrow */}
            <div className="mt-3 text-gray-400 group-hover:text-violet-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
            </div>
        </Link>
    );
}
