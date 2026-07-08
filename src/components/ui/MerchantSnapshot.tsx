import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Stack } from './Stack';
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
        <Card interactive className="h-full">
            <Link href={`/stores/${store.slug}`} className="flex flex-col h-full group">
                <CardContent className="flex flex-col gap-4">
                    {/* Header: Logo and Title/Badge */}
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl border border-surface-200 dark:border-surface-800 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-surface group-hover:shadow-raised transition-all duration-normal">
                            {store.logo ? (
                                <Image
                                    src={store.logo}
                                    alt={store.name}
                                    width={64}
                                    height={64}
                                    className="object-contain p-2"
                                />
                            ) : (
                                <span className="font-bold text-2xl text-surface-400">{store.name.charAt(0)}</span>
                            )}
                        </div>
                        
                        <div className="flex flex-col justify-center flex-grow">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h3 className="font-bold text-lg text-merchant-900 dark:text-merchant-50 line-clamp-1">{store.name}</h3>
                                {isVerified && (
                                    <Icon name="verified" className="text-verified-600 dark:text-verified-400 shrink-0 text-xl" />
                                )}
                            </div>
                            <Stack direction="row" gap={8} align="center">
                                {store.cashbackRate && (
                                    <Badge variant="success">
                                        <Icon name="payments" className="mr-1 text-[10px]" />
                                        {store.cashbackRate}
                                    </Badge>
                                )}
                                {(store.healthScore || 95) > 80 && (
                                    <Badge variant="intelligence">
                                        <Icon name="health_and_safety" className="mr-1 text-[10px]" />
                                        {store.healthScore || 95} Trust
                                    </Badge>
                                )}
                            </Stack>
                        </div>
                    </div>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-surface-50 dark:bg-surface-900 rounded-lg p-3 flex flex-col justify-center border border-surface-100 dark:border-surface-800">
                            <div className="text-surface-500 dark:text-surface-400 flex items-center gap-1 mb-1">
                                <Icon name="local_offer" className="text-[12px]" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Offers</span>
                            </div>
                            <span className="font-bold text-merchant-900 dark:text-merchant-50 text-xl leading-none">{store.offerCount}</span>
                        </div>
                        <div className="bg-surface-50 dark:bg-surface-900 rounded-lg p-3 flex flex-col justify-center border border-surface-100 dark:border-surface-800">
                            <div className="text-surface-500 dark:text-surface-400 flex items-center gap-1 mb-1">
                                <Icon name="menu_book" className="text-[12px]" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">Guides</span>
                            </div>
                            <span className="font-bold text-merchant-900 dark:text-merchant-50 text-xl leading-none">{store.guideCount || 0}</span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="mt-auto !py-3 flex justify-between items-center text-xs font-medium text-surface-500 dark:text-surface-400">
                    <div className="flex items-center gap-1">
                        <Icon name="update" className="text-[14px]" />
                        {store.lastVerified || 'Verified recently'}
                    </div>
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide text-[10px] group-hover:translate-x-1 transition-transform">
                        Explore
                        <Icon name="arrow_forward" className="ml-0.5 text-[14px]" />
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}
