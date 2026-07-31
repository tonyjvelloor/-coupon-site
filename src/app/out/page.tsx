import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const getMerchantPolicy = unstable_cache(
    async (storeId: string) => {
        const policy = await prisma.merchantPolicy.findUnique({
            where: { merchantId: storeId },
            select: {
                redirectMode: true,
                brandBidding: true,
                requiresInterstitial: true
            }
        });

        if (!policy) {
            return {
                redirectMode: 'INSTANT',
                brandBidding: 'ALLOWED',
                requiresInterstitial: false,
            };
        }
        return policy;
    },
    ['merchant-policy'],
    { revalidate: 3600 }
);

import { waitUntil } from "@vercel/functions";

// ... existing imports

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
                where: { sessionId }
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
                        device: 'unknown',
                    }
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
                status: 'SUCCESS'
            }
        });
    } catch (error) {
        console.error("Failed to log outbound event:", error);
    }
}

export default async function OutboundPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const url = typeof params.url === "string" ? params.url : null;
    const storeId = typeof params.storeId === "string" ? params.storeId : null;
    const couponId = typeof params.couponId === "string" ? params.couponId : null;
    
    if (!url || !storeId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500">Invalid outbound link.</p>
            </div>
        );
    }

    let merchantName = "the merchant";
    try {
        const hostname = new URL(url).hostname;
        merchantName = hostname.replace("www.", "");
    } catch (e) {}

    const policy = await getMerchantPolicy(storeId);
    let mode = policy.redirectMode;

    if (policy.brandBidding === 'PROHIBITED') {
        mode = 'MODAL_ONLY';
    }

    if (policy.requiresInterstitial && mode !== 'MODAL_ONLY') {
        mode = 'INTERSTITIAL';
    }

    const subid = crypto.randomUUID();
    const finalUrlObj = new URL(url);
    finalUrlObj.searchParams.set('subid1', subid);
    const finalUrl = finalUrlObj.toString();

    const cookieStore = await cookies();
    const sessionData = {
        sessionId: cookieStore.get("ch_session_id")?.value,
        gclid: cookieStore.get("ch_gclid")?.value,
        utmSource: cookieStore.get("ch_utm_source")?.value,
        utmMedium: cookieStore.get("ch_utm_medium")?.value,
        utmCampaign: cookieStore.get("ch_utm_campaign")?.value,
        landingPage: cookieStore.get("ch_landing_page")?.value,
    };

    // Fire and forget the event logging securely with waitUntil
    waitUntil(logOutboundEvent(subid, storeId, couponId, mode, url, sessionData));

    // INSTANT Redirect (outside try/catch to preserve NEXT_REDIRECT)
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

    // INTERSTITIAL mode
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0F172A]">
            <script
                dangerouslySetInnerHTML={{
                    __html: `setTimeout(function() { window.location.replace("${finalUrl}"); }, 2000);`
                }}
            />
            
            <div className="text-center max-w-md w-full px-6 flex flex-col items-center">
                
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
                    {params.type === 'code' ? 'Coupon Code Copied' : 'No Coupon Code Required'}
                </p>

                <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-5 mb-10 flex items-center justify-center gap-3 animate-fade-in-up">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xl tracking-tight">Deal Activated</span>
                </div>

                <p className="text-base font-medium text-gray-600 dark:text-gray-300 mb-12">
                    Please wait while we are redirecting you to <strong className="text-gray-900 dark:text-white">{merchantName}</strong>...
                </p>

                <div className="flex items-center gap-4 justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-xl">CH</span>
                    </div>

                    <div className="flex gap-2 mx-4">
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                    </div>

                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                        <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">STORE</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
