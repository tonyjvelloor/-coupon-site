"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, ExternalLink, Sparkles, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { voteCouponAction } from "@/app/actions/coupon";
import confetti from "canvas-confetti";
import { TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CouponModalProps {
  coupon: {
    id: string;
    title: string;
    code?: string;
    description?: string;
    affiliateUrl: string;
    storeName: string;
    storeLogo?: string;
    successRate?: number;
    successCount?: number;
    failureCount?: number;
    usageCount?: number;
    lastVerifiedAt?: Date | string | null;
  };
  onClose: () => void;
}

export function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  const handleVote = async (type: 'up' | 'down') => {
    if (vote) return; // already voted
    setVote(type);
    trackEvent('coupon_voted', { couponId: coupon.id, type });
    await voteCouponAction(coupon.id, type === 'up');
  };

  const initialTotalVotes = (coupon.successCount || 0) + (coupon.failureCount || 0);
  const successRate = initialTotalVotes > 0
      ? Math.round(((coupon.successCount || 0) / initialTotalVotes) * 100)
      : (coupon.successRate || 95);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleCopy = (e: React.MouseEvent) => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x, y },
        colors: ['#10b981', '#34d399', '#059669'],
        disableForReducedMotion: true,
        zIndex: 150
      });

      trackEvent('modal_coupon_copied', { couponId: coupon.id });
      setTimeout(() => setCopied(false), 2500);
      
      // Auto redirect after copy
      setIsRedirecting(true);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRedirecting && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (isRedirecting && countdown === 0) {
      window.location.href = coupon.affiliateUrl;
    }
    return () => clearTimeout(timer);
  }, [isRedirecting, countdown, coupon.affiliateUrl]);

  const storeLogo = coupon.storeLogo || `https://icon.horse/icon/${coupon.storeName.toLowerCase().replace(/\s+/g, '')}.com`;

  return (
    <div className="fixed inset-0 z-[100] flex sm:items-center items-end justify-center sm:p-4 px-0 pb-0 pt-12">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white sm:border border-slate-200 sm:rounded-2xl rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] max-w-sm w-full overflow-hidden z-10 flex flex-col sm:animate-scale-up animate-slideUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="px-6 pt-10 pb-6 flex flex-col items-center text-center">
          
          <div className="w-14 h-14 mb-4 rounded-xl border border-slate-100 flex items-center justify-center shadow-sm relative overflow-hidden bg-white">
             <Image src={storeLogo} alt={coupon.storeName} fill className="object-contain p-2" unoptimized />
          </div>

          <h2 className="text-heading text-slate-900 mb-1">
             {coupon.code ? "Coupon Ready" : "Deal Activated"}
          </h2>
          <p className="text-body text-slate-500 mb-6">
             at {coupon.storeName}
          </p>

          {/* Coupon Reputation Strip */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-3 gap-2 py-3 px-2 mb-6">
              <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Worked</span>
                  <div className="flex items-center gap-1 text-brand-emerald font-bold text-sm">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {successRate}%
                  </div>
              </div>
              
              <div className="flex flex-col items-center border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Used</span>
                  <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {((coupon.usageCount || 0) + 1234).toLocaleString()}
                  </div>
              </div>

              <div className="flex flex-col items-center border-l border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Verified</span>
                  <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                      <span className="relative flex h-2 w-2 mr-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
                      </span>
                      {coupon.lastVerifiedAt ? formatDistanceToNow(new Date(coupon.lastVerifiedAt)).replace('about ', '') : 'Today'}
                  </div>
              </div>
          </div>

          {/* Code Section */}
          {coupon.code ? (
            <div className="w-full mb-6">
              <div 
                onClick={handleCopy}
                className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all active:scale-[0.98] ${
                  copied 
                    ? "border-emerald-500 bg-emerald-50" 
                    : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                }`}
              >
                 <span className="font-mono text-display-l text-slate-900 tracking-wider mb-2">
                    {coupon.code}
                 </span>
                 
                 <div className="flex items-center gap-2 text-label">
                    {copied ? (
                      <span className="flex items-center gap-1.5 text-brand-emerald"><Check className="w-4 h-4" /> ✓ Coupon copied</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-600"><Copy className="w-4 h-4" /> Tap to copy</span>
                    )}
                 </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-emerald-500 mb-2" />
              <span className="font-bold text-emerald-700">Discount applied automatically</span>
            </div>
          )}

          {/* Status Message */}
          {isRedirecting ? (
             <div className="w-full py-2 flex items-center justify-center gap-2 text-caption text-brand-indigo font-medium animate-pulse">
                Opening {coupon.storeName}... ({countdown}s)
             </div>
          ) : null}

          {/* Voting UI */}
          {copied && (
            <div className="w-full flex flex-col items-center mt-2 mb-2 animate-fade-in-up">
              <p className="text-body text-slate-700 font-medium mb-3">Did this coupon work?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleVote('up')}
                  disabled={vote !== null}
                  className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-label ${
                    vote === 'up' 
                      ? 'bg-emerald-50 border-emerald-200 text-brand-emerald' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  } ${vote === 'down' ? 'opacity-50 grayscale' : ''}`}
                >
                  <span className="text-base">👍</span> Worked
                </button>
                <button 
                  onClick={() => handleVote('down')}
                  disabled={vote !== null}
                  className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-label ${
                    vote === 'down' 
                      ? 'bg-slate-100 border-slate-300 text-slate-800' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  } ${vote === 'up' ? 'opacity-50 grayscale' : ''}`}
                >
                  <span className="text-base">👎</span> Didn't work
                </button>
              </div>
              {vote && (
                <p className="text-caption text-brand-emerald mt-3 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Vote recorded. Success rate updated!
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-slate-100 my-4" />

          {/* Shopping Assistant - Extra Savings */}
          <div className="w-full text-left">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Extra savings available
            </h4>
            <ul className="space-y-2.5">
               {/* Mock extra savings - In a real app this would come from store.bankOffers or store.cashback */}
               <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Up to 5% Cashback</span>
               </li>
               <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">HDFC Bank Offer</span>
               </li>
            </ul>
          </div>

        </div>

        {/* Action Bottom */}
        <div className="p-4 pb-safe sm:pb-4 bg-slate-50 border-t border-slate-100 mt-auto">
           <a
            href={coupon.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('modal_continue_clicked', { storeName: coupon.storeName })}
            className="w-full flex items-center justify-center gap-2 h-14 sm:h-12 bg-brand-emerald hover:bg-emerald-600 text-white rounded-xl text-label transition-all shadow-sm active:scale-[0.98]"
           >
             Continue to {coupon.storeName}
             <ExternalLink className="w-4 h-4 text-emerald-100" />
           </a>
        </div>
      </div>
    </div>
  );
}
