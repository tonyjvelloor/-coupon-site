import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

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

// ... imports

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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2697580332564903"
          crossOrigin="anonymous"
        />
        {/* Google Analytics 4 Placeholder */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"}');
          `}
        </Script>
        {/* Microsoft Clarity Placeholder */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "XXXXXXXX"}");
          `}
        </Script>
      </head>
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
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
