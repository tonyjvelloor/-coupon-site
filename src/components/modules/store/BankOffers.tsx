"use client";

import React from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { contentSplitService } from '@/lib/services/content-split.service';

interface BankOffersProps {
    storeSlug: string;
    offers: any[];
}

export function BankOffers({ storeSlug, offers }: BankOffersProps) {
    if (!offers || offers.length === 0) return null;

    const shouldSplit = contentSplitService.shouldSplitBankOffers(offers);
    const displayOffers = shouldSplit ? offers.slice(0, 3) : offers;

    return (
        <section id="save-more" className="pt-12 scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Save More with Bank & Wallet Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayOffers.map((offer) => (
                    <div key={offer.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{offer.bank?.name || 'Bank Offer'}</h3>
                        </div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                            {offer.discountDetails}
                        </p>
                        {offer.terms && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {offer.terms}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {shouldSplit && (
                <div className="mt-6 text-center">
                    <Link 
                        href={`/stores/${storeSlug}/bank-offers`}
                        className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 hover:underline"
                    >
                        View all {offers.length} Bank Offers
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </section>
    );
}
