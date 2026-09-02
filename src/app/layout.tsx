import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

export const metadata: Metadata = {
  title: {
    default: "CouponHub - Best Coupons, Offers & Deals Worldwide",
    template: "%s | CouponHub",
  },
  description:
    "Get the best coupons, promo codes, and deals from top online stores. Save money on your online shopping with verified coupon codes from CouponHub.",
  keywords: [
    "coupons",
    "promo codes",
    "deals",
    "offers",
    "discount codes",
    "cashback",
    "online shopping",
  ],
  authors: [{ name: "CouponHub" }],
  creator: "CouponHub",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CouponHub",
    title: "CouponHub - Best Coupons, Offers & Deals Worldwide",
    description:
      "Get the best coupons, promo codes, and deals from top online stores.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CouponHub - Best Coupons, Offers & Deals Worldwide",
    description:
      "Get the best coupons, promo codes, and deals from top online stores.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CouponModalProvider } from "@/components/providers/CouponModalProvider";
import { ConsentManager } from "@/components/ui/ConsentManager";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { GlobalSearchProvider } from "@/components/providers/GlobalSearchProvider";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="google-adsense-account" content="ca-pub-2697580332564903" />
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2697580332564903"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300`}
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
              <MobileBottomNav />
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
              logo: `${siteUrl}/logo.png`,
              sameAs: [
                "https://facebook.com/couponhub",
                "https://twitter.com/couponhub",
                "https://instagram.com/couponhub"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-555-0199",
                contactType: "customer service",
                email: "support@couponhub.store",
                availableLanguage: ["English"]
              }
            })
          }}
        />
      </body>
    </html>
  );
}
