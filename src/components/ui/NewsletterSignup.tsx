"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

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

                // Reset after 5 seconds
                setTimeout(() => {
                    setStatus("idle");
                    setMessage("");
                }, 5000);
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to subscribe. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("A network error occurred. Please try again later.");
        }
    };

    return (
        <section className="py-20 relative overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-6">
                                <Mail className="w-4 h-4" />
                                <span>Weekly Premium Deals</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Great Deal</span> Again
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Join 50,000+ smart shoppers who get our hand-picked, exclusive coupon codes delivered straight to their inbox every Friday.
                            </p>
                        </div>

                        {/* Form Form */}
                        <div className="flex-1 w-full max-w-md">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address..."
                                        className="block w-full pl-11 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-base disabled:opacity-50"
                                        required
                                        disabled={status === "loading" || status === "success"}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "loading" || status === "success"}
                                    className="relative w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-violet-500/30 flex items-center justify-center gap-2 overflow-hidden group"
                                >
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>

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
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Status Messages */}
                                {status === "success" && (
                                    <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                                        {message}
                                    </p>
                                )}
                                {status === "error" && (
                                    <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                                        {message}
                                    </p>
                                )}
                            </form>
                            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                                No spam ever. Unsubscribe at any time. Read our <a href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
