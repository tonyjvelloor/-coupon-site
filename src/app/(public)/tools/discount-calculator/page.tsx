import { Metadata } from "next";
import { DiscountCalculatorClient } from "@/components/modules/tools/DiscountCalculatorClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discount Calculator | Stack Coupons & Find Final Price",
  description: "Free online discount calculator. Calculate flat discounts, percentage off, and stack multiple coupons to find your exact final price and total savings.",
};

export default function DiscountCalculatorPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-max-width mx-auto px-gutter-desktop py-6">
          <nav className="flex items-center text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-brand-indigo transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 font-medium">Discount Calculator</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discount & Final Price Calculator
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl text-lg">
            Easily calculate the final price of any item after applying flat discounts, percentage coupons, or stacking multiple bank offers.
          </p>
        </div>
      </div>

      <div className="max-w-max-width mx-auto px-gutter-desktop py-12">
        <DiscountCalculatorClient />

        {/* SEO Content Section */}
        <div className="mt-16 max-w-3xl mx-auto prose prose-slate">
          <h2>How to use the Discount Calculator</h2>
          <p>
            Whether you are shopping during the Great Indian Festival, Big Billion Days, or just found a standard promo code, calculating the exact final price can be tricky—especially when stacking offers.
          </p>
          
          <h3>1. Standard Percentage Discounts</h3>
          <p>
            If a store offers 20% off a ₹2,000 item, select the "%" option on the primary coupon input and enter 20. The calculator instantly deducts ₹400, showing a final price of ₹1,600.
          </p>
          
          <h3>2. Stacking Coupons (Double Discounts)</h3>
          <p>
            Many sites like Amazon and Flipkart allow you to use a base coupon code <strong>plus</strong> a bank credit card offer (e.g., 10% off via HDFC cards). Turn on the "Add a stacked coupon" toggle. The calculator is smart enough to apply the second discount <em>after</em> the first discount is deducted, giving you the accurate final cart value.
          </p>
          
          <div className="bg-brand-indigo/5 p-6 rounded-2xl border border-brand-indigo/10 mt-8">
            <h4 className="text-brand-indigo mt-0">Ready to save?</h4>
            <p className="mb-0 text-slate-700">
              Now that you know how much you can save, head over to our <Link href="/stores/amazon" className="text-brand-indigo font-bold underline">Amazon Coupons</Link> or <Link href="/stores/flipkart" className="text-brand-indigo font-bold underline">Flipkart Offers</Link> pages to find working codes for your next purchase!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
