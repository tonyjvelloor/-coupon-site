import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { after } from "next/server";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { monetizeAffiliateUrl } from "@/lib/coupon-ranking";
import crypto from "crypto";

const DEFAULT_MERCHANT_POLICY = {
    redirectMode: "INSTANT",
    brandBidding: "ALLOWED",
    requiresInterstitial: false,
};

const getMerchantPolicy = unstable_cache(
    async (storeId: string) => {
        try {
            const policy = await prisma.merchantPolicy.findUnique({
                where: { merchantId: storeId },
                select: {
                    redirectMode: true,
                    brandBidding: true,
                    requiresInterstitial: true,
                },
            });

            return policy || DEFAULT_MERCHANT_POLICY;
        } catch (err) {
            console.warn("[/out] Failed to read merchant policy, falling back to INSTANT:", err);
            return DEFAULT_MERCHANT_POLICY;
        }
    },
    ["merchant-policy"],
    { revalidate: 3600 }
);

async function logOutboundEvent(
    subid: string,
    storeId: string,
    couponId: string | null,
    mode: string,
    url: string,
    sessionData: {
        sessionId?: string;
        gclid?: string;
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
        landingPage?: string;
    }
) {
    try {
        const { sessionId, gclid, utmSource, utmMedium, utmCampaign, landingPage } = sessionData;
        let dbSessionId = null;

        if (sessionId) {
            let session = await prisma.clickSession.findUnique({
                where: { sessionId },
            });

            if (!session) {
                session = await prisma.clickSession.create({
                    data: {
                        sessionId,
                        gclid: gclid || null,
                        utmSource: utmSource || null,
                        utmMedium: utmMedium || null,
                        utmCampaign: utmCampaign || null,
                        landingPage: landingPage || null,
                        device: "unknown",
                    },
                });
            }
            dbSessionId = session.sessionId;
        }

        await prisma.outboundEvent.create({
            data: {
                id: subid,
                subid,
                clickSessionId: dbSessionId,
                merchantId: storeId,
                couponId: couponId || null,
                redirectMode: mode,
                affiliateUrl: url,
                status: "SUCCESS",
            },
        });
    } catch (error) {
        console.error("[/out] Failed to log outbound event:", error);
    }
}

export default async function OutboundPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const rawUrl = typeof params.url === "string" ? params.url : null;
    const storeId = typeof params.storeId === "string" && params.storeId !== "none" ? params.storeId : null;
    const couponId = typeof params.couponId === "string" ? params.couponId : null;

    const subid = crypto.randomUUID();
    const finalUrl = rawUrl ? monetizeAffiliateUrl(rawUrl, subid) : null;

    if (!rawUrl || !finalUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500">Invalid outbound link.</p>
            </div>
        );
    }

    let merchantName = "the merchant";
    try {
        const hostname = new URL(rawUrl).hostname;
        merchantName = hostname.replace(/^www\./, "");
    } catch {}

    // Never let DB downtime or quota limits break affiliate redirects
    let mode = "INSTANT";
    if (storeId) {
        try {
            const policy = await getMerchantPolicy(storeId);
            mode = policy.redirectMode;
            if (policy.brandBidding === "PROHIBITED") {
                mode = "MODAL_ONLY";
            }
            if (policy.requiresInterstitial && mode !== "MODAL_ONLY") {
                mode = "INTERSTITIAL";
            }
        } catch {
            mode = "INSTANT";
        }
    }

    const cookieStore = await cookies();
    const sessionData = {
        sessionId: cookieStore.get("ch_session_id")?.value,
        gclid: cookieStore.get("ch_gclid")?.value,
        utmSource: cookieStore.get("ch_utm_source")?.value,
        utmMedium: cookieStore.get("ch_utm_medium")?.value,
        utmCampaign: cookieStore.get("ch_utm_campaign")?.value,
        landingPage: cookieStore.get("ch_landing_page")?.value,
    };

    // Log click asynchronously after response so outbound redirect is instant (<50ms)
    if (storeId) {
        after(() => logOutboundEvent(subid, storeId, couponId, mode, finalUrl, sessionData));
    }

    if (mode === "INSTANT") {
        redirect(finalUrl);
    }

    if (mode === "MODAL_ONLY") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manual Activation Required</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Due to merchant policies, we cannot automatically redirect you.
                    Please close this tab and return to CouponHub to use the provided coupon code directly at {merchantName}.
                </p>
            </div>
        );
    }

    const safeRedirectJson = JSON.stringify(finalUrl);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0F172A]">
            <script
                dangerouslySetInnerHTML={{
                    __html: `setTimeout(function() { window.location.replace(${safeRedirectJson}); }, 1200);`,
                }}
            />

            <div className="text-center max-w-md w-full px-6 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
                    {params.type === "code" ? "Coupon Code Copied" : "No Coupon Code Required"}
                </p>

                <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-5 mb-10 flex items-center justify-center gap-3 animate-fade-in-up">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xl tracking-tight">Deal Activated</span>
                </div>

                <p className="text-base font-medium text-gray-600 dark:text-gray-300 mb-8">
                    Redirecting you to <strong className="text-gray-900 dark:text-white">{merchantName}</strong>...
                </p>

                <a
                    href={finalUrl}
                    rel="noopener noreferrer sponsored"
                    className="text-sm font-semibold text-indigo-600 hover:underline mb-8"
                >
                    Click here if not redirected automatically
                </a>
            </div>
        </div>
    );
}
