
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";


// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function BannersPage() {
    const banners = await prisma.banner.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
                <Link
                    href="/admin/banners/new"
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New Banner
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Image</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Title/Link</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Order</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {banners.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No banners found. Create one to display on the homepage.
                                </td>
                            </tr>
                        ) : (
                            banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-32 h-16 relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title || "Banner"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{banner.title || "(No Title)"}</div>
                                        <a href={banner.link} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                            {banner.link} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 text-sm">
                                            {banner.order}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${banner.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {banner.isActive ? "Active" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/banners/${banner.id}`}
                                                className="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            {/* Delete functionality would likely be client-side interaction or server action button */}
                                            {/* For simplicity in this list view, assuming Edit page handles delete or separate component */}
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
