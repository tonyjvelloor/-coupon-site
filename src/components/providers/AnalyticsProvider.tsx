"use client";

import React, { useEffect, useState, Suspense } from "react";
import Script from "next/script";
import { useSearchParams, usePathname } from "next/navigation";
import type { ConsentPreferences } from "@/components/ui/ConsentManager";

function SessionTracker({ consent }: { consent: ConsentPreferences | null }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        // Only run if marketing or analytics consent is granted
        if (!consent?.marketing && !consent?.analytics) return;

        // Helper to check if cookie exists
        const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        };

        const setCookie = (name: string, value: string) => {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Lax`;
        };

        if (!getCookie("ch_session_init")) {
            setCookie("ch_session_init", "true");
            
            // Capture UTMs and GCLID (only if marketing consent is granted, or analytics if appropriate)
            // Strict interpretation: UTMs/GCLID are marketing tracking
            if (consent?.marketing) {
                const gclid = searchParams.get('gclid');
                const utm_source = searchParams.get('utm_source');
                const utm_medium = searchParams.get('utm_medium');
                const utm_campaign = searchParams.get('utm_campaign');

                if (gclid) setCookie("ch_gclid", gclid);
                if (utm_source) setCookie("ch_utm_source", utm_source);
                if (utm_medium) setCookie("ch_utm_medium", utm_medium);
                if (utm_campaign) setCookie("ch_utm_campaign", utm_campaign);
            }
            
            // Capture Landing Page
            setCookie("ch_landing_page", pathname || "/");
            
            // Generate temporary Session ID
            setCookie("ch_session_id", crypto.randomUUID());
        }
    }, [searchParams, pathname, consent]);

    return null;
}

export function AnalyticsProvider() {
    const [consent, setConsent] = useState<ConsentPreferences | null>(null);

    useEffect(() => {
        // Initial check
        const stored = localStorage.getItem("couponhub-consent");
        if (stored) {
            try {
                setConsent(JSON.parse(stored));
            } catch (e) {}
        }

        // Listen for updates
        const handleConsentUpdate = (e: CustomEvent<ConsentPreferences>) => {
            setConsent(e.detail);
        };

        window.addEventListener("consentUpdated", handleConsentUpdate as EventListener);
        return () => window.removeEventListener("consentUpdated", handleConsentUpdate as EventListener);
    }, []);

    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    return (
        <>
            <Suspense fallback={null}>
                <SessionTracker consent={consent} />
            </Suspense>

            {consent?.analytics && gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `}
                    </Script>
                </>
            )}
            
            {consent?.analytics && clarityId && (
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "${clarityId}");
                    `}
                </Script>
            )}
        </>
    );
}
