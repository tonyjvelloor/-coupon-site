import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  FALLBACK_BANK_OFFERS,
  FALLBACK_BANKS,
  FALLBACK_COUPONS,
  FALLBACK_STORES,
} from "@/lib/fallback-catalog";
import {
  CardFinderBank,
  CardFinderOffer,
  CardOfferFinderClient,
} from "@/components/modules/tools/CardOfferFinderClient";
import { getCurrentMonthYear, getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 21600; // 6h ISR

const siteUrl = getSiteUrl();
const { fullMonthYear } = getCurrentMonthYear();

export const metadata: Metadata = {
  title: `My Cards & Bank Offer Finder India (${fullMonthYear}) – Instant Discount Matcher`,
  description:
    "Select your HDFC, ICICI, SBI, Axis, Kotak, or AU Bank credit/debit cards to instantly find verified instant discounts and stackable promo codes across Amazon, Flipkart, Myntra, Croma, Swiggy, and Klook.",
  alternates: {
    canonical: `${siteUrl}/tools/card-finder`,
  },
  openGraph: {
    title: `My Cards & Bank Offer Finder India (${fullMonthYear})`,
    description:
      "Match your Indian credit & debit cards to live instant discounts and stackable store coupon codes.",
    url: `${siteUrl}/tools/card-finder`,
    siteName: "CouponHub India",
    type: "website",
    images: [
      {
        url: `${siteUrl}/api/og?title=${encodeURIComponent(
          "My Cards & Bank Offer Finder India"
        )}&description=${encodeURIComponent(
          "Match HDFC, ICICI, SBI, Axis & Kotak cards to verified instant discounts and stackable promo codes."
        )}&type=tool`,
        width: 1200,
        height: 630,
        alt: "CouponHub Bank & Credit Card Offer Finder",
      },
    ],
  },
};

const BANK_SHORT_NAMES: Record<string, string> = {
  hdfc: "HDFC Bank",
  icici: "ICICI Bank",
  sbi: "SBI Card",
  axis: "Axis Bank",
  kotak: "Kotak Bank",
  "au-bank": "AU Bank",
};

export default async function CardFinderPage() {
  let banks: CardFinderBank[] = [];
  let offers: CardFinderOffer[] = [];

  try {
    const [dbBanks, dbOffers, dbCodeCoupons] = await Promise.all([
      prisma.bank.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.bankOffer.findMany({
        where: { isActive: true, storeId: { not: null } },
        include: {
          bank: true,
          store: {
            include: {
              storeCategories: { include: { category: true }, take: 1 },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.coupon.findMany({
        where: {
          deletedAt: null,
          code: { not: null },
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: { merchantIdentity: { include: { store: true } } },
        orderBy: [{ isFeatured: "desc" }, { qualityScore: "desc" }],
        take: 100,
      }),
    ]);

    if (dbBanks.length > 0 && dbOffers.length > 0) {
      banks = dbBanks.map((b) => ({
        slug: b.slug,
        name: b.name,
        shortName: BANK_SHORT_NAMES[b.slug] || b.name,
        accent: "indigo",
      }));

      const codeByStore = new Map<string, CardFinderOffer["stackableCode"]>();
      for (const c of dbCodeCoupons) {
        const sSlug = c.merchantIdentity?.store?.slug;
        if (sSlug && c.code && !codeByStore.has(sSlug)) {
          codeByStore.set(sSlug, {
            id: c.id,
            code: c.code,
            title: c.title,
            discountValue: c.discountValue,
            affiliateUrl: c.affiliateUrl,
          });
        }
      }

      offers = dbOffers
        .filter((o) => Boolean(o.store))
        .map((o) => ({
          id: o.id,
          bankSlug: o.bank.slug,
          bankName: o.bank.name,
          storeSlug: o.store!.slug,
          storeName: o.store!.name,
          storeLogo: o.store!.logo,
          storeWebsite: o.store!.website,
          category: o.store!.storeCategories[0]?.category?.name || "Shopping",
          discountDetails: o.discountDetails,
          terms: o.terms || "Check merchant payment screen for minimum spend terms.",
          stackableCode: codeByStore.get(o.store!.slug) || null,
        }));
    }
  } catch (err) {
    console.warn("[tools/card-finder] DB unavailable, using fallback catalog:", err);
  }

  if (banks.length === 0 || offers.length === 0) {
    banks = FALLBACK_BANKS.map((b) => ({
      slug: b.slug,
      name: b.name,
      shortName: BANK_SHORT_NAMES[b.slug] || b.name,
      accent: "indigo",
    }));

    offers = FALLBACK_BANK_OFFERS.map((o) => {
      const bank = FALLBACK_BANKS.find((b) => b.slug === o.bankSlug);
      const store = FALLBACK_STORES.find((s) => s.slug === o.storeSlug);
      const codeMatch = FALLBACK_COUPONS.find(
        (c) => c.merchantSlug === o.storeSlug && Boolean(c.code)
      );
      return {
        id: o.id,
        bankSlug: o.bankSlug,
        bankName: bank?.name || o.bankSlug.toUpperCase(),
        storeSlug: o.storeSlug,
        storeName: store?.name || o.storeSlug,
        storeLogo: store?.logo || null,
        storeWebsite: store?.website || "https://www.couponhub.store/stores",
        category: store?.primaryCategory || "Shopping",
        discountDetails: o.discountDetails,
        terms: o.terms,
        stackableCode: codeMatch && codeMatch.code
          ? {
              id: codeMatch.id,
              code: codeMatch.code,
              title: codeMatch.title,
              discountValue: codeMatch.discountValue,
              affiliateUrl: codeMatch.affiliateUrl,
            }
          : null,
      };
    });
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CouponHub My Cards & Bank Offer Finder India",
    url: `${siteUrl}/tools/card-finder`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Interactive Indian credit and debit card offer finder matching HDFC, ICICI, SBI, Axis, Kotak, and AU Bank cards with verified instant discounts and stackable promo codes.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I find which Indian credit card gives the biggest discount today?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Select the banks in your wallet using the CouponHub Card Offer Finder and enter your expected cart value. We calculate estimated instant savings (including maximum discount caps) and surface stackable merchant promo codes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stack bank instant discounts with store promo codes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Apply the merchant promo code on the cart page first, confirm the post-coupon total still satisfies the bank minimum transaction amount, and then pay with your eligible credit or debit card.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/tools" className="hover:text-indigo-600 transition-colors">
              Tools
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 dark:text-white font-medium">
              My Cards &amp; Bank Offer Finder
            </span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Cards &amp; Bank Offer Finder
            </h1>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl text-base md:text-lg">
            Pick the credit and debit cards in your wallet to uncover verified instant discounts, estimated rupee savings, and stackable promo codes across India&apos;s top online stores.
          </p>
        </div>
      </div>

      {/* Main Tool */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CardOfferFinderClient banks={banks} offers={offers} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
