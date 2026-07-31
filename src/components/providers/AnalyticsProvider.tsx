"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import type { ConsentPreferences } from "@/components/ui/ConsentManager";

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

    // Only load if analytics consent is granted
    if (!consent?.analytics) return null;

    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    return (
        <>
            {gaId && (
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
            
            {clarityId && (
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
