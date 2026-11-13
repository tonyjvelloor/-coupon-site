"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, CreditCard, Sparkles, Copy, Check, ExternalLink, Code2, Tag, ShieldCheck, Flame } from "lucide-react";

interface EmbedPreset {
  id: string;
  name: string;
  targetUrl: string;
  badgeLabel: string;
  badgeText: string;
  color: string;
}

const PRESETS: EmbedPreset[] = [
  {
    id: "amazon",
    name: "Amazon India Verified Deals",
    targetUrl: "https://www.couponhub.store/stores/amazon",
    badgeLabel: "Amazon Deals",
    badgeText: "Verified on CouponHub",
    color: "FF9900",
  },
  {
    id: "flipkart",
    name: "Flipkart Big Discounts",
    targetUrl: "https://www.couponhub.store/stores/flipkart",
    badgeLabel: "Flipkart Coupons",
    badgeText: "Tested Working",
    color: "2874F0",
  },
  {
    id: "myntra",
    name: "Myntra Fashion Savings",
    targetUrl: "https://www.couponhub.store/stores/myntra",
    badgeLabel: "Myntra Extra 500 Off",
    badgeText: "CouponHub India",
    color: "FF3F6C",
  },
  {
    id: "calculator",
    name: "Free Discount Calculator Tool",
    targetUrl: "https://www.couponhub.store/tools/discount-calculator",
    badgeLabel: "Discount Calculator",
    badgeText: "Free Tool by CouponHub",
    color: "4F46E5",
  },
  {
    id: "card-calculator",
    name: "Card Discount vs Cashback Tool",
    targetUrl: "https://www.couponhub.store/tools/card-vs-cashback-calculator",
    badgeLabel: "Card vs Cashback Calculator",
    badgeText: "Compare Bank Offers",
    color: "0EA5E9",
  },
  {
    id: "banks",
    name: "Credit Card Instant Discounts",
    targetUrl: "https://www.couponhub.store/banks",
    badgeLabel: "Bank Card Offers",
    badgeText: "10% Instant Off",
    color: "059669",
  },
];

export function ToolsHubClient() {
  const [selectedPreset, setSelectedPreset] = useState<EmbedPreset>(PRESETS[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const markdownSnippet = `[![${selectedPreset.badgeLabel}](https://img.shields.io/badge/${encodeURIComponent(
    selectedPreset.badgeLabel.replace(/-/g, "--")
  )}-${encodeURIComponent(
    selectedPreset.badgeText.replace(/-/g, "--")
  )}-${selectedPreset.color}?style=for-the-badge&logo=tag&logoColor=white)](${selectedPreset.targetUrl})`;

  const htmlSnippet = `<a href="${selectedPreset.targetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#4F46E5;color:#ffffff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-size:13px;font-weight:600;">
  <span>🏷️ ${selectedPreset.badgeLabel}</span>
  <span style="background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:4px;font-size:11px;">Verified</span>
</a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-16">
      {/* Featured Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tool 1: Discount Calculator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-indigo flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Calculator className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> High Precision & Stacking
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Discount &amp; Stacking Calculator
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Calculate your exact cart total after applying flat discount coupons, percentage promo codes, and 10% bank card instant discounts.
            </p>
          </div>
          <Link
            href="/tools/discount-calculator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-indigo hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            Open Calculator <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Tool 2: Credit Card Instant Discount vs Cashback Calculator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <CreditCard className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Includes No-Cost EMI GST
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Card Discount vs. Cashback
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Compare capped 10% instant bank discounts (HDFC, SBI, ICICI) against 5% cashback cards — including hidden 18% EMI GST costs.
            </p>
          </div>
          <Link
            href="/tools/card-vs-cashback-calculator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-semibold transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            Compare Cards <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Tool 3: Webmaster & Syndication Embeds */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Code2 className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> For Bloggers & Creators
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Free Deal & Coupon Embed Generator
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Publishing on Medium, LinkedIn, Substack, GitHub, or your own blog? Embed verified coupon badges and real-time deal links directly into your articles.
            </p>
          </div>
          <a
            href="#embed-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-brand-indigo dark:hover:border-brand-indigo text-slate-900 dark:text-white font-semibold transition-all"
          >
            Create Badges Below
          </a>
        </div>
      </div>

      {/* Interactive Embed Generator Section */}
      <div id="embed-generator" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-2">
            <Tag className="w-4 h-4" /> Syndication & Parasite Content Kit
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Generate Verified Deal Badges & Code Snippets
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed">
            Select a target store or tool to instantly generate copy-paste Markdown for GitHub/Reddit or HTML for Medium, WordPress, and Substack.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Choose Target Store / Feature
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedPreset.id === preset.id
                    ? "bg-brand-indigo text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Live Preview (How readers will see it)
          </span>
          <div className="flex items-center gap-4">
            <a
              href={selectedPreset.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white rounded-lg text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{selectedPreset.badgeLabel}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Verified</span>
            </a>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Links directly to: <code className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">{selectedPreset.targetUrl}</code>
            </span>
          </div>
        </div>

        {/* Code Snippets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Markdown Box */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 relative border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Markdown (GitHub, Reddit, Notion)
                </span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, "markdown")}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedType === "markdown" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all p-3 bg-slate-950/80 rounded-lg">
                {markdownSnippet}
              </pre>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Great for GitHub README files, technical blogs, and developer documentation.
            </p>
          </div>

          {/* HTML Box */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 relative border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  HTML (Medium, WordPress, Substack)
                </span>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, "html")}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedType === "html" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy HTML
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all p-3 bg-slate-950/80 rounded-lg">
                {htmlSnippet}
              </pre>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Clean, standalone inline HTML with embedded styles for any content management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
