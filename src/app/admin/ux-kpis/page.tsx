import React from 'react';
import { 
    MousePointerClick, 
    Copy, 
    ThumbsUp, 
    TrendingUp, 
    ArrowUpRight,
    Users,
    MousePointer2
} from 'lucide-react';
import Link from 'next/link';

export default function UXKPIDashboard() {
    // Mock data for demonstration
    const stats = [
        {
            title: "Modal Click-Through Rate",
            value: "24.8%",
            change: "+2.1%",
            trend: "up",
            icon: MousePointerClick,
            description: "Users clicking 'Continue' in modal"
        },
        {
            title: "Coupon Copy Rate",
            value: "68.2%",
            change: "+5.4%",
            trend: "up",
            icon: Copy,
            description: "Users clicking to copy code"
        },
        {
            title: "Success Vote Rate",
            value: "89.4%",
            change: "-0.5%",
            trend: "down",
            icon: ThumbsUp,
            description: "Ratio of 👍 to total votes"
        },
        {
            title: "Modal Abandonment",
            value: "12.1%",
            change: "-1.2%",
            trend: "up", // lower is better
            icon: MousePointer2,
            description: "Closed modal without action"
        }
    ];

    const recentVotes = [
        { id: 1, store: "Amazon", type: "up", time: "2m ago", coupon: "AMZSAVE20" },
        { id: 2, store: "Myntra", type: "down", time: "5m ago", coupon: "MYNTRASHOP" },
        { id: 3, store: "Swiggy", type: "up", time: "12m ago", coupon: "SWIGGY50" },
        { id: 4, store: "Flipkart", type: "up", time: "18m ago", coupon: "FLIPBBD" },
        { id: 5, store: "Zomato", type: "up", time: "25m ago", coupon: "ZOMATOGOLD" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product UX KPIs</h1>
                        <p className="text-slate-500 mt-1">Real-time metrics for trust and conversion micro-interactions.</p>
                    </div>
                    <Link href="/admin" className="text-sm font-medium text-brand-indigo hover:underline">
                        &larr; Back to Admin
                    </Link>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <stat.icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${
                                    stat.trend === 'up' ? 'text-brand-emerald' : 'text-red-500'
                                }`}>
                                    {stat.change}
                                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-900 mb-1">{stat.title}</p>
                            <p className="text-xs text-slate-500">{stat.description}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Funnel */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Conversion Funnel</h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">1. Clicked "Show Code"</span>
                                    <span className="text-sm font-bold text-slate-900">12,450</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-indigo w-full rounded-full"></div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">2. Copied Code</span>
                                    <span className="text-sm font-bold text-slate-900">8,491 <span className="text-slate-400 font-normal ml-1">(68.2%)</span></span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-indigo rounded-full" style={{ width: '68.2%' }}></div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-700">3. Clicked "Continue"</span>
                                    <span className="text-sm font-bold text-slate-900">3,087 <span className="text-slate-400 font-normal ml-1">(24.8%)</span></span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-indigo rounded-full" style={{ width: '24.8%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Votes */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Live Feedback</h2>
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-emerald"></span>
                            </span>
                        </div>
                        <div className="space-y-4">
                            {recentVotes.map(vote => (
                                <div key={vote.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            vote.type === 'up' ? 'bg-emerald-50 text-brand-emerald' : 'bg-red-50 text-red-500'
                                        }`}>
                                            {vote.type === 'up' ? <ThumbsUp className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4 rotate-180" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{vote.store}</p>
                                            <p className="text-xs text-slate-500 font-mono">{vote.coupon}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{vote.time}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2.5 text-sm font-medium text-brand-indigo bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                            View all feedback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
