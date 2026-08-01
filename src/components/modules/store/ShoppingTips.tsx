"use client";

import React from 'react';
import { Lightbulb, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { contentSplitService } from '@/lib/services/content-split.service';

interface ShoppingTipsProps {
    storeSlug: string;
    tips: any[];
}

export function ShoppingTips({ storeSlug, tips }: ShoppingTipsProps) {
    if (!tips || tips.length === 0) return null;

    const shouldSplit = contentSplitService.shouldSplitShoppingTips(tips);
    const displayTips = shouldSplit ? tips.slice(0, 3) : tips;

    return (
        <section className="pt-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Pro Shopping Tips
            </h2>
            <div className="space-y-4">
                {displayTips.map((tip) => (
                    <div key={tip.id} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-500">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{tip.title}</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    {tip.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {shouldSplit && (
                <div className="mt-6 text-center">
                    <Link 
                        href={`/stores/${storeSlug}/shopping-tips`}
                        className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 hover:underline"
                    >
                        Read all {tips.length} Shopping Tips
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </section>
    );
}
