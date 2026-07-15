'use client';

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { DecisionCard } from "@/components/ui/DecisionCard";

export function PersonalizedDealsWidget() {
    const [deals, setDeals] = useState<any[]>([]);
    const [recentStores, setRecentStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPersonalization() {
            try {
                // Read from localStorage safely
                const savedStores = JSON.parse(localStorage.getItem('savedStores') || '[]');
                const wallet = JSON.parse(localStorage.getItem('userWallet') || '[]');
                const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedStores') || '[]');

                const res = await fetch('/api/personalization', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wallet, savedStores, recentlyViewed })
                });

                if (res.ok) {
                    const data = await res.json();
                    setDeals(data.curatedDeals || []);
                    setRecentStores(data.recentStores || []);
                }
            } catch (error) {
                console.error("Failed to load personalization:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPersonalization();
    }, []);

    if (loading) {
        return (
            <div className="pt-16 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
                <div className="lg:col-span-1 space-y-4">
                    <div className="h-8 bg-surface-200 rounded w-1/2"></div>
                    <div className="h-48 bg-surface-100 rounded-2xl"></div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <div className="h-8 bg-surface-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="h-32 bg-surface-100 rounded-2xl"></div>
                        <div className="h-32 bg-surface-100 rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (deals.length === 0 && recentStores.length === 0) return null;

    return (
        <div className="pt-16 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Recently Viewed */}
            {recentStores.length > 0 && (
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-headline-md font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="history" className="text-primary" /> Continue Shopping
                    </h2>
                    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-surface-100">
                            {recentStores.map(store => (
                                <Link key={store.id} href={`/stores/${store.slug}`} className="flex items-center justify-between p-4 hover:bg-surface-50 transition group">
                                    <div className="flex items-center gap-3">
                                        {store.logo && (
                                            <div className="w-10 h-10 border border-surface-200 rounded-lg flex items-center justify-center p-1 bg-white">
                                                <img src={store.logo} alt={store.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        )}
                                        <span className="font-semibold text-surface-700 group-hover:text-primary transition">{store.name}</span>
                                    </div>
                                    <Icon name="arrow_forward" className="text-surface-300 group-hover:text-primary transition" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* For You */}
            {deals.length > 0 && (
                <div className={recentStores.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                    <h2 className="text-xl font-headline-md font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="auto_awesome" className="text-primary" /> Recommended For You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deals.slice(0, 4).map(deal => (
                            <DecisionCard
                                key={deal.id}
                                coupon={{
                                    ...deal,
                                    successRate: 90 + Math.floor(Math.random() * 10),
                                    affiliateUrl: deal.affiliateUrl || `/go/${deal.id}`
                                }}
                                storeName={deal.merchantName}
                                storeLogo={deal.merchantLogo}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
