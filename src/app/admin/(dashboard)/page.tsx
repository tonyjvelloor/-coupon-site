import { prisma } from "@/lib/db";
import { Store, Tag, Ticket, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getStats() {
    const [storesCount, categoriesCount, couponsCount, featuredCoupons] =
        await Promise.all([
            prisma.store.count({ where: { isActive: true } }),
            prisma.category.count({ where: { isActive: true } }),
            prisma.coupon.count(),
            prisma.coupon.count({ where: { isFeatured: true } }),
        ]);

    return { storesCount, categoriesCount, couponsCount, featuredCoupons };
}

async function getRecentCoupons() {
    return prisma.coupon.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { store: true },
    });
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const recentCoupons = await getRecentCoupons();

    return (
        <div className="pt-2">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 text-lg">Good morning! Here's what's happening with your deals.</p>
                </div>
                <div className="hidden md:flex gap-3">
                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Active Stores"
                    value={stats.storesCount}
                    icon={Store}
                    href="/admin/stores"
                    color="violet"
                    trend="+2 this week"
                />
                <StatCard
                    title="Categories"
                    value={stats.categoriesCount}
                    icon={Tag}
                    href="/admin/categories"
                    color="blue"
                    trend="Stable"
                />
                <StatCard
                    title="Total Coupons"
                    value={stats.couponsCount}
                    icon={Ticket}
                    href="/admin/coupons"
                    color="orange"
                    trend="+12% vs last month"
                />
                <StatCard
                    title="Featured Deals"
                    value={stats.featuredCoupons}
                    icon={TrendingUp}
                    href="/admin/coupons"
                    color="green"
                    trend="High Engagement"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Coupons - Takes up 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-xl text-gray-900">Recent Coupons</h2>
                            <p className="text-sm text-gray-500 mt-1">Latest deals added to the platform</p>
                        </div>
                        <Link
                            href="/admin/coupons/new"
                            className="btn-primary text-sm px-5 py-2.5 shadow-lg shadow-violet-200 hover:shadow-violet-300"
                        >
                            + Add Coupon
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentCoupons.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Ticket className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 font-medium mb-1">No coupons yet</h3>
                                <p className="text-gray-500 text-sm">Get started by creating your first deal.</p>
                            </div>
                        ) : (
                            recentCoupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-violet-100 group-hover:bg-violet-50 transition-colors">
                                            <Ticket className="w-5 h-5 text-gray-400 group-hover:text-violet-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                                                {coupon.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                    {coupon.store.name}
                                                </span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-sm text-gray-500">{coupon.code || "Direct Deal"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {coupon.isVerified && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                Verified
                                            </span>
                                        )}
                                        {coupon.isFeatured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                Featured
                                            </span>
                                        )}
                                        <Link
                                            href={`/admin/coupons/${coupon.id}`}
                                            className="text-gray-400 hover:text-violet-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100">
                        <Link href="/admin/coupons" className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
                            View all coupons
                            <TrendingUp className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Quick Actions Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg">Project Status</h3>
                                <p className="text-violet-100 text-sm mt-1">Everything running smoothly</p>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                <p className="text-xs text-violet-200 mb-1">Server Uptime</p>
                                <p className="font-bold">99.9%</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                <p className="text-xs text-violet-200 mb-1">Response Time</p>
                                <p className="font-bold">120ms</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <QuickAction
                            title="Add New Store"
                            description="Partner with a new brand"
                            href="/admin/stores/new"
                            icon={Store}
                        />
                        <QuickAction
                            title="Create Campaign"
                            description="Generate tracking links"
                            href="/admin/campaign-links/new"
                            icon={Ticket}
                        />
                        <QuickAction
                            title="View Live Site"
                            description="Check frontend preview"
                            href="/"
                            external
                            icon={TrendingUp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    href: string;
    color: "violet" | "blue" | "orange" | "green";
    trend?: string;
}

function StatCard({ title, value, icon: Icon, href, color, trend }: StatCardProps) {
    const colors = {
        violet: "bg-violet-50 text-violet-600 border-violet-100 hover:border-violet-300",
        blue: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300",
        orange: "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300",
        green: "bg-green-50 text-green-600 border-green-100 hover:border-green-300",
    };

    return (
        <Link
            href={href}
            className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110 ${color === 'violet' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' :
                    color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                        color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-amber-600' :
                            'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${color === 'violet' ? 'bg-violet-50 text-violet-700' :
                        color === 'blue' ? 'bg-blue-50 text-blue-700' :
                            color === 'orange' ? 'bg-orange-50 text-orange-700' :
                                'bg-green-50 text-green-700'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
                <p className="text-gray-500 font-medium mt-1">{title}</p>
            </div>
        </Link>
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    href: string;
    external?: boolean;
    icon?: React.ElementType;
}

function QuickAction({ title, description, href, external, icon: Icon }: QuickActionProps) {
    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 transition-all group flex items-start gap-4"
        >
            {Icon && (
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition-colors" />
                </div>
            )}
            <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
            </div>
        </Link>
    );
}
