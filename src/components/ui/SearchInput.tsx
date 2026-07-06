"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Store as StoreIcon, Tag } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";

interface SearchResult {
    stores: Array<{
        id: string;
        name: string;
        logo: string | null;
        slug: string;
    }>;
    coupons: Array<{
        id: string;
        title: string;
        code: string | null;
        discountValue: string | null;
        store: {
            name: string;
            logo: string | null;
        };
    }>;
}

export default function SearchInput() {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length >= 2) setIsOpen(true);
                    }}
                    placeholder="Search for stores, coupons, or categories..."
                    className="w-full h-12 md:h-14 pl-12 pr-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-transparent focus:border-violet-300 dark:focus:border-violet-600 focus:ring-4 focus:ring-violet-500/20 dark:focus:ring-violet-500/40 shadow-lg outline-none transition-all placeholder:text-gray-400 text-base md:text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-6 md:h-6" />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-700 text-white px-4 md:px-6 rounded-full font-medium transition-colors duration-200"
                >
                    Search
                </button>
            </form>

            {/* Dropdown Results */}
            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Searching...
                        </div>
                    ) : results && (results.stores.length > 0 || results.coupons.length > 0) ? (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {/* Stores Section */}
                            {results.stores.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">
                                        Stores
                                    </h3>
                                    {results.stores.map((store) => (
                                        <Link
                                            key={store.id}
                                            href={`/stores/${store.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                                                {store.logo ? (
                                                    <img src={store.logo} alt={store.name} className="w-6 h-6 object-contain" />
                                                ) : (
                                                    <StoreIcon className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 truncate">
                                                    {store.name}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Divider if both exist */}
                            {results.stores.length > 0 && results.coupons.length > 0 && (
                                <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2 my-1"></div>
                            )}

                            {/* Coupons Section */}
                            {results.coupons.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">
                                        Coupons
                                    </h3>
                                    {results.coupons.map((coupon) => (
                                        <Link
                                            key={coupon.id}
                                            // Assuming we link to store page for the coupon? Or a coupon modal?
                                            // Ideally homepage or store page with anchor. Let's link to store for now.
                                            href={`/stores/${coupon.store.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Tag className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                                                    {coupon.title}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                                    <span className="font-medium text-gray-600 dark:text-gray-400">{coupon.store.name}</span>
                                                    {coupon.discountValue && (
                                                        <span className="text-green-600 font-bold bg-green-50 px-1 rounded">
                                                            {coupon.discountValue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No matches found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
