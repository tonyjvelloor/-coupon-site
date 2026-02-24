import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
            _count: {
                select: { coupons: true, storeCategories: true }
            }
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage product categories and hierarchy</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5 inline-block mr-2" />
                    New Category
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Slug</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Order</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Stats</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No categories found. Create one to organize coupons.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-violet-50 flex items-center justify-center text-violet-600">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                                    <td className="px-6 py-4 text-gray-900">{category.displayOrder}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {category._count.coupons} coupons • {category._count.storeCategories} stores
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="inline-flex p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
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
