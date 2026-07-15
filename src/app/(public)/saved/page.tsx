"use client";

import React from 'react';
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";
import { useShoppingProfile } from "@/components/providers/UserProvider";

const MVP_BANKS = [
  "HDFC Bank", "ICICI Bank", "SBI Cards", "Axis Bank", "Kotak Mahindra Bank", 
  "IndusInd Bank", "IDFC FIRST Bank", "AU Small Finance Bank", "Yes Bank", 
  "HSBC India", "Standard Chartered", "American Express", "OneCard", 
  "Amazon Pay ICICI Card", "Flipkart Axis Bank Card"
];

export default function SavedHubPage() {
    const { profile, isLoaded, removeStore, toggleBank, isBankSelected, togglePreference } = useShoppingProfile();

    if (!isLoaded) {
        return (
            <div className="bg-surface-50 dark:bg-surface-950 min-h-screen py-12 flex items-center justify-center">
                <Icon name="sync" className="animate-spin text-primary text-3xl" />
            </div>
        );
    }

    return (
        <div className="bg-surface-50 dark:bg-surface-950 min-h-screen py-12">
            <div className="max-w-container-md mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-surface-200 dark:border-surface-800">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg">
                        <Icon name="person" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-headline-lg font-bold text-slate-900 dark:text-white">Shopping Profile</h1>
                        <p className="text-surface-500 mt-1">Your personalized command center.</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Saved Stores */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Icon name="favorite" className="text-primary text-2xl" variant="fill" /> Saved Stores
                        </h2>
                        {profile.savedStores.length === 0 ? (
                            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-8 text-center">
                                <Icon name="storefront" className="text-4xl text-surface-300 dark:text-surface-700 mb-3" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No saved stores yet</h3>
                                <p className="text-surface-500 mb-6">Save your favorite merchants to quickly access their best deals.</p>
                                <Link href="/stores" className="inline-flex items-center justify-center bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors">
                                    Browse Stores
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {profile.savedStores.map(storeSlug => (
                                    <div key={storeSlug} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-sm transition group relative">
                                        <Link href={`/stores/${storeSlug}`} className="absolute inset-0 z-10" />
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex items-center justify-center shrink-0 uppercase font-bold text-surface-400">
                                            {storeSlug.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition truncate capitalize">{storeSlug.replace(/-/g, ' ')}</h3>
                                            <p className="text-xs text-green-600 dark:text-green-400 font-medium truncate">Tracking Active Deals</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeStore(storeSlug); }}
                                            className="relative z-20 w-8 h-8 rounded-full flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <Icon name="delete_outline" className="text-[18px]" />
                                        </button>
                                    </div>
                                ))}
                                <Link href="/stores" className="bg-surface-100 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-surface-200 dark:hover:bg-surface-800 transition text-surface-600 dark:text-surface-400 font-medium">
                                    <Icon name="add" /> Add More
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Recently Viewed */}
                    {profile.recentlyViewed.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Icon name="history" className="text-blue-500 text-2xl" /> Recently Viewed
                            </h2>
                            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 custom-scrollbar">
                                {profile.recentlyViewed.map(store => (
                                    <Link key={`recent-${store.slug}`} href={`/stores/${store.slug}`} className="w-32 shrink-0 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary hover:shadow-sm transition">
                                        <div className="w-16 h-16 rounded-xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center border border-surface-100 dark:border-surface-700 overflow-hidden relative">
                                            {store.logo ? (
                                                <Image src={store.logo} alt={store.name} fill className="object-contain p-2" />
                                            ) : (
                                                <span className="font-bold text-xl text-surface-400">{store.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-sm text-slate-900 dark:text-white text-center truncate w-full">{store.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Shopping Goals (Preferences) */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Icon name="track_changes" className="text-amber-500 text-2xl" /> Shopping Goals
                        </h2>
                        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 sm:p-8">
                            <p className="text-surface-600 dark:text-surface-400 mb-6">Select your primary shopping goals so we can personalize the deals you see.</p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { key: 'cashback', label: 'Cashback', icon: 'payments' },
                                    { key: 'coupons', label: 'Coupons', icon: 'local_offer' },
                                    { key: 'bankOffers', label: 'Bank Offers', icon: 'account_balance' },
                                    { key: 'studentDiscounts', label: 'Student Discounts', icon: 'school' },
                                    { key: 'emi', label: 'EMI', icon: 'credit_card' },
                                    { key: 'rewardPoints', label: 'Reward Points', icon: 'stars' },
                                ].map(pref => {
                                    const isSelected = profile.preferences[pref.key as keyof typeof profile.preferences];
                                    return (
                                        <button
                                            key={pref.key}
                                            onClick={() => togglePreference(pref.key as keyof typeof profile.preferences)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all border ${
                                                isSelected 
                                                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                                                : 'bg-surface-50 dark:bg-surface-950 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:border-amber-300'
                                            }`}
                                        >
                                            <Icon name={isSelected ? "check_circle" : pref.icon} className={isSelected ? "" : "opacity-70"} variant={isSelected ? "fill" : "outline"} />
                                            {pref.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* My Wallet / Bank Preferences */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Icon name="account_balance_wallet" className="text-purple-500 text-2xl" /> My Wallet
                        </h2>
                        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 sm:p-8">
                            <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-2xl">
                                Select the banks and cards you own. We'll automatically highlight deals and extra savings that work with your wallet across the entire site.
                            </p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {MVP_BANKS.map(bank => {
                                    const selected = isBankSelected(bank);
                                    return (
                                        <div 
                                            key={bank}
                                            onClick={() => toggleBank(bank)}
                                            className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all relative min-h-[100px] ${
                                                selected 
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-sm' 
                                                : 'border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 hover:border-purple-300 dark:hover:border-purple-700'
                                            }`}
                                        >
                                            {selected && (
                                                <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-1 shadow-sm">
                                                    <Icon name="check" className="text-[14px]" />
                                                </div>
                                            )}
                                            <Icon name="account_balance" className={`text-[24px] ${selected ? 'text-purple-500' : 'text-surface-300 dark:text-surface-600'}`} />
                                            <span className={`font-bold text-sm leading-tight ${selected ? 'text-purple-900 dark:text-purple-100' : 'text-surface-600 dark:text-surface-400'}`}>
                                                {bank}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Active Alerts */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Icon name="notifications_active" className="text-green-500 text-2xl" /> Active Alerts
                        </h2>
                        {profile.alerts && profile.alerts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.alerts.map(alert => (
                                    <div key={alert.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 flex flex-col gap-2 hover:border-green-300 transition shadow-sm relative">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold mb-1">
                                                <Icon name="radar" className="text-[18px]" />
                                                <span className="text-sm tracking-wide uppercase">Watching</span>
                                            </div>
                                            <span className="text-xs text-surface-400 font-medium">Added {new Date(alert.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{alert.query}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {alert.threshold && (
                                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-bold border border-green-200 dark:border-green-800/30">
                                                    Target: {alert.threshold}
                                                </span>
                                            )}
                                            {alert.storeSlug && (
                                                <span className="px-3 py-1 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-full text-xs font-bold border border-surface-200 dark:border-surface-700">
                                                    {alert.storeSlug}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-8 text-center">
                                <Icon name="notifications_off" className="text-4xl text-surface-300 dark:text-surface-700 mb-3" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active alerts</h3>
                                <p className="text-surface-500 mb-6">Ask the Shopping Copilot to notify you when prices drop on items you want.</p>
                                <Link href="/assistant" className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5">
                                    <Icon name="auto_awesome" className="mr-2" />
                                    Ask Copilot
                                </Link>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
}
