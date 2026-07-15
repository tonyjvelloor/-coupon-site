"use client";

import { useChat } from "ai/react";
import { Sparkles, MessageCircle, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { LocalStorageAdapter, ShoppingProfile } from "@/lib/profile";

export default function AssistantPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [profile, setProfile] = useState<ShoppingProfile | null>(null);

    useEffect(() => {
        new LocalStorageAdapter().getProfile().then(setProfile);
    }, []);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
        api: "/api/copilot",
        body: {
            userProfile: profile ? JSON.stringify({ walletBanks: profile.walletBanks, preferences: profile.preferences }) : undefined,
        },
        initialMessages: initialQuery ? [
            { id: '1', role: 'user', content: initialQuery }
        ] : []
    });

    useEffect(() => {
        if (initialQuery && messages.length === 1) {
            // If we have an initial query from the URL, automatically submit it by mocking the event
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            handleSubmit(fakeEvent);
        }
    }, [initialQuery]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        // Intercept createAlert tool invocations to write to localStorage
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.toolInvocations) {
            lastMessage.toolInvocations.forEach(inv => {
                if (inv.toolName === 'createAlert' && inv.state === 'result') {
                    const result = inv.result as any;
                    if (result.success && !result.savedClientSide) {
                        result.savedClientSide = true; // prevent duplicate saving
                        const adapter = new LocalStorageAdapter();
                        adapter.getProfile().then(p => {
                            p.alerts.push({
                                id: crypto.randomUUID(),
                                query: inv.args.query as string,
                                threshold: inv.args.threshold as string | undefined,
                                storeSlug: inv.args.storeSlug as string | undefined,
                                createdAt: new Date().toISOString()
                            });
                            adapter.saveProfile(p);
                        });
                    }
                }
            });
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-black flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                    </Link>
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                        <Sparkles className="w-5 h-5" />
                        <h1 className="font-bold text-lg">Shopping Copilot</h1>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up mt-20">
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center text-primary-600 dark:text-primary-400 rotate-3 shadow-lg">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-surface-900 dark:text-white">I am your Shopping Copilot.</h2>
                            <p className="text-lg text-surface-500 mt-2 max-w-lg mx-auto">
                                I use real-time merchant data to compare prices, find coupons, and calculate your exact savings.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                            {[
                                "Compare Amazon and Flipkart for laptops",
                                "What's the best discount on Myntra?",
                                "Show me HDFC bank offers",
                                "Are there any flat 500 off coupons today?"
                            ].map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="p-4 text-left rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-primary-500 hover:shadow-md transition-all group"
                                >
                                    <p className="text-surface-700 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium">{suggestion}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 space-y-6 pb-24">
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-4 max-w-[85%] sm:max-w-[75%]`}>
                                    {m.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-md">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div className={`px-6 py-4 rounded-3xl ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white dark:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-700 rounded-tl-sm text-surface-800 dark:text-surface-200'}`}>
                                        {m.role === 'assistant' ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p>{m.content}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-4 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-md">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <div className="px-6 py-4 rounded-3xl bg-white dark:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-700 rounded-tl-sm text-surface-500">
                                        Analyzing deals...
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            {/* Input Footer */}
            <footer className="fixed bottom-0 w-full bg-white dark:bg-black border-t border-surface-200 dark:border-surface-800 p-4 z-50">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-surface-100 dark:bg-surface-900 rounded-full p-2 ring-1 ring-surface-200 dark:ring-surface-700 focus-within:ring-primary-500 focus-within:ring-2 transition-all shadow-inner">
                        <div className="pl-4 text-primary-500">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask anything about shopping or deals..."
                            className="flex-1 bg-transparent border-none py-3 px-4 text-lg focus:ring-0 focus:outline-none dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 disabled:text-surface-500 text-white rounded-full transition-all shadow-md mr-1"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-surface-400 mt-3">Copilot can make mistakes. Please verify deals at checkout.</p>
                </div>
            </footer>
        </div>
    );
}
