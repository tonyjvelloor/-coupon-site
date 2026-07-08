import React from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 pt-16 pb-8">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col gap-5">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                                <Icon name="local_activity" className="text-white text-[24px]" variant="fill" />
                            </div>
                            <span className="text-xl font-headline-lg font-bold tracking-tight text-on-surface">CouponHub</span>
                        </Link>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                            The structured commerce intelligence layer for online shopping. Never overpay again.
                        </p>
                        <div className="flex items-center gap-3 text-on-surface-variant">
                            <button className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:text-primary transition-colors">
                                <Icon name="share" className="text-[16px]" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center hover:text-primary transition-colors">
                                <Icon name="mail" className="text-[16px]" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-on-surface mb-5 text-sm uppercase tracking-widest">Intelligence</h4>
                        <ul className="space-y-4 text-sm text-on-surface-variant font-medium">
                            <li><Link href="/stores" className="hover:text-primary transition-colors flex items-center gap-2"><Icon name="storefront" className="text-[16px]" /> Merchant Directory</Link></li>
                            <li><Link href="/categories" className="hover:text-primary transition-colors flex items-center gap-2"><Icon name="category" className="text-[16px]" /> Categories</Link></li>
                            <li><Link href="/knowledge" className="hover:text-primary transition-colors flex items-center gap-2"><Icon name="menu_book" className="text-[16px]" /> Buying Guides</Link></li>
                            <li><Link href="/news" className="hover:text-primary transition-colors flex items-center gap-2"><Icon name="timeline" className="text-[16px]" /> Deal News</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-on-surface mb-5 text-sm uppercase tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm text-on-surface-variant font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-on-surface mb-1 text-sm uppercase tracking-widest">The Guarantee</h4>
                        <div className="glass-card bg-surface-50 dark:bg-surface-800 p-4 rounded-xl flex items-start gap-3 border border-surface-200 dark:border-surface-700 shadow-sm">
                            <Icon name="verified_user" className="text-verified-green text-[28px] shrink-0" variant="fill" />
                            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                                Every offer is programmatically verified by our intelligence engine to ensure validity before publishing.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-surface-200 dark:border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold tracking-wide text-on-surface-variant">
                    <p>&copy; {new Date().getFullYear()} CouponHub. All rights reserved.</p>
                    <div className="flex items-center gap-4 bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-lg">
                        <Icon name="language" className="text-[16px]" /> English (US)
                    </div>
                </div>
            </div>
        </footer>
    );
}
