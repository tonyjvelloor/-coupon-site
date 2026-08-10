"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Store,
    Tag,
    Ticket,
    Settings,
    LogOut,
    Image,
    Upload,
    Megaphone,
    Link2,
    FileText,
    Mail,
    Newspaper,
    BrainCircuit,
    Scale,
    LineChart,
    Activity,
} from "lucide-react";

interface AdminSidebarProps {
    user: { id: string; email: string; name: string | null };
}

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/stores", label: "Stores", icon: Store },
    { href: "/admin/merchant-ops", label: "Merchant Ops", icon: Activity },
    { href: "/admin/merchant-knowledge", label: "Knowledge Engine", icon: BrainCircuit },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/banners", label: "Banners", icon: Megaphone },
    { href: "/admin/campaign-links", label: "Campaign Links", icon: Link2 },
    { href: "/admin/posts", label: "AI Blog", icon: FileText },
    { href: "/admin/news", label: "Viral News", icon: Newspaper },
    { href: "/admin/import-queue", label: "Review Queue", icon: FileText },
    { href: "/admin/resolver-metrics", label: "Resolver Metrics", icon: Scale },
    { href: "/admin/business-metrics", label: "Business Metrics", icon: LineChart },
    { href: "/admin/connector-benchmarks", label: "Benchmarks", icon: LayoutDashboard },
    { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    { href: "/admin/bulk-upload", label: "Bulk Upload", icon: Upload },
    { href: "/admin/images", label: "Images", icon: Image },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-w-[256px] shrink-0 bg-slate-900 border-r border-slate-800 text-white flex flex-col h-screen sticky top-0 overflow-hidden">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-800/50 shrink-0">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/20 group-hover:shadow-violet-600/40 transition-shadow shrink-0">
                        <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-base tracking-tight truncate">CouponHub</h1>
                        <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden space-y-0.5">
                {menuItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group w-full ${
                                isActive
                                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white font-medium border border-violet-500/20"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                            }`}
                        >
                            <Icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                    isActive ? "text-violet-400" : "text-slate-500 group-hover:text-white"
                                }`}
                            />
                            <span className="text-sm truncate flex-1 min-w-0">
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="px-3 py-3 border-t border-slate-800/50 shrink-0">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs text-white truncate">{user.name || "Admin"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
                <form action="/api/admin/logout" method="POST">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-xs font-medium"
                    >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
