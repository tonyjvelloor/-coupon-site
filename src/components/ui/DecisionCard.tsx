"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Stack } from './Stack';
import { Icon } from './Icon';
import SaveDealButton from './SaveDealButton';

export interface DecisionCardProps {
    coupon: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountValue: string | null;
        affiliateUrl: string;
        image?: string | null;
        isVerified: boolean;
        isExclusive: boolean;
        bank?: string | null;
        expiresAt?: Date | string | null;
        successRate?: number;
    };
    storeName: string;
    storeLogo?: string | null;
}

export function DecisionCard({ coupon, storeName, storeLogo }: DecisionCardProps) {
    const [showCode, setShowCode] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        if (coupon.type === "coupon" && coupon.code) {
            setShowCode(true);
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        window.open(coupon.affiliateUrl, "_blank");
    };

    const isExpiringSoon = coupon.expiresAt && new Date(coupon.expiresAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

    return (
        <Card className="h-full relative group">
            <div className="absolute top-4 right-4 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            <CardContent className="flex flex-col gap-4">
                {/* Header: Store context */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-surface-200 dark:border-surface-800 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        {storeLogo ? (
                            <Image src={storeLogo} alt={storeName} width={40} height={40} className="object-contain p-1" />
                        ) : (
                            <span className="text-sm font-bold text-surface-400">{storeName.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{storeName}</span>
                        <Stack direction="row" gap={4} align="center" className="mt-0.5">
                            {coupon.isVerified && (
                                <Badge variant="verified">
                                    <Icon name="verified" className="mr-0.5 text-[10px]" /> Verified Today
                                </Badge>
                            )}
                            {(coupon.successRate || 98) > 90 && (
                                <span className="text-[10px] font-medium text-surface-500 flex items-center">
                                    <Icon name="trending_up" className="mr-0.5 text-[12px] text-success-600" /> 
                                    {coupon.successRate || 98}% Success
                                </span>
                            )}
                        </Stack>
                    </div>
                </div>

                {/* Core Proposition */}
                <div className="flex flex-col gap-2 mt-2">
                    {coupon.discountValue && (
                        <div className="text-3xl font-display-lg font-bold text-merchant-900 dark:text-merchant-50 leading-none">
                            {coupon.discountValue}
                        </div>
                    )}
                    <h3 className="text-lg font-bold text-merchant-800 dark:text-merchant-100 line-clamp-2 leading-snug">
                        {coupon.title}
                    </h3>
                </div>

                {/* Tags / Context */}
                <Stack direction="row" gap={8} wrap className="mt-2">
                    {coupon.isExclusive && (
                        <Badge variant="intelligence">
                            <Icon name="star" className="mr-1 text-[10px]" /> Exclusive
                        </Badge>
                    )}
                    {coupon.bank && (
                        <Badge variant="default">
                            <Icon name="account_balance" className="mr-1 text-[10px]" /> {coupon.bank}
                        </Badge>
                    )}
                    {isExpiringSoon && (
                        <Badge variant="urgency">
                            <Icon name="timer" className="mr-1 text-[10px]" /> Expiring Soon
                        </Badge>
                    )}
                </Stack>
                
                <div className="flex-grow" />
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
                {coupon.type === "coupon" && coupon.code ? (
                    showCode ? (
                        <div className="flex items-center gap-2 p-2 bg-surface-100 dark:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 rounded-lg">
                            <code className="flex-1 text-center font-mono font-bold text-lg text-merchant-900 dark:text-merchant-50 tracking-widest">
                                {coupon.code}
                            </code>
                            <Button 
                                variant={copied ? "primary" : "secondary"} 
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(coupon.code!);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                            >
                                <Icon name={copied ? "check" : "content_copy"} className="mr-1 text-[16px]" />
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    ) : (
                        <Button variant="primary" fullWidth size="lg" onClick={handleAction}>
                            Reveal Code
                        </Button>
                    )
                ) : (
                    <Button variant="primary" fullWidth size="lg" onClick={handleAction}>
                        Get Deal <Icon name="open_in_new" className="ml-1 text-[16px]" />
                    </Button>
                )}
                
                <div className="flex justify-between items-center text-[10px] text-surface-400 font-medium px-1">
                    <span className="flex items-center gap-1">
                        <Icon name="info" className="text-[12px]" /> Terms apply
                    </span>
                    {coupon.expiresAt && !isExpiringSoon && (
                        <span>Ends {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
