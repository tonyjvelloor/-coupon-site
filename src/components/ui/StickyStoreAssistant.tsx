"use client";

import { useState } from "react";
import { Sparkles, MessageCircle, X } from "lucide-react";
import { useChat } from "ai/react";
import { useEffect } from "react";
import { LocalStorageAdapter, ShoppingProfile } from "@/lib/profile";

interface StickyStoreAssistantProps {
    storeSlug: string;
    storeName: string;
}

export function StickyStoreAssistant({ storeSlug, storeName }: StickyStoreAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<ShoppingProfile | null>(null);

    useEffect(() => {
        new LocalStorageAdapter().getProfile().then(setProfile);
    }, []);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/copilot",
        body: {
            storeContext: storeSlug,
            userProfile: profile ? JSON.stringify({ walletBanks: profile.walletBanks, preferences: profile.preferences }) : undefined,
        },
    });

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[500px] border border-surface-200 dark:border-surface-700">
                    <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="font-bold">Ask about {storeName}</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-surface-500 dark:text-surface-400 mt-10">
                                <p className="font-medium">How can I help you save at {storeName}?</p>
                                <p className="text-sm mt-2">Try asking about the best card to use, or active coupons.</p>
                            </div>
                        )}
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100' : 'bg-surface-100 text-surface-900 dark:bg-surface-700 dark:text-white'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-surface-100 dark:bg-surface-700">
                                    <span className="animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 border-t border-surface-200 dark:border-surface-700">
                        <div className="relative">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="w-full pl-4 pr-10 py-3 rounded-full bg-surface-100 dark:bg-surface-900 border-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-2 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50">
                                <MessageCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-4 rounded-full font-bold shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                    <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                    Ask Copilot
                </button>
            )}
        </div>
    );
}
