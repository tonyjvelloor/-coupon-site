import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from './Card';
import { Icon } from './Icon';

export interface MerchantSnapshotProps {
    store: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        cashbackRate?: string | null;
        offerCount: number;
        guideCount?: number;
        description?: string | null;
        verified?: boolean;
        healthScore?: number;
        lastVerified?: string;
    };
}

export function MerchantSnapshot({ store }: MerchantSnapshotProps) {
    const isVerified = store.verified !== false; 
    
    return (
        <Card interactive className="h-full border-surface-200 hover:border-primary transition-colors duration-300">
            <Link href={`/stores/${store.slug}`} className="flex flex-col h-full group p-5">
                
                {/* Header: Logo and Title */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl border border-surface-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {store.logo ? (
                            <Image
                                src={store.logo}
                                alt={store.name}
                                width={48}
                                height={48}
                                className="object-contain p-1"
                            />
                        ) : (
                            <span className="font-bold text-xl text-surface-400">{store.name.charAt(0)}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-center flex-grow">
                        <div className="flex items-center gap-1">
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{store.name}</h3>
                            {isVerified && (
                                <Icon name="verified" className="text-verified shrink-0 text-[18px]" variant="fill" />
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Core Metrics */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-surface-600 font-medium">Working Offers</span>
                        <span className="font-bold text-slate-900">{store.offerCount} Active</span>
                    </div>
                    {store.cashbackRate && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600 font-medium">Cashback</span>
                            <span className="font-bold text-green-600">{store.cashbackRate}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-surface-600 font-medium">Updated</span>
                        <span className="font-bold text-surface-900">{store.lastVerified || 'Today'}</span>
                    </div>
                </div>

                {/* Badges / Checked Capabilities */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-surface-100">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-50 text-surface-600 text-[10px] font-bold uppercase rounded-md border border-surface-200">
                        <Icon name="check" className="text-[12px] text-green-500" /> Shipping
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-50 text-surface-600 text-[10px] font-bold uppercase rounded-md border border-surface-200">
                        <Icon name="check" className="text-[12px] text-green-500" /> Returns
                    </span>
                </div>

            </Link>
        </Card>
    );
}
