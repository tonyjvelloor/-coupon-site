import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

export const metadata: Metadata = {
  title: {
    default: "CouponHub - Verified Coupons, Promo Codes & Cashback in India",
    template: "%s | CouponHub India",
  },
  description:
    "Save big on online shopping in India. Get 100% verified coupons, exclusive promo codes, UPI cashback, and bank card discounts for Amazon, Flipkart, Myntra, Ajio, Swiggy, and 250+ top brands.",
  keywords: [
    "coupons India",
    "promo codes India",
    "online shopping discount India",
    "cashback offers India",
    "Amazon India coupons",
    "Ajio coupon code today",
    "Flipkart deals",
    "Myntra discount code",
    "UPI cashback",
    "bank credit card offers",
    "verified coupons",
  ],
  authors: [{ name: "CouponHub India" }],
  creator: "CouponHub",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CouponHub India",
    title: "CouponHub - Verified Coupons, Promo Codes & Cashback in India",
    description:
      "Save big on online shopping in India with tested coupons, promo codes, UPI cashback, and bank card discounts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CouponHub - Verified Coupons, Promo Codes & Cashback in India",
    description:
      "Save big on online shopping in India with tested coupons, promo codes, UPI cashback, and bank card discounts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "7OKZPsR8Q1yyEz2nCicFxuCjGkTznbxAwibu4vVfFUQ",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CouponModalProvider } from "@/components/providers/CouponModalProvider";
import { ConsentManager } from "@/components/ui/ConsentManager";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { GlobalSearchProvider } from "@/components/providers/GlobalSearchProvider";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-2697580332564903";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://cdn0.cuelinks.com" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="google-adsense-account" content={adsenseClientId} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              try {
                var saved = localStorage.getItem('couponhub-consent');
                var parsed = saved ? JSON.parse(saved) : null;
                gtag('consent', 'default', {
                  ad_storage: parsed && parsed.marketing ? 'granted' : 'denied',
                  ad_user_data: parsed && parsed.marketing ? 'granted' : 'denied',
                  ad_personalization: parsed && parsed.marketing ? 'granted' : 'denied',
                  analytics_storage: parsed && parsed.analytics ? 'granted' : 'denied',
                  wait_for_update: 500
                });
              } catch (e) {
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied',
                  wait_for_update: 500
                });
              }
            `,
          }}
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jakarta.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300`}
        suppressHydrationWarning
      >
        <AnalyticsProvider />
        <ConsentManager />
        <Script
          id="cuelinks-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var cId = '302299';
              (function(d, t) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = (document.location.protocol == 'https:' ? 'https://cdn0.cuelinks.com/js/' : 'http://cdn0.cuelinks.com/js/')  + 'cuelinksv2.js';
                document.getElementsByTagName('body')[0].appendChild(s);
              }());
            `,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <GlobalSearchProvider>
            <CouponModalProvider>
              {children}
            </CouponModalProvider>
          </GlobalSearchProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CouponHub",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CouponHub",
              url: siteUrl,
              logo: `${siteUrl}/logo.jpg`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "support@couponhub.store",
                url: `${siteUrl}/contact`,
                availableLanguage: ["English"]
              }
            })
          }}
        />
      </body>
    </html>
  );
}
