"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function ContactFormClient() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState("Coupon Feedback / Expired Deal");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setFeedback("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, topic, message }),
            });
            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setFeedback(data.error || "Failed to send message.");
                return;
            }

            setStatus("success");
            setFeedback(data.message);
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
        } catch {
            setStatus("error");
            setFeedback("Network error. Please email support@couponhub.store directly.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="contact-first-name"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        placeholder="Aarav"
                    />
                </div>
                <div>
                    <label htmlFor="contact-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                    </label>
                    <input
                        id="contact-last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        placeholder="Sharma"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="contact-topic" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Topic
                    </label>
                    <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    >
                        <option>Coupon Feedback / Expired Deal</option>
                        <option>Merchant Partnership</option>
                        <option>Editorial Correction</option>
                        <option>Privacy / Data Request</option>
                        <option>General Inquiry</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="contact-message"
                    rows={4}
                    required
                    minLength={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    placeholder="Share store details, a broken coupon report, or your question..."
                />
            </div>

            {status === "success" && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feedback}</span>
                </div>
            )}
            {status === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {feedback}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {status === "submitting" ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                    </>
                )}
            </button>
        </form>
    );
}
