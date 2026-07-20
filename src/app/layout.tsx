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
import { CouponModalProvider } from "@/components/providers/CouponModalProvider";

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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2697580332564903"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
        className={`${outfit.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden transition-colors duration-300`}
        suppressHydrationWarning
      >
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CouponModalProvider>
            {children}
          </CouponModalProvider>
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
