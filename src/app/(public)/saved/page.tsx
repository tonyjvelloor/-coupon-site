import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";

export default function SavedHubPage() {
    return (
        <div className="bg-surface-50 min-h-screen py-12">
            <div className="max-w-container-md mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white">
                        <Icon name="person" className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-headline-md font-bold text-slate-900">My Dashboard</h1>
                        <p className="text-sm text-surface-500">Manage your saved stores, deals, and alerts.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Saved Stores */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Icon name="storefront" className="text-primary" /> Saved Stores
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {['Amazon', 'Flipkart', 'Myntra'].map(store => (
                                <Link key={store} href={`/stores/${store.toLowerCase()}`} className="bg-white border border-surface-200 rounded-xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-sm transition group">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-surface-100 flex-shrink-0 bg-surface-50 flex items-center justify-center">
                                        <span className="font-bold text-surface-400 text-xs">{store[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition">{store}</h3>
                                        <p className="text-xs text-green-600 font-medium">Active Cashback</p>
                                    </div>
                                    <Icon name="chevron_right" className="text-surface-300 group-hover:text-primary transition" />
                                </Link>
                            ))}
                            <Link href="/stores" className="bg-surface-100 border border-surface-200 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-surface-200 transition text-surface-600 font-medium">
                                <Icon name="add" /> Add More
                            </Link>
                        </div>
                    </section>

                    {/* Active Alerts */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Icon name="notifications_active" className="text-blue-500" /> Active Alerts
                        </h2>
                        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
                            <div className="divide-y divide-surface-100">
                                <div className="p-4 flex items-center justify-between hover:bg-surface-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                            <Icon name="trending_down" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Price Drop Alert</p>
                                            <p className="text-xs text-surface-500">Tracking iPhone 15 Pro on Amazon</p>
                                        </div>
                                    </div>
                                    <button className="text-surface-400 hover:text-red-500 transition">
                                        <Icon name="delete_outline" />
                                    </button>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-surface-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                            <Icon name="local_offer" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">New Coupon Alert</p>
                                            <p className="text-xs text-surface-500">Tracking Swiggy Instamart</p>
                                        </div>
                                    </div>
                                    <button className="text-surface-400 hover:text-red-500 transition">
                                        <Icon name="delete_outline" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* My Wallet / Bank Preferences */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Icon name="account_balance_wallet" className="text-purple-500" /> My Wallet
                        </h2>
                        <div className="bg-white border border-surface-200 rounded-xl overflow-hidden p-6">
                            <p className="text-sm text-surface-500 mb-4">Select the banks and cards you own to see personalized offers highlighted across the site.</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Selected Bank */}
                                <div className="border-2 border-primary bg-primary-50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-sm transition relative">
                                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-sm">
                                        <Icon name="check" className="text-[14px]" />
                                    </div>
                                    <span className="font-bold text-slate-900">HDFC Bank</span>
                                </div>
                                {/* Selected Bank */}
                                <div className="border-2 border-primary bg-primary-50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-sm transition relative">
                                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-sm">
                                        <Icon name="check" className="text-[14px]" />
                                    </div>
                                    <span className="font-bold text-slate-900">ICICI Bank</span>
                                </div>
                                {/* Unselected Bank */}
                                <div className="border border-surface-200 hover:border-primary-300 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-50 transition">
                                    <span className="font-semibold text-surface-600">SBI</span>
                                </div>
                                {/* Unselected Bank */}
                                <div className="border border-surface-200 hover:border-primary-300 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-50 transition">
                                    <span className="font-semibold text-surface-600">Axis Bank</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
