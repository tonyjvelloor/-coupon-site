"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  IndianRupee,
  Trophy,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Calculator,
} from "lucide-react";

interface Preset {
  label: string;
  cartValue: number;
  instantPercent: number;
  instantCap: number;
  cashbackPercent: number;
  cashbackCap: number;
}

const PRESETS: Preset[] = [
  {
    label: "Smartphone (₹25,000)",
    cartValue: 25000,
    instantPercent: 10,
    instantCap: 1500,
    cashbackPercent: 5,
    cashbackCap: 5000,
  },
  {
    label: "Laptop / TV (₹65,000)",
    cartValue: 65000,
    instantPercent: 10,
    instantCap: 3500,
    cashbackPercent: 5,
    cashbackCap: 5000,
  },
  {
    label: "Fashion Cart (₹6,000)",
    cartValue: 6000,
    instantPercent: 10,
    instantCap: 750,
    cashbackPercent: 5,
    cashbackCap: 5000,
  },
];

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function CardVsCashbackCalculatorClient() {
  const [cartValue, setCartValue] = useState<number>(25000);

  // Card A: Instant Bank Offer (e.g., HDFC / SBI / ICICI 10% Instant Off)
  const [instantPercent, setInstantPercent] = useState<number>(10);
  const [instantCap, setInstantCap] = useState<number>(1500);
  const [baseRewardPercent, setBaseRewardPercent] = useState<number>(1.3);

  // Optional No-Cost EMI hidden cost check
  const [useNoCostEmi, setUseNoCostEmi] = useState<boolean>(false);
  const [emiMonths, setEmiMonths] = useState<number>(6);
  const [emiInterestApr, setEmiInterestApr] = useState<number>(16);
  const [emiProcessingFee, setEmiProcessingFee] = useState<number>(199);

  // Card B: Flat Cashback Card (e.g., SBI Cashback / Amazon Pay ICICI)
  const [cashbackPercent, setCashbackPercent] = useState<number>(5);
  const [cashbackCap, setCashbackCap] = useState<number>(5000);

  const safeCart = Math.max(0, Number(cartValue) || 0);

  // Card A math
  const rawInstantDiscount = safeCart * (Math.max(0, instantPercent) / 100);
  const instantDiscount =
    instantCap > 0
      ? Math.min(rawInstantDiscount, instantCap, safeCart)
      : Math.min(rawInstantDiscount, safeCart);

  const amountSwipedA = Math.max(0, safeCart - instantDiscount);

  // Base reward points typically are NOT awarded on EMI transactions in India
  const baseRewardsA = useNoCostEmi
    ? 0
    : amountSwipedA * (Math.max(0, baseRewardPercent) / 100);

  // No-Cost EMI hidden cost: reducing-balance interest is discounted upfront,
  // but user pays 18% GST on total interest + processing fee + 18% GST on fee.
  let emiHiddenCost = 0;
  if (useNoCostEmi && amountSwipedA > 0 && emiMonths > 0) {
    const monthlyRate = Math.max(0, emiInterestApr) / 12 / 100;
    let totalInterest = 0;
    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, emiMonths);
      const emi = (amountSwipedA * monthlyRate * factor) / (factor - 1);
      totalInterest = Math.max(0, emi * emiMonths - amountSwipedA);
    }
    const gstOnInterest = totalInterest * 0.18;
    const feeWithGst = Math.max(0, emiProcessingFee) * 1.18;
    emiHiddenCost = gstOnInterest + feeWithGst;
  }

  const netEffectiveCostA = amountSwipedA - baseRewardsA + emiHiddenCost;
  const totalSavingsA = safeCart - netEffectiveCostA;

  // Card B math
  const rawCashbackB = safeCart * (Math.max(0, cashbackPercent) / 100);
  const cashbackEarnedB =
    cashbackCap > 0
      ? Math.min(rawCashbackB, cashbackCap, safeCart)
      : Math.min(rawCashbackB, safeCart);
  const netEffectiveCostB = safeCart - cashbackEarnedB;
  const totalSavingsB = cashbackEarnedB;

  const diff = Math.abs(totalSavingsA - totalSavingsB);
  const winner: "A" | "B" | "TIE" =
    Math.round(totalSavingsA) === Math.round(totalSavingsB)
      ? "TIE"
      : totalSavingsA > totalSavingsB
      ? "A"
      : "B";

  const applyPreset = (preset: Preset) => {
    setCartValue(preset.cartValue);
    setInstantPercent(preset.instantPercent);
    setInstantCap(preset.instantCap);
    setCashbackPercent(preset.cashbackPercent);
    setCashbackCap(preset.cashbackCap);
  };

  return (
    <div className="space-y-8">
      {/* Presets Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
          Quick Scenarios:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-indigo hover:text-brand-indigo transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 p-6 md:p-10 bg-slate-50 dark:bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-8">
            {/* Cart Amount */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Checkout Cart Value (After Store Coupons)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min={0}
                  value={cartValue || ""}
                  onChange={(e) => setCartValue(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo font-bold text-lg text-slate-900 dark:text-white"
                  placeholder="25000"
                />
              </div>
            </div>

            {/* Card A & Card B Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-brand-indigo flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Card A: Bank Instant Off
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      e.g., HDFC / SBI / ICICI 10% Sale Offer
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Instant Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.5"
                    value={instantPercent}
                    onChange={(e) => setInstantPercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Max Instant Cap (₹, 0 = none)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={instantCap}
                    onChange={(e) => setInstantCap(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Base Reward Points Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step="0.1"
                    disabled={useNoCostEmi}
                    value={useNoCostEmi ? 0 : baseRewardPercent}
                    onChange={(e) => setBaseRewardPercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Card B */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Card B: Cashback Card
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      e.g., SBI Cashback 5% / Amazon ICICI
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Statement Cashback Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.5"
                    value={cashbackPercent}
                    onChange={(e) => setCashbackPercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Monthly Cashback Cap (₹, 0 = uncapped)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cashbackCap}
                    onChange={(e) => setCashbackCap(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Optional No-Cost EMI Toggle */}
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNoCostEmi}
                  onChange={(e) => setUseNoCostEmi(e.target.checked)}
                  className="mt-1 w-4 h-4 text-brand-indigo rounded border-slate-300 focus:ring-brand-indigo"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Include Hidden No-Cost EMI Charges on Card A (18% GST + Processing Fee)
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Indian banks waive interest on No-Cost EMI, but still charge 18% GST on interest plus a one-time processing fee (and disable base reward points).
                  </span>
                </div>
              </label>

              {useNoCostEmi && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/30">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Tenure (Months)
                    </label>
                    <select
                      value={emiMonths}
                      onChange={(e) => setEmiMonths(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    >
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={9}>9 Months</option>
                      <option value={12}>12 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Bank Interest (% p.a.)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={36}
                      step="0.5"
                      value={emiInterestApr}
                      onChange={(e) => setEmiInterestApr(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Processing Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={emiProcessingFee}
                      onChange={(e) => setEmiProcessingFee(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Verdict & Breakdown */}
          <div className="lg:col-span-5 p-6 md:p-10 bg-slate-900 text-white flex flex-col justify-between">
            <div>
              {/* Winner Callout */}
              <div
                className={`rounded-2xl p-5 mb-6 border ${
                  winner === "B"
                    ? "bg-emerald-500/15 border-emerald-400/30"
                    : "bg-indigo-500/20 border-indigo-400/30"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  <Trophy className="w-4 h-4" /> Recommended Payment Method
                </div>
                {winner === "TIE" ? (
                  <p className="text-xl font-extrabold">Both Cards Save the Exact Same!</p>
                ) : (
                  <>
                    <p className="text-2xl font-extrabold">
                      {winner === "A" ? "Use Card A (Instant Discount)" : "Use Card B (Cashback Card)"}
                    </p>
                    <p className="text-sm text-slate-200 mt-1">
                      You save <span className="font-bold text-emerald-300">{formatInr(diff)} more</span> compared to the other card.
                    </p>
                  </>
                )}
              </div>

              {/* Card A Summary */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Card A: Instant Offer
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {formatInr(netEffectiveCostA)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Instant Off at Checkout</span>
                      <span className="text-emerald-400">-{formatInr(instantDiscount)}</span>
                    </div>
                    {!useNoCostEmi && (
                      <div className="flex justify-between">
                        <span>Base Rewards ({baseRewardPercent}%)</span>
                        <span className="text-emerald-400">-{formatInr(baseRewardsA)}</span>
                      </div>
                    )}
                    {useNoCostEmi && (
                      <div className="flex justify-between text-amber-300">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Hidden EMI GST + Fee
                        </span>
                        <span>+{formatInr(emiHiddenCost)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card B Summary */}
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Card B: Cashback Card
                    </span>
                    <span className="text-lg font-extrabold text-white">
                      {formatInr(netEffectiveCostB)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Statement Cashback ({cashbackPercent}%)</span>
                      <span className="text-emerald-400">-{formatInr(cashbackEarnedB)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <Link
                href="/banks"
                className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                Check Live Bank Card Offers <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/discount-calculator"
                className="w-full py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Calculator className="w-4 h-4" /> Try Multi-Coupon Stacking Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
