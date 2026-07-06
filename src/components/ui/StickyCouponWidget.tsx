"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StickyCouponWidgetProps {
    deal: {
        id: string;
        title: string;
        discountValue: string | null;
        store: { name: string; slug: string };
    } | null;
}

export default function StickyCouponWidget({ deal }: StickyCouponWidgetProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (!deal || isDismissed) return;

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [deal, isDismissed]);

    if (!isVisible || !deal || isDismissed) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-80 z-40 animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-2xl p-4 flex flex-col gap-2 relative overflow-hidden border border-violet-400">
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-2 text-sm font-bold text-violet-200">
                    <Sparkles className="w-4 h-4" />
                    Deal of the Day
                </div>
                
                <h4 className="font-bold text-lg leading-tight">
                    {deal.discountValue && <span className="text-orange-300 mr-2">{deal.discountValue}</span>}
                    {deal.title}
                </h4>
                
                <Link 
                    href={`/stores/${deal.store.slug}`}
                    className="mt-2 inline-flex items-center justify-center gap-2 bg-white text-violet-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Shop {deal.store.name} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
