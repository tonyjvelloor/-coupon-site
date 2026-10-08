"use client";

import { useState } from "react";
import { Calculator, ArrowRight, Percent, IndianRupee } from "lucide-react";
import Link from "next/link";

export function DiscountCalculatorClient() {
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [discountType, setDiscountType] = useState<"percent" | "flat">("percent");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  
  const [stackedDiscountEnabled, setStackedDiscountEnabled] = useState(false);
  const [stackedDiscountType, setStackedDiscountType] = useState<"percent" | "flat">("percent");
  const [stackedDiscountValue, setStackedDiscountValue] = useState<number | "">("");

  // Calculations
  const price = Number(originalPrice) || 0;
  
  // First Discount
  let d1Amount = 0;
  if (discountType === "percent") {
    d1Amount = price * ((Number(discountValue) || 0) / 100);
  } else {
    d1Amount = Number(discountValue) || 0;
  }
  
  // Ensure we don't discount more than the price
  d1Amount = Math.min(d1Amount, price);
  const priceAfterD1 = price - d1Amount;

  // Second Discount (Stacked)
  let d2Amount = 0;
  if (stackedDiscountEnabled) {
    if (stackedDiscountType === "percent") {
      d2Amount = priceAfterD1 * ((Number(stackedDiscountValue) || 0) / 100);
    } else {
      d2Amount = Number(stackedDiscountValue) || 0;
    }
  }
  
  d2Amount = Math.min(d2Amount, priceAfterD1);
  const finalPrice = priceAfterD1 - d2Amount;
  const totalSaved = d1Amount + d2Amount;
  const effectiveDiscountPercent = price > 0 ? (totalSaved / price) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Input Section */}
        <div className="p-8 md:p-10 bg-slate-50 border-r border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-indigo/10 rounded-xl flex items-center justify-center text-brand-indigo">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Calculate Savings</h2>
              <p className="text-sm text-slate-500">Enter price and coupon details</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Original Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Original Price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-all font-medium text-slate-900"
                  placeholder="e.g. 2999"
                />
              </div>
            </div>

            {/* First Discount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Coupon / Discount</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {discountType === "percent" ? <Percent className="h-4 w-4 text-slate-400" /> : <IndianRupee className="h-4 w-4 text-slate-400" />}
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value ? Number(e.target.value) : "")}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-all font-medium text-slate-900"
                    placeholder="e.g. 20"
                  />
                </div>
                <div className="flex bg-slate-200/50 p-1 rounded-xl">
                  <button 
                    onClick={() => setDiscountType("percent")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${discountType === "percent" ? "bg-white shadow-sm text-brand-indigo" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    %
                  </button>
                  <button 
                    onClick={() => setDiscountType("flat")}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${discountType === "flat" ? "bg-white shadow-sm text-brand-indigo" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Flat
                  </button>
                </div>
              </div>
            </div>

            {/* Stacked Discount Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={stackedDiscountEnabled}
                    onChange={() => setStackedDiscountEnabled(!stackedDiscountEnabled)}
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${stackedDiscountEnabled ? 'bg-verified-emerald' : 'bg-slate-200'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${stackedDiscountEnabled ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Add a stacked coupon (e.g. Bank Offer)</span>
              </label>
            </div>

            {/* Stacked Discount Input */}
            {stackedDiscountEnabled && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Secondary Coupon (Applied to discounted price)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {stackedDiscountType === "percent" ? <Percent className="h-4 w-4 text-slate-400" /> : <IndianRupee className="h-4 w-4 text-slate-400" />}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={stackedDiscountValue}
                      onChange={(e) => setStackedDiscountValue(e.target.value ? Number(e.target.value) : "")}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-all font-medium text-slate-900"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-xl">
                    <button 
                      onClick={() => setStackedDiscountType("percent")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${stackedDiscountType === "percent" ? "bg-white shadow-sm text-brand-indigo" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      %
                    </button>
                    <button 
                      onClick={() => setStackedDiscountType("flat")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${stackedDiscountType === "flat" ? "bg-white shadow-sm text-brand-indigo" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Flat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="p-8 md:p-10 bg-brand-indigo text-white flex flex-col justify-center relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10">
            <h3 className="text-brand-indigo-light font-semibold uppercase tracking-wider text-sm mb-6">Final Breakdown</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-brand-indigo-light">
                <span>Original Price</span>
                <span className="font-mono line-through">₹{price.toFixed(2)}</span>
              </div>
              
              {d1Amount > 0 && (
                <div className="flex justify-between items-center text-deal-amber">
                  <span>Primary Discount</span>
                  <span className="font-mono font-semibold">- ₹{d1Amount.toFixed(2)}</span>
                </div>
              )}
              
              {stackedDiscountEnabled && d2Amount > 0 && (
                <div className="flex justify-between items-center text-deal-amber">
                  <span>Stacked Discount</span>
                  <span className="font-mono font-semibold">- ₹{d2Amount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="h-px w-full bg-white/20 my-4"></div>
              
              <div className="flex justify-between items-end">
                <span className="text-lg font-semibold">Final Price</span>
                <span className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight">₹{finalPrice.toFixed(0)}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-brand-indigo-light mb-1">Total Savings</p>
                  <p className="text-2xl font-bold text-verified-emerald">₹{totalSaved.toFixed(0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-indigo-light mb-1">Effective Discount</p>
                  <p className="text-2xl font-bold text-white">{effectiveDiscountPercent.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/stores/amazon" 
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-brand-indigo px-6 py-3 rounded-full hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
              >
                Find Top Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
