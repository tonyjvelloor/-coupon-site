import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

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
  metadataBase: new URL("https://couponhub.store"),
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
      <body
        className={`${outfit.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
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
              url: "https://couponhub.store",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://couponhub.store/search?q={search_term_string}",
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
              url: "https://couponhub.store",
              logo: "https://couponhub.store/logo.png",
              sameAs: [
                "https://facebook.com/couponhub",
                "https://twitter.com/couponhub",
                "https://instagram.com/couponhub"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
