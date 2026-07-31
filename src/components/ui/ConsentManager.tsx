"use client";

import React, { useState, useEffect } from "react";
import { Check, Info, Settings, X } from "lucide-react";

export type ConsentPreferences = {
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
};

export function ConsentManager() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        functional: true, // Always true
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const storedConsent = localStorage.getItem("couponhub-consent");
        if (storedConsent) {
            try {
                const parsed = JSON.parse(storedConsent);
                setPreferences(parsed);
                // Dispatch event so layout.tsx can react and load scripts if needed
                window.dispatchEvent(new CustomEvent("consentUpdated", { detail: parsed }));
            } catch (e) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(true);
        }
    }, []);

    const handleSave = (newPreferences: ConsentPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem("couponhub-consent", JSON.stringify(newPreferences));
        window.dispatchEvent(new CustomEvent("consentUpdated", { detail: newPreferences }));
        setIsVisible(false);
    };

    const handleAcceptAll = () => {
        handleSave({ functional: true, analytics: true, marketing: true });
    };

    const handleRejectAll = () => {
        handleSave({ functional: true, analytics: false, marketing: false });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-4 md:p-6 pointer-events-none flex justify-center">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl pointer-events-auto animate-in slide-in-from-bottom-10">
                {!showDetails ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">We value your privacy</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    We use cookies to enhance your browsing experience, serve personalized deals, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white text-sm font-bold rounded-xl transition-all shadow-premium-sm"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleRejectAll}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-all"
                            >
                                Reject Non-Essential
                            </button>
                            <button
                                onClick={() => setShowDetails(true)}
                                className="px-6 py-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" /> Manage Preferences
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cookie Preferences</h3>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2">
                            {/* Functional */}
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        Strictly Necessary <Check className="w-4 h-4 text-emerald-500" />
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        These cookies are essential for the website to function properly. They cannot be disabled.
                                    </p>
                                </div>
                                <div className="w-12 h-6 bg-emerald-500 rounded-full relative opacity-50 cursor-not-allowed">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Analytics</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Help us understand how visitors interact with the website, allowing us to improve the experience.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${preferences.analytics ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Marketing */}
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marketing & Personalization</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Used to track visitors across websites to display relevant ads and track affiliate conversions properly.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${preferences.marketing ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => handleSave(preferences)}
                                className="flex-1 px-6 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white text-sm font-bold rounded-xl transition-all shadow-premium-sm"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
