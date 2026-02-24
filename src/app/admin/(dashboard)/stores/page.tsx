import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, Store as StoreIcon, ExternalLink } from "lucide-react";

export default async function StoresPage() {
    const stores = await prisma.store.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { coupons: true } },
            storeCategories: { include: { category: true } },
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
                    <p className="text-gray-600 mt-1">Manage your affiliate stores</p>
                </div>
                <Link href="/admin/stores/new" className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Store
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stores..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No stores yet. Add your first store!
                    </div>
                ) : (
                    stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                    {store.logo ? (
                                        <img
                                            src={store.logo}
                                            alt={store.name}
                                            className="w-12 h-12 object-contain"
                                        />
                                    ) : (
                                        <StoreIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {store.isFeatured && (
                                        <span className="badge badge-exclusive text-xs">Featured</span>
                                    )}
                                    {!store.isActive && (
                                        <span className="badge bg-gray-100 text-gray-600">Inactive</span>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {store.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {store.description || "No description"}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                <span>{store._count.coupons} coupons</span>
                                {store.cashbackRate && (
                                    <span className="text-green-600 font-medium">
                                        {store.cashbackRate}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/admin/stores/${store.id}`}
                                    className="flex-1 text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={`/stores/${store.slug}`}
                                    target="_blank"
                                    className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
