"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, BadgeCheck, Share2, Wallet } from "lucide-react";
import confetti from "canvas-confetti";
import SaveDealButton from "./SaveDealButton";
import CountdownTimer from "./CountdownTimer";

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

            // Fire Confetti!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#a855f7', '#ec4899', '#f97316']
            });
        }

        // Open affiliate link in new tab for conversion
        setTimeout(() => {
            window.open(coupon.affiliateUrl, "_blank");
        }, 800);
    };

    const handleGetDeal = () => {
        window.open(coupon.affiliateUrl, "_blank");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative">
            {/* Save Button - Positioned top right */}
            <div className="absolute top-3 right-3 z-10">
                <SaveDealButton dealId={coupon.id} />
            </div>

            {/* Banner Image with potential Countdown Timer overlay */}
            {coupon.image && (
                <div className="relative h-32 w-full overflow-hidden">
                    <img
                        src={coupon.image}
                        alt={coupon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>

                    {coupon.expiresAt && (
                        <div className="absolute bottom-2 left-2 z-20">
                            <CountdownTimer expiresAt={coupon.expiresAt} />
                        </div>
                    )}
                </div>
            )}

            <div className="p-5 flex-1 relative">
                {/* Fallback Countdown Timer location if no image */}
                {!coupon.image && coupon.expiresAt && (
                    <div className="mb-3">
                        <CountdownTimer expiresAt={coupon.expiresAt} />
                    </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {coupon.isVerified && (
                        <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50 text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-green-500"></span>
                            </span>
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Verified Today
                        </span>
                    )}
                    {coupon.isExclusive && (
                        <span className="badge badge-exclusive flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Exclusive
                        </span>
                    )}
                    {coupon.bank && (
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                            <Wallet className="w-3 h-3" />
                            {coupon.bank} Offer
                        </span>
                    )}
                </div>

                {/* Store Info */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        {storeLogo ? (
                            <img src={storeLogo} alt={storeName} className="w-10 h-10 object-contain" />
                        ) : (
                            <span className="text-lg font-bold text-gray-400">
                                {storeName.charAt(0)}
                            </span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{storeName}</span>
                </div>

                {/* Discount Value */}
                {coupon.discountValue && (
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                        {coupon.discountValue}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {coupon.title}
                </h3>

                {/* Description */}
                {coupon.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                        {coupon.description}
                    </p>
                )}
            </div>

            {/* Action */}
            <div className="px-5 pb-5">
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: coupon.title,
                                    text: `Check out this deal: ${coupon.title}`,
                                    url: window.location.href,
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors ml-auto"
                        title="Share Deal"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
                {coupon.type === "coupon" && coupon.code ? (
                    showCode ? (
                        <div className="coupon-reveal animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg relative overflow-hidden">
                                {/* Success background pulse */}
                                {copied && (
                                    <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
                                )}
                                <code className="flex-1 text-center font-mono text-lg font-bold text-green-700 dark:text-green-400 relative z-10">
                                    {coupon.code}
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(coupon.code!);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded transition-colors relative z-10"
                                    title="Copy code"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <Copy className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    )}
                                </button>
                            </div>

                            <div className={`text-center text-sm font-medium mt-2 transition-all duration-300 ${copied ? 'text-green-600 dark:text-green-400 translate-y-0 opacity-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                {copied ? "Code copied! Redirecting..." : "Code copied to clipboard!"}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleRevealCode}
                            className="w-full relative overflow-hidden group/btn"
                        >
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-violet-500/25">
                                <span>Show Coupon Code</span>
                                <div className="flex items-center gap-1 text-sm opacity-80">
                                    <span className="blur-sm">SAVE</span>
                                    <span>••••</span>
                                </div>
                            </div>
                            {/* Hover shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                        </button>
                    )
                ) : (
                    <button
                        onClick={handleGetDeal}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-orange-500/25"
                    >
                        <span>Get Deal</span>
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
