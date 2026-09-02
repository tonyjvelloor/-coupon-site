import React from "react";
import { Sparkles, Banknote, CreditCard, Receipt } from "lucide-react";

interface ShoppingIntelligenceProps {
  storeName: string;
  bestCouponValue?: string;
  bestCashbackValue?: string;
  bestBankOfferValue?: string;
}

export function ShoppingIntelligenceSummary({
  storeName,
  bestCouponValue,
  bestCashbackValue,
  bestBankOfferValue,
}: ShoppingIntelligenceProps) {
  if (!bestCouponValue && !bestCashbackValue && !bestBankOfferValue) {
    return null; // Nothing to aggregate
  }

  return (
    <div className="bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 border border-brand-indigo/20 rounded-2xl p-6 mb-8 mt-4 relative overflow-hidden shadow-premium-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-indigo/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-brand-indigo" />
        </div>
        <h3 className="font-headline text-lg text-slate-900 dark:text-white font-bold">
          Today's Summary for {storeName}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        {bestCouponValue && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <Receipt className="w-4 h-4" />
              <span className="text-sm font-medium">Best Coupon</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{bestCouponValue}</div>
          </div>
        )}
        
        {/* Metric 2 */}
        {bestCashbackValue && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <Banknote className="w-4 h-4" />
              <span className="text-sm font-medium">Best Cashback</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{bestCashbackValue}</div>
          </div>
        )}

        {/* Metric 3 */}
        {bestBankOfferValue && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Best Bank Offer</span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{bestBankOfferValue}</div>
          </div>
        )}

        {/* Final Metric */}
        <div className="bg-brand-indigo/10 dark:bg-brand-indigo/20 backdrop-blur-sm rounded-xl p-4 border border-brand-indigo/30 flex flex-col justify-center">
          <div className="text-brand-indigo dark:text-brand-indigo-300 text-sm font-bold mb-1 uppercase tracking-wider">
            Total Savings
          </div>
          <div className="text-xl font-bold text-brand-indigo dark:text-white">
            Maximized 
            <span className="text-xs font-normal text-brand-indigo/70 dark:text-brand-indigo-400 block mt-1">
              (Coupon + Cashback + Bank)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
