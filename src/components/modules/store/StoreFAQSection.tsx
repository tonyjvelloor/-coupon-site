"use client";

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface StoreFAQSectionProps {
    storeName: string;
    faqs: FAQItem[];
}

export function StoreFAQSection({ storeName, faqs }: StoreFAQSectionProps) {
    if (!faqs || faqs.length === 0) return null;

    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq-section" className="scroll-mt-24 pt-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 dark:bg-brand-indigo/20 flex items-center justify-center text-brand-indigo shrink-0">
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Verified answers for {storeName} promo codes, discounts, and saving strategies
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-4 md:p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-sm md:text-base pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                                            isOpen ? 'rotate-180 text-brand-indigo' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-4 md:px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
