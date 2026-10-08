"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

// We'll generate realistic looking notifications
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Ahmedabad", "Gurgaon", "Noida", "Kolkata"];
const ACTIONS = ["just saved on", "just unlocked a coupon for", "just used a promo code for", "found a working deal for", "claimed cashback on"];
const TIMES = ["Just now", "2 mins ago", "1 min ago", "A few seconds ago"];

export function SocialProofToast({ stores }: { stores: { name: string, logo: string | null }[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<{city: string, action: string, store: any, time: string} | null>(null);

  useEffect(() => {
    if (!stores || stores.length === 0) return;

    const showRandomNotification = () => {
      const store = stores[Math.floor(Math.random() * stores.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const time = TIMES[Math.floor(Math.random() * TIMES.length)];

      setNotification({ city, action, store, time });
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial delay so it doesn't pop up immediately on load
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 4000);

    // Then pop up randomly every 12 to 25 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.floor(Math.random() * 13000) + 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [stores]);

  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ease-in-out transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-3 pr-5 flex items-center gap-4 max-w-sm cursor-default hover:scale-[1.02] transition-transform">
        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
          {notification?.store?.logo ? (
            <img src={notification.store.logo} alt={notification.store.name} className="w-6 h-6 object-contain" />
          ) : (
            <CheckCircle className="w-6 h-6 text-verified-emerald" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600 leading-tight">
            Someone from <span className="font-semibold text-slate-800">{notification?.city}</span> {notification?.action} <span className="font-bold text-brand-indigo">{notification?.store?.name}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-verified-emerald animate-pulse"></span>
            Verified {notification?.time}
          </p>
        </div>
      </div>
    </div>
  );
}
