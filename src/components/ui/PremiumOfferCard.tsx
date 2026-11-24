"use client";

import { useState } from "react";
import { SafeImage } from "./SafeImage";
import { Copy, Check, ExternalLink, ShieldCheck, Tag, Clock } from "lucide-react";
import SaveDealButton from "./SaveDealButton";
import { trackEvent } from "@/lib/analytics";
import { useCouponModal } from "../providers/CouponModalProvider";
import confetti from "canvas-confetti";
import { SavingsBadge } from "./DesignBadges";
import { cleanCouponCode, formatDiscountBadge } from "@/lib/coupon-ranking";

interface PremiumOfferCardProps {
    coupon: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountType?: string | null;
        discountValue: string | null;
        affiliateUrl: string;
        image?: string | null;
        isVerified: boolean;
        isExclusive: boolean;
        bank?: string | null;
        expiresAt?: Date | string | null;
        successRate?: number;
        successCount?: number;
        failureCount?: number;
        storeId?: string | null;
    };
    storeName: string;
    storeLogo?: string | null;
    badgeLabel?: string;
    highlight?: boolean;
    source?: string;
}

/** Masks the second half of a code: "FIRST10" -> "FIRS•••" */
function maskCode(code: string): string {
    const visibleLen = Math.ceil(code.length / 2);
    return code.slice(0, visibleLen) + "•".repeat(Math.max(2, code.length - visibleLen));
}

