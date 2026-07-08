"use client";

import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    
    // Form state
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Only trigger once per session
        if (hasTriggered) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
                setIsVisible(true);
                setHasTriggered(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasTriggered]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                    setIsVisible(false); // Auto close on success
                }, 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to subscribe. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("A network error occurred. Please try again later.");
        }
    };

    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsVisible(false)}
        >
            <div 
                className="bg-white dark:bg-surface-950 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300 border border-surface-200 dark:border-surface-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-2 text-surface-400 hover:text-merchant-900 dark:hover:text-merchant-50 bg-surface-100 dark:bg-surface-800 rounded-full transition-colors z-20"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"></div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-merchant-900 dark:text-merchant-50 mb-2">
                            Wait! Don't leave empty handed
                        </h2>
                        <p className="text-surface-600 dark:text-surface-400 text-sm">
                            Join 50,000+ smart shoppers who get our hand-picked, exclusive coupon codes delivered straight to their inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="block w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-merchant-900 dark:text-merchant-50 placeholder-surface-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm disabled:opacity-50"
                                required
                                disabled={status === "loading" || status === "success"}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="relative w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-500 hover:to-fuchsia-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Subscribing...</span>
                                </>
                            ) : status === "success" ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                                    <span>Subscribed!</span>
                                </>
                            ) : (
                                <>
                                    <span>Get Exclusive Deals</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Status Messages */}
                        {status === "success" && (
                            <p className="text-success-600 dark:text-success-400 text-sm text-center font-medium animate-in fade-in">
                                {message}
                            </p>
                        )}
                        {status === "error" && (
                            <p className="text-error-500 dark:text-error-400 text-sm text-center font-medium animate-in fade-in">
                                {message}
                            </p>
                        )}
                    </form>
                    <p className="text-xs text-surface-400 dark:text-surface-500 text-center mt-4">
                        No spam ever. Unsubscribe at any time. Read our <a href="/privacy" className="underline hover:text-surface-600 dark:hover:text-surface-300">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
