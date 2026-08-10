import { prisma } from "@/lib/db";
import Link from "next/link";
import {
    ShieldAlert, AlertTriangle, CheckCircle, Activity,
    Store, Tag, TrendingUp, Package, ArrowRight,
    RefreshCw, Database, Zap, BarChart3, AlertCircle, CircleCheck
} from "lucide-react";

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getDashboardData() {
    const [
        activeCoupons,
        totalStores,
        storesWithOffers,
        storesWithoutOffers,
        storesMissingDescription,
        expiringCoupons,
        topStores,
        recentCoupons,
        totalClicks,
        connectorBreakdown,
    ] = await Promise.all([
        // Active live coupons
        prisma.coupon.count({
            where: { deletedAt: null, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }
        }),
        // Total active stores
        prisma.store.count({ where: { isActive: true } }),
        // Stores WITH offers
        prisma.store.count({ where: { isActive: true, activeOfferCount: { gt: 0 } } }),
        // Stores WITHOUT offers (the gap)
        prisma.store.count({ where: { isActive: true, activeOfferCount: { equals: 0 } } }),
        // Stores missing description
        prisma.store.count({ where: { isActive: true, OR: [{ description: null }, { description: "" }] } }),
        // Coupons expiring in 3 days
        prisma.coupon.count({
            where: {
                deletedAt: null,
                expiresAt: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), gt: new Date() }
            }
        }),
        // Top 8 stores by coupon count
        prisma.store.findMany({
            where: { isActive: true, activeOfferCount: { gt: 0 } },
            orderBy: { activeOfferCount: "desc" },
            take: 8,
            select: { name: true, slug: true, activeOfferCount: true, logo: true }
        }),
        // Recently added coupons (last 24h)
        prisma.coupon.count({
            where: { deletedAt: null, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        }),
        // Total click events tracked
        prisma.outboundEvent.count(),
        // Coupons by connector source
        prisma.coupon.groupBy({
            by: ["connector"],
            where: { deletedAt: null },
            _count: { id: true }
        }),
    ]);

    // Coverage score: % of stores that have at least 1 offer
    const coverageScore = totalStores > 0 ? Math.round((storesWithOffers / totalStores) * 100) : 0;

    // Build actionable tasks from real data
    const tasks: Array<{
        level: "critical" | "high" | "medium";
        title: string;
        reason: string;
        action: string;
        href: string;
        count?: number;
    }> = [];

    if (storesWithoutOffers > 1000) {
        tasks.push({
            level: "critical",
            title: `${storesWithoutOffers.toLocaleString()} stores have zero coupons`,
            reason: "These stores show empty pages to users — broken experience, zero revenue.",
            action: "Run Cuelinks Import",
            href: "/admin/import-queue",
            count: storesWithoutOffers,
        });
    }

    if (storesMissingDescription > 100) {
        tasks.push({
            level: "critical",
            title: `${storesMissingDescription.toLocaleString()} stores have no description`,
            reason: "Missing descriptions hurt SEO and prevent Google from indexing these pages properly.",
            action: "Fix Store Descriptions",
            href: "/admin/stores",
            count: storesMissingDescription,
        });
    }

    if (expiringCoupons > 0) {
        tasks.push({
            level: "high",
            title: `${expiringCoupons} coupons expire in 72 hours`,
            reason: "Expired coupons frustrate users and hurt trust scores. Refresh or remove them.",
            action: "Review Expiring",
            href: "/admin/coupons",
            count: expiringCoupons,
        });
    }

    if (totalClicks === 0) {
        tasks.push({
            level: "high",
            title: "Zero outbound clicks tracked",
            reason: "Click tracking is not firing. This means we have no revenue attribution data at all.",
            action: "Check Tracking",
            href: "/admin/business-metrics",
        });
    }

    if (recentCoupons === 0) {
        tasks.push({
            level: "high",
            title: "No new coupons in last 24 hours",
            reason: "Data pipeline may be stalled. Cuelinks refresh should run daily.",
            action: "Run Import",
            href: "/admin/import-queue",
        });
    }

    const critical = tasks.filter(t => t.level === "critical");
    const high = tasks.filter(t => t.level === "high");
    const medium = tasks.filter(t => t.level === "medium");

    return {
        activeCoupons,
        totalStores,
        storesWithOffers,
        storesWithoutOffers,
        storesMissingDescription,
        expiringCoupons,
        topStores,
        recentCoupons,
        totalClicks,
        connectorBreakdown,
        coverageScore,
        critical,
        high,
        medium,
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
    const d = await getDashboardData();

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div className="pt-2 max-w-[1600px] mx-auto space-y-8">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CouponHub Dashboard</h1>
                    <p className="text-gray-500 mt-1">{today}</p>
                </div>
                <Link
                    href="/admin/import-queue"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh Data
                </Link>
            </div>

            {/* ── KPI Strip ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                    label="Active Coupons"
                    value={d.activeCoupons.toLocaleString()}
                    sub={`${d.recentCoupons} added today`}
                    icon={<Tag className="w-5 h-5" />}
                    color="indigo"
                />
                <KpiCard
                    label="Active Stores"
                    value={d.totalStores.toLocaleString()}
                    sub={`${d.storesWithOffers} have live offers`}
                    icon={<Store className="w-5 h-5" />}
                    color="violet"
                />
                <KpiCard
                    label="Coverage"
                    value={`${d.coverageScore}%`}
                    sub={`${d.storesWithoutOffers.toLocaleString()} stores empty`}
                    icon={<BarChart3 className="w-5 h-5" />}
                    color={d.coverageScore < 30 ? "red" : d.coverageScore < 60 ? "orange" : "green"}
                />
                <KpiCard
                    label="Clicks Tracked"
                    value={d.totalClicks.toLocaleString()}
                    sub="outbound events"
                    icon={<Activity className="w-5 h-5" />}
                    color={d.totalClicks === 0 ? "red" : "green"}
                />
            </div>

            {/* ── Main Grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* LEFT: Action Queue */}
                <div className="xl:col-span-5 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        ACTION QUEUE
                    </h2>

                    {/* Critical */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Critical</h3>
                            {d.critical.length > 0 && (
                                <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{d.critical.length}</span>
                            )}
                        </div>
                        {d.critical.length === 0 ? (
                            <AllClearState label="No critical issues" />
                        ) : (
                            d.critical.map((t, i) => <TaskCard key={i} task={t} />)
                        )}
                    </div>

                    {/* High */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">High Priority</h3>
                            {d.high.length > 0 && (
                                <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{d.high.length}</span>
                            )}
                        </div>
                        {d.high.length === 0 ? (
                            <AllClearState label="No high-priority issues" />
                        ) : (
                            d.high.map((t, i) => <TaskCard key={i} task={t} />)
                        )}
                    </div>
                </div>

                {/* MIDDLE: Catalogue Health */}
                <div className="xl:col-span-4 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200 flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-500" />
                        CATALOGUE HEALTH
                    </h2>

                    {/* Coverage progress */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-semibold text-gray-700">Store Coverage</p>
                            <span className="text-2xl font-black text-gray-900">{d.coverageScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                            <div
                                className={`h-3 rounded-full transition-all ${d.coverageScore < 30 ? "bg-red-500" : d.coverageScore < 60 ? "bg-orange-400" : "bg-emerald-500"}`}
                                style={{ width: `${d.coverageScore}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                <p className="font-black text-emerald-700 text-xl">{d.storesWithOffers.toLocaleString()}</p>
                                <p className="text-emerald-600 font-medium mt-0.5">With offers</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                <p className="font-black text-red-600 text-xl">{d.storesWithoutOffers.toLocaleString()}</p>
                                <p className="text-red-500 font-medium mt-0.5">Empty pages</p>
                            </div>
                        </div>
                    </div>

                    {/* Data sources */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Coupon Sources</p>
                        <div className="space-y-2">
                            {d.connectorBreakdown.map((src: { connector: string | null; _count: { id: number } }) => (
                                <div key={src.connector || "unknown"} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 capitalize">{src.connector || "Unknown"}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-indigo-400"
                                                style={{ width: `${Math.min(100, (src._count.id / d.activeCoupons) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-10 text-right">{src._count.id.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "Add Coupons", href: "/admin/coupons", icon: <Tag className="w-4 h-4" /> },
                                { label: "Manage Stores", href: "/admin/stores", icon: <Store className="w-4 h-4" /> },
                                { label: "Import Queue", href: "/admin/import-queue", icon: <Package className="w-4 h-4" /> },
                                { label: "Business Metrics", href: "/admin/business-metrics", icon: <TrendingUp className="w-4 h-4" /> },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-medium text-gray-700 transition-colors border border-gray-100 hover:border-indigo-200"
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Top Stores */}
                <div className="xl:col-span-3 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 border-gray-200 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        TOP STORES
                    </h2>

                    <div className="space-y-2">
                        {d.topStores.map((store: { name: string; slug: string; activeOfferCount: number; logo: string | null }, i: number) => (
                            <Link
                                key={store.slug}
                                href={`/admin/stores`}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                            >
                                <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                                        {store.name}
                                    </p>
                                    <p className="text-xs text-gray-400">{store.slug}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-black text-gray-900">{store.activeOfferCount}</span>
                                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Missing content callout */}
                    {d.storesMissingDescription > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">
                                        {d.storesMissingDescription.toLocaleString()} stores need descriptions
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Missing meta descriptions reduce Google indexability.
                                    </p>
                                    <Link
                                        href="/admin/stores"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 mt-2 transition-colors"
                                    >
                                        Fix now <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
    label, value, sub, icon, color
}: {
    label: string; value: string; sub: string;
    icon: React.ReactNode;
    color: "indigo" | "violet" | "green" | "red" | "orange";
}) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        violet: "bg-violet-50 text-violet-600 border-violet-100",
        green: "bg-emerald-50 text-emerald-600 border-emerald-100",
        red: "bg-red-50 text-red-600 border-red-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
    };
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-3 ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
            <p className="text-sm font-medium text-gray-500 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
    );
}

function TaskCard({ task }: {
    task: {
        level: "critical" | "high" | "medium";
        title: string; reason: string; action: string; href: string; count?: number;
    }
}) {
    const styles = {
        critical: "border-red-200 bg-red-50",
        high: "border-orange-200 bg-orange-50",
        medium: "border-blue-200 bg-blue-50",
    };
    const btnStyles = {
        critical: "bg-red-600 hover:bg-red-700 text-white",
        high: "bg-orange-500 hover:bg-orange-600 text-white",
        medium: "bg-blue-600 hover:bg-blue-700 text-white",
    };

    return (
        <div className={`p-4 rounded-xl border ${styles[task.level]} transition-colors`}>
            <div className="flex justify-between items-start mb-1.5">
                <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2">{task.title}</h3>
                {task.count && (
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 flex-shrink-0">
                        {task.count.toLocaleString()}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{task.reason}</p>
            <Link
                href={task.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${btnStyles[task.level]}`}
            >
                <CheckCircle className="w-3.5 h-3.5" />
                {task.action}
                <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}

function AllClearState({ label }: { label: string }) {
    return (
        <div className="p-5 border border-dashed border-gray-200 rounded-xl flex items-center gap-3">
            <CircleCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}
