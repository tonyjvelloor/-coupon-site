import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";
import { CardVsCashbackCalculatorClient } from "@/components/modules/tools/CardVsCashbackCalculatorClient";
import { getSiteUrl } from "@/lib/seo-utils";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Credit Card Instant Discount vs Cashback Calculator (India 2026)",
  description:
    "Compare 10% instant bank discount cards (HDFC, SBI, ICICI) against 5% cashback credit cards and hidden No-Cost EMI GST fees before checking out.",
  alternates: {
    canonical: `${siteUrl}/tools/card-vs-cashback-calculator`,
  },
  openGraph: {
    title: "Credit Card Instant Discount vs Cashback Calculator | CouponHub India",
    description:
      "Find out whether an instant bank card offer or a flat 5% cashback card saves you more — including hidden No-Cost EMI 18% GST fees.",
    url: `${siteUrl}/tools/card-vs-cashback-calculator`,
    siteName: "CouponHub India",
    type: "website",
  },
};

export default function CardVsCashbackCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Should I pick a 10% instant bank discount or a 5% cashback credit card?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On smaller or mid-range carts up to ₹30,000, a 10% instant discount up to ₹1,500 usually beats a 5% cashback card. Above ₹35,000–₹40,000, when the instant discount hits its ₹1,500–₹2,000 cap, an uncapped or ₹5,000-capped 5% cashback card like SBI Cashback or Amazon Pay ICICI saves more.",
        },
      },
      {
        "@type": "Question",
        name: "Are there hidden charges on No-Cost EMI in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Even though merchants discount the interest upfront on No-Cost EMI, Indian banks still levy 18% GST on the monthly interest component plus a one-time processing fee (usually ₹199 + 18% GST), and typically do not award base reward points on EMI transactions.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header & Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link href="/" className="hover:text-brand-indigo transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/tools" className="hover:text-brand-indigo transition-colors">
              Tools
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 dark:text-white font-medium">
              Card Discount vs Cashback Calculator
            </span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bank Instant Discount vs. Cashback Card Calculator
            </h1>
          </div>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl text-base md:text-lg">
            Compare sale bank offers (with ₹1,500–₹3,500 max caps) against 5% cashback cards — and calculate hidden 18% GST fees on No-Cost EMI.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CardVsCashbackCalculatorClient />

        {/* Educational SEO Section */}
        <div className="mt-16 max-w-4xl mx-auto prose dark:prose-invert prose-slate">
          <h2>How to Pick the Winning Credit Card on Amazon &amp; Flipkart Sales</h2>
          <p>
            During Black Friday, Great Indian Festival, and Big Billion Days sales, shoppers often face a tough checkout dilemma: swipe a partner bank card (like HDFC, SBI, or ICICI) for a capped 10% instant discount, or pay with a dedicated 5% cashback card like SBI Cashback or Amazon Pay ICICI.
          </p>
          <h3>1. Watch the Instant Discount Cap</h3>
          <p>
            Most 10% instant bank discounts cap out at ₹1,250 to ₹1,750 on non-EMI purchases. Once your cart crosses ₹35,000, the effective discount rate drops below 5%, making a 5% cashback card the mathematical winner.
          </p>
          <h3>2. Factor in Hidden No-Cost EMI Costs</h3>
          <p>
            Many shoppers select 6-month or 9-month No-Cost EMI only because banks advertise an extra ₹500 discount on EMI. However, banks still bill <strong>18% GST on the interest component</strong> plus a ₹199–₹299 processing fee, which frequently wipes out the extra EMI discount.
          </p>
          <p>
            Explore live bank tie-ups across top merchants on our{" "}
            <Link href="/banks" className="text-brand-indigo font-bold hover:underline">
              Indian Bank Card Offers Hub
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
