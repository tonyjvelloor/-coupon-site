import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, Ticket, ExternalLink } from "lucide-react";

export default async function CouponsPage() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
        include: { store: true },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
                    <p className="text-gray-600 mt-1">Manage your coupons and deals</p>
                </div>
                <Link href="/admin/coupons/new" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Coupon
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Coupon</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Store</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Code</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No coupons yet. Add your first coupon!
                                </td>
                            </tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                                <Ticket className="w-5 h-5 text-violet-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">{coupon.title}</p>
                                                <p className="text-sm text-gray-500">{coupon.discountValue}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-700">{coupon.store.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.code ? (
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                                {coupon.code}
                                            </code>
                                        ) : (
                                            <span className="text-gray-400">Deal</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${coupon.type === "coupon" ? "badge-verified" : "badge-success"}`}>
                                            {coupon.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {coupon.isVerified && (
                                                <span className="badge badge-verified text-xs">Verified</span>
                                            )}
                                            {coupon.isFeatured && (
                                                <span className="badge badge-exclusive text-xs">Featured</span>
                                            )}
                                            {coupon.isExclusive && (
                                                <span className="badge bg-amber-100 text-amber-700 text-xs">Exclusive</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/coupons/${coupon.id}`}
                                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-violet-600 font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <a
                                                href={coupon.affiliateUrl}
                                                target="_blank"
                                                className="p-1.5 text-gray-400 hover:text-violet-600"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
