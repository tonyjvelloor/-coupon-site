"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, ShieldCheck, Clock, Info } from "lucide-react";
import SaveDealButton from "./SaveDealButton";

interface CouponCardProps {
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
    };
    storeName: string;
    storeLogo?: string | null;
}

export default function CouponCard({ coupon, storeName, storeLogo }: CouponCardProps) {
    const [showCode, setShowCode] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRevealCode = () => {
        setShowCode(true);
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
        // Open affiliate link instantly
        window.open(coupon.affiliateUrl, "_blank");
    };

    const handleGetDeal = () => {
        window.open(coupon.affiliateUrl, "_blank");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors flex flex-col h-full relative">
            <div className="absolute top-3 right-3 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 relative bg-gray-50 dark:bg-white rounded border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {storeLogo ? (
                            <Image src={storeLogo} alt={storeName} fill className="object-contain p-1" />
                        ) : (
                            <span className="text-lg font-bold text-gray-400">
                                {storeName.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{storeName}</span>
                        <div className="flex items-center gap-2 mt-1">
                            {coupon.isVerified && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified Today
                                </span>
                            )}
                            <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                98% Success
                            </span>
                        </div>
                    </div>
                </div>

                {coupon.discountValue && (
                    <div className="text-xl font-bold text-green-600 dark:text-green-500 mb-2">
                        {coupon.discountValue}
                    </div>
                )}

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {coupon.title}
                </h3>

                {coupon.expiresAt && (
                    <div className="text-xs text-red-600 font-medium mb-3">
                        Ends: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </div>
                )}
                
                <div className="mt-auto"></div>
            </div>

            <div className="px-4 pb-4">
                {coupon.type === "coupon" && coupon.code ? (
                    showCode ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded rounded-md">
                            <code className="flex-1 text-center font-mono font-bold text-gray-900 dark:text-white">
                                {coupon.code}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(coupon.code!);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center gap-1"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleRevealCode}
                            className="w-full flex items-center justify-between p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-md font-semibold transition-colors"
                        >
                            <span>Show Coupon Code</span>
                        </button>
                    )
                ) : (
                    <button
                        onClick={handleGetDeal}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
                    >
                        <span>Get Deal</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}
                <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-gray-400">
                    <Info className="w-3 h-3" />
                    We may earn a commission from links on this page.
                </div>
            </div>
        </div>
    );
}
