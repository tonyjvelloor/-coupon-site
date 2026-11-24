"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Search,
  SlidersHorizontal,
  Tag,
  ArrowRight,
  Calculator,
  ShieldCheck,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export interface CardFinderBank {
  slug: string;
  name: string;
  shortName: string;
  accent: string;
}

export interface CardFinderOffer {
  id: string;
  bankSlug: string;
  bankName: string;
  storeSlug: string;
  storeName: string;
  storeLogo: string | null;
  storeWebsite: string;
  category: string;
  discountDetails: string;
  terms: string;
  stackableCode?: {
    id: string;
    code: string;
    title: string;
    discountValue: string | null;
    affiliateUrl: string;
  } | null;
}

interface CardOfferFinderClientProps {
  banks: CardFinderBank[];
  offers: CardFinderOffer[];
}

const POPULAR_CARD_PRESETS = [
  { label: "HDFC Millennia / Regalia / Swiggy", bankSlug: "hdfc" },
  { label: "Amazon Pay ICICI / Coral", bankSlug: "icici" },
  { label: "SBI Cashback / SimplyCLICK", bankSlug: "sbi" },
  { label: "Flipkart Axis / Ace", bankSlug: "axis" },
  { label: "Kotak League / 811", bankSlug: "kotak" },
  { label: "AU LIT / Altura", bankSlug: "au-bank" },
];

function estimateSavings(discountText: string, cartValue: number): number | null {
  if (!cartValue || cartValue <= 0) return null;
  // Look for cap like "up to ₹1,500" or "up to ₹3,000"
  const capMatch = discountText.match(/up\s*to\s*₹\s*([\d,]+)/i);
  const cap = capMatch ? parseInt(capMatch[1].replace(/,/g, ""), 10) : null;

  const pctMatch = discountText.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const raw = Math.round((cartValue * pct) / 100);
    return cap ? Math.min(raw, cap) : raw;
  }

  const flatMatch = discountText.match(/(?:flat|extra)\s*₹\s*([\d,]+)/i);
  if (flatMatch) {
    return parseInt(flatMatch[1].replace(/,/g, ""), 10);
  }

  return cap;
}

export function CardOfferFinderClient({ banks, offers }: CardOfferFinderClientProps) {
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["hdfc", "icici"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [cartValue, setCartValue] = useState<number>(10000);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("couponhub-my-cards");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedBanks(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleBank = (slug: string) => {
    setSelectedBanks((prev) => {
      const next = prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug];
      try {
        localStorage.setItem("couponhub-my-cards", JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const selectAllBanks = () => {
    const all = banks.map((b) => b.slug);
    setSelectedBanks(all);
    try {
      localStorage.setItem("couponhub-my-cards", JSON.stringify(all));
    } catch {}
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(offers.map((o) => o.category).filter(Boolean))).sort();
    return ["All", ...unique];
  }, [offers]);

  const filteredOffers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers
      .filter((o) => {
        if (selectedBanks.length > 0 && !selectedBanks.includes(o.bankSlug)) return false;
        if (selectedCategory !== "All" && o.category !== selectedCategory) return false;
        if (
          q &&
          !o.storeName.toLowerCase().includes(q) &&
          !o.bankName.toLowerCase().includes(q) &&
          !o.discountDetails.toLowerCase().includes(q) &&
          !o.category.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .map((o) => ({
        ...o,
        estSaving: estimateSavings(o.discountDetails, cartValue),
      }))
      .sort((a, b) => (b.estSaving || 0) - (a.estSaving || 0));
  }, [offers, selectedBanks, selectedCategory, query, cartValue]);

  const handleCopyCode = (code: string, offerId: string, outUrl: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(offerId);
    setTimeout(() => setCopiedId(null), 2500);
    window.open(outUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Select Cards / Banks */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step 1 · Select Your Wallet
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Which bank credit or debit cards do you hold?
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllBanks}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60"
            >
              Select All ({banks.length})
            </button>
            {selectedBanks.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedBanks([])}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {banks.map((bank) => {
            const active = selectedBanks.includes(bank.slug);
            const preset = POPULAR_CARD_PRESETS.find((p) => p.bankSlug === bank.slug);
            return (
              <button
                key={bank.slug}
                type="button"
                onClick={() => toggleBank(bank.slug)}
                className={`relative text-left p-3.5 rounded-xl border-2 transition-all ${
                  active
                    ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <CreditCard
                    className={`w-4 h-4 ${active ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  {active && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {bank.shortName}
                </div>
                {preset && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {preset.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Step 2: Filter Controls & Cart Value Estimator */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Search Store or Offer
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Amazon, Flipkart, Croma, Swiggy, Klook..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Expected Cart Value (₹)
            </label>
            <input
              type="number"
              min={500}
              max={200000}
              step={500}
              value={cartValue}
              onChange={(e) => setCartValue(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            {filteredOffers.length} Matching Bank Offer{filteredOffers.length !== 1 ? "s" : ""} Found
          </h3>
          <p className="text-sm text-slate-500">
            Sorted by highest estimated savings on a ₹{cartValue.toLocaleString("en-IN")} cart.
          </p>
        </div>
        <Link
          href="/tools/card-vs-cashback-calculator"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Compare Instant Discount vs Cashback Math
        </Link>
      </div>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <CreditCard className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No matching card offers for this filter
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Try selecting more banks above or resetting the category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              selectAllBanks();
              setSelectedCategory("All");
              setQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
          >
            Show All Bank Offers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const outUrl = `/out?url=${encodeURIComponent(
              offer.stackableCode?.affiliateUrl || offer.storeWebsite
            )}&source=card-finder&storeId=${encodeURIComponent(offer.storeSlug)}`;

            return (
              <div
                key={offer.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0">
                        <SafeImage
                          src={offer.storeLogo || ""}
                          alt={offer.storeName}
                          fill
                          unoptimized
                          className="object-contain p-1.5"
                          fallbackText={offer.storeName}
                          fallbackClassName="text-sm font-bold text-slate-500"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/stores/${offer.storeSlug}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          {offer.storeName}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {offer.bankName}
                          </span>
                          <span className="text-[11px] text-slate-400">{offer.category}</span>
                        </div>
                      </div>
                    </div>

                    {offer.estSaving && offer.estSaving > 0 ? (
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold uppercase text-emerald-600">
                          Est. Save
                        </div>
                        <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                          ₹{offer.estSaving.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <p className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                    {offer.discountDetails}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {offer.terms}
                  </p>

                  {/* Stackable Promo Code Callout */}
                  {offer.stackableCode && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Stackable Code Available
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-200">
                          {offer.stackableCode.discountValue || "Extra Off"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(offer.stackableCode!.code, offer.id, outUrl)
                        }
                        className="w-full mt-1.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-dashed border-emerald-400 text-xs font-mono font-extrabold text-slate-900 dark:text-white hover:bg-emerald-50 transition-colors"
                      >
                        <span>{offer.stackableCode.code}</span>
                        <span className="inline-flex items-center gap-1 font-sans text-emerald-700 font-bold">
                          {copiedId === offer.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy &amp; Go
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/banks/${offer.bankSlug}/${offer.storeSlug}`}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 inline-flex items-center gap-1"
                  >
                    Full Offer Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={outUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                  >
                    Shop {offer.storeName} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verification Note */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Savings estimates assume your post-coupon order value meets each bank&apos;s minimum spend requirement. Always verify card BIN eligibility on the merchant payment screen.
        </span>
      </div>
    </div>
  );
}