export function PremiumOfferCard({
    coupon,
    storeName,
    storeLogo,
    badgeLabel,
    highlight = false,
    source = "coupon-card",
}: PremiumOfferCardProps) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activated, setActivated] = useState(false);
    const { openCouponModal } = useCouponModal();

    const cleanedCode = cleanCouponCode(coupon.code);
    const hasCouponCode = Boolean(cleanedCode);
    const formattedSavings = formatDiscountBadge(coupon.discountValue, coupon.discountType, coupon.title);

    const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
    const computedSuccessRate =
        initialTotalVotes > 0 ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100) : null;

    const expiryDate = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
    const isActiveExpiry = expiryDate ? expiryDate.getTime() > Date.now() : false;
    const isExpiringSoon =
        expiryDate && isActiveExpiry
            ? expiryDate.getTime() - Date.now() < 5 * 24 * 60 * 60 * 1000
            : false;

    const handleRevealAndCopy = (e: React.MouseEvent) => {
        setRevealed(true);
        if (cleanedCode) {
            navigator.clipboard?.writeText(cleanedCode).catch(() => {});
            setCopied(true);

            try {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;
                confetti({
                    particleCount: 40,
                    spread: 50,
                    origin: { x, y },
                    colors: ["#6366f1", "#10b981", "#f59e0b"],
                    disableForReducedMotion: true,
                    zIndex: 100,
                });
            } catch {}

            setTimeout(() => setCopied(false), 3000);
        }

        trackEvent("coupon_copied", { couponId: coupon.id });

        const clickSource = `${source}-copy`;
        openCouponModal({
            ...coupon,
            code: cleanedCode || undefined,
            description: coupon.description || undefined,
            storeName,
            storeLogo: storeLogo || undefined,
            source: clickSource,
        });

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&storeId=${coupon.storeId || "none"}&couponId=${coupon.id}&source=${encodeURIComponent(clickSource)}&type=code`;
        window.open(outUrl, "_blank", "noopener,noreferrer");
    };

    const handleGetDeal = () => {
        setActivated(true);
        trackEvent("deal_clicked", { couponId: coupon.id });

        const clickSource = `${source}-deal`;
        openCouponModal({
            ...coupon,
            code: undefined,
            description: coupon.description || undefined,
            storeName,
            storeLogo: storeLogo || undefined,
            source: clickSource,
        });

        const outUrl = `/out?url=${encodeURIComponent(coupon.affiliateUrl)}&storeId=${coupon.storeId || "none"}&couponId=${coupon.id}&source=${encodeURIComponent(clickSource)}&type=deal`;
        window.open(outUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div
            className={`bg-white rounded-2xl border transition-all duration-200 hover:-translate-y-1 flex flex-col relative group p-6 ${
                highlight
                    ? "border-brand-indigo/60 ring-2 ring-brand-indigo/15 shadow-premium-md"
                    : "border-slate-200 hover:border-slate-300 shadow-premium-sm hover:shadow-premium-md"
            }`}
        >
            {/* Header: Store Info & Save Deal */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 relative bg-white rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        <SafeImage
                            unoptimized
                            src={storeLogo}
                            alt={storeName}
                            fill
                            className="object-contain p-2"
                            fallbackText={storeName}
                            fallbackClassName="text-sm font-bold text-slate-400"
                        />
                    </div>

                    <div className="min-w-0">
                        <span className="text-label text-slate-900 block leading-tight truncate">{storeName}</span>
                        {badgeLabel && (
                            <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    highlight
                                        ? "bg-brand-indigo text-white"
                                        : "bg-brand-indigo/10 text-brand-indigo"
                                }`}
                            >
                                {badgeLabel}
                            </span>
                        )}
                    </div>
                </div>

                <SaveDealButton dealId={coupon.id} />
            </div>

            {/* 1. Formatted Savings Headline */}
            <SavingsBadge value={formattedSavings} className="mb-2" />

            {/* 2. Coupon Title */}
            <h3 className="text-body font-medium text-slate-800 leading-snug mb-4 line-clamp-2">
                {coupon.title}
            </h3>

            {/* 3. Factual Offer Metadata */}
            <div className="mt-auto grid grid-cols-2 gap-2 py-3 px-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Tag className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                    <span>{hasCouponCode ? "Promo Code" : "Auto-Applied Deal"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 font-medium justify-end">
                    {isExpiringSoon && expiryDate ? (
                        <>
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="text-amber-700 font-semibold">
                                Ends {expiryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                        </>
                    ) : computedSuccessRate !== null ? (
                        <>
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                            <span className="text-brand-emerald font-semibold">{computedSuccessRate}% Worked</span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                            <span>{coupon.isVerified ? "Verified Offer" : "Checked Feed"}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Action Area */}
            <div className="mt-2">
                {hasCouponCode ? (
                    <button
                        onClick={handleRevealAndCopy}
                        className="w-full h-12 flex items-stretch rounded-xl overflow-hidden bg-brand-emerald text-white shadow-premium-sm hover:shadow-premium-md active:scale-[0.98] transition-all group/btn"
                    >
                        <div className="flex-1 flex items-center justify-center bg-emerald-700/60 border-r border-emerald-500/30 px-2">
                            <span className="font-mono text-sm font-bold tracking-wider text-emerald-50 truncate">
                                {revealed ? cleanedCode : maskCode(cleanedCode!)}
                            </span>
                        </div>
                        <div
                            className={`flex items-center gap-1.5 px-4 text-xs sm:text-sm font-bold transition-colors shrink-0 ${
                                copied
                                    ? "bg-emerald-600 text-white"
                                    : "bg-brand-emerald text-white group-hover/btn:bg-emerald-600"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" /> Copied
                                </>
                            ) : revealed ? (
                                <>
                                    <Copy className="w-4 h-4" /> Copy
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" /> Copy Code
                                </>
                            )}
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={handleGetDeal}
                        className={`w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all shadow-premium-sm hover:shadow-premium-md active:scale-[0.98] ${
                            activated
                                ? "bg-emerald-50 text-brand-emerald border border-emerald-200"
                                : "bg-brand-emerald hover:bg-emerald-600 text-white"
                        }`}
                    >
                        {activated ? (
                            <>
                                <Check className="w-4 h-4" /> Deal Activated
                            </>
                        ) : (
                            <>
                                Activate Deal <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
