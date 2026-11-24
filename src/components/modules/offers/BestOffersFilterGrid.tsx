"use client";

import React, { useMemo, useState } from "react";
import { PremiumOfferCard } from "@/components/ui/PremiumOfferCard";
import { cleanCouponCode, formatDiscountBadge, getOfferBadgeLabel } from "@/lib/coupon-ranking";
import { Search, Tag, CreditCard, Sparkles, SlidersHorizontal } from "lucide-react";

export interface FilterableOffer {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  type: string;
  discountType?: string | null;
  discountValue: string | null;
  affiliateUrl: string;
  isVerified: boolean;
  isExclusive: boolean;
  expiresAt?: Date | string | null;
  merchantName: string;
  merchantSlug: string;
  merchantLogo: string | null;
}

type OfferFilter =
  | "all"
  | "codes"
  | "bank"
  | "electronics"
  | "fashion"
  | "travel"
  | "beauty"
  | "food";

function matchesCategory(offer: FilterableOffer, filter: OfferFilter): boolean {
  const text = `${offer.title} ${offer.description || ""} ${offer.merchantName} ${offer.merchantSlug}`.toLowerCase();
  switch (filter) {
    case "all":
      return true;
    case "codes":
      return Boolean(cleanCouponCode(offer.code));
    case "bank":
      return /hdfc|icici|sbi|axis|kotak|mastercard|neu|card|bank|emi|upi/i.test(text);
    case "electronics":
      return /amazon|flipkart|croma|reliance-digital|vijay-sales|boat|mivi|laptop|smartphone|appliance|tech|ipad|tv|earbud/i.test(text);
    case "fashion":
      return /myntra|ajio|tata-cliq|puma|campus|neeman|jockey|decathlon|fashion|footwear|apparel|sneaker|clothing|winterwear/i.test(text);
    case "travel":
      return /klook|air-india|makemytrip|flight|hotel|tour|travel|activity|trip/i.test(text);
    case "beauty":
      return /nykaa|plum|bella-vita|wellbeing|healthkart|the-man-company|beauty|skincare|perfume|protein|nutrition|cosmetic/i.test(text);
    case "food":
      return /swiggy|zomato|food|dining|restaurant|grocery|instamart/i.test(text);
    default:
      return true;
  }
}

const FILTER_TABS: Array<{ id: OfferFilter; label: string }> = [
  { id: "all", label: "All Offers" },
  { id: "codes", label: "Promo Codes" },
  { id: "bank", label: "Bank & Cards" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "travel", label: "Travel" },
  { id: "beauty", label: "Beauty & Health" },
  { id: "food", label: "Food & Dining" },
];

export function BestOffersFilterGrid({ offers }: { offers: FilterableOffer[] }) {
  const [activeFilter, setActiveFilter] = useState<OfferFilter>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const map: Record<OfferFilter, number> = {
      all: offers.length,
      codes: 0,
      bank: 0,
      electronics: 0,
      fashion: 0,
      travel: 0,
      beauty: 0,
      food: 0,
    };
    for (const tab of FILTER_TABS) {
      if (tab.id === "all") continue;
      map[tab.id] = offers.filter((o) => matchesCategory(o, tab.id)).length;
    }
    return map;
  }, [offers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return offers.filter((o) => {
      if (!matchesCategory(o, activeFilter)) return false;
      if (
        q &&
        !o.title.toLowerCase().includes(q) &&
        !o.merchantName.toLowerCase().includes(q) &&
        !(o.code || "").toLowerCase().includes(q) &&
        !(o.description || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [offers, activeFilter, search]);

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-indigo" />
            <h2 className="text-xl font-bold text-slate-900">
              Browse &amp; Filter All Verified Offers
            </h2>
            <span className="text-xs font-bold bg-indigo-50 text-brand-indigo px-2.5 py-0.5 rounded-full">
              {filtered.length} shown
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by store, code, or bank..."
              aria-label="Filter verified offers"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-indigo/40"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.filter((t) => t.id === "all" || counts[t.id] > 0).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.id === "codes" && <Tag className="w-3.5 h-3.5" />}
                {tab.id === "bank" && <CreditCard className="w-3.5 h-3.5" />}
                {tab.id === "all" && <Sparkles className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((coupon, index) => (
            <PremiumOfferCard
              key={coupon.id}
              badgeLabel={getOfferBadgeLabel(coupon, index + 3)}
              coupon={{
                ...coupon,
                code: cleanCouponCode(coupon.code),
                discountValue: formatDiscountBadge(
                  coupon.discountValue,
                  coupon.discountType,
                  coupon.title
                ),
              }}
              storeName={coupon.merchantName}
              storeLogo={coupon.merchantLogo}
              source={`best-offers-${activeFilter}`}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-700 font-semibold mb-2">
            No offers matched your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("all");
              setSearch("");
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-brand-indigo text-white text-xs font-bold hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
