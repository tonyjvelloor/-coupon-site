import React from "react";
import { prisma } from "@/lib/db";

export async function TrustMarkersModule() {
    let liveCoupons = 2400;
    let activeStores = 300;
    let bankPartners = 6;

    try {
        const [couponsCount, storesCount, banksCount] = await Promise.all([
            prisma.coupon.count({
                where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
            }),
            prisma.store.count({
                where: { isActive: true, activeOfferCount: { gt: 0 } },
            }),
            prisma.bank.count({ where: { isActive: true } }),
        ]);

        if (couponsCount > 0) liveCoupons = couponsCount;
        if (storesCount > 0) activeStores = storesCount;
        if (banksCount > 0) bankPartners = banksCount;
    } catch {
        // Use conservative baseline counts if DB is unreachable during build
    }

    return (
        <section className="max-w-max-width mx-auto px-gutter-desktop mb-space-3xl relative z-20 -mt-10">
            <div className="bg-surface-card rounded-2xl shadow-md p-space-lg grid grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Stat 1 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-verified-emerald-bg flex items-center justify-center text-verified-emerald shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">verified</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                                {liveCoupons.toLocaleString("en-IN")}
                            </span>
                            <span className="text-verified-emerald font-bold text-xs">Active</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-text-muted">Verified offers</p>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-deal-amber-bg flex items-center justify-center text-deal-amber shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">schedule</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">Daily</span>
                        <p className="font-body-sm text-body-sm text-text-muted">Expiry &amp; deal checks</p>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-brand-indigo-light flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">storefront</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                            {activeStores}+
                        </span>
                        <p className="font-body-sm text-body-sm text-text-muted">Stores with live deals</p>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="flex items-center gap-space-md p-space-xs">
                    <div className="w-12 h-12 rounded-xl bg-hot-coral-bg flex items-center justify-center text-hot-coral shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[26px]">credit_card</span>
                    </div>
                    <div>
                        <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                            {bankPartners}+ Banks
                        </span>
                        <p className="font-body-sm text-body-sm text-text-muted">Card &amp; UPI guides</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
