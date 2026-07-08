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
    { href: "/admin/connector-benchmarks", label: "Connector Benchmarks", icon: LayoutDashboard },
    { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    { href: "/admin/bulk-upload", label: "Bulk Upload", icon: Upload },
    { href: "/admin/images", label: "Images", icon: Image },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800/50">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/20 group-hover:shadow-violet-600/40 transition-shadow">
                        <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">CouponHub</h1>
                        <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-white font-medium shadow-sm border border-violet-500/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-white"}`} />
                            <span className={isActive ? "text-violet-100" : ""}>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-violet-400 font-bold shadow-sm">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">{user.name || "Admin"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                </div>
                <form action="/api/admin/logout" method="POST">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
