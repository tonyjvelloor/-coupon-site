import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import {
    Shirt,
    Smartphone,
    UtensilsCrossed,
    Plane,
    Heart,
    Home,
    Film,
    Dumbbell,
    ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
    title: "All Categories - Coupons & Offers",
    description:
        "Browse all categories and find the best coupons, promo codes, and deals in fashion, electronics, travel, food, and more.",
};

const iconMap: Record<string, React.ElementType> = {
    Shirt,
    Smartphone,
    UtensilsCrossed,
    Plane,
    Heart,
    Home,
    Film,
    Dumbbell,
};

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { displayOrder: "asc" },
        include: {
            children: { where: { isActive: true } },
            _count: { select: { coupons: true, storeCategories: true } },
        },
    });

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-violet-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">All Categories</h1>
                    <p className="text-violet-200 text-lg max-w-2xl">
                        Explore coupons and deals across all categories. Find the best offers
                        for fashion, electronics, travel, food, and more.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const IconComponent = iconMap[category.icon || "Shirt"] || Shirt;
                        return (
                            <div
                                key={category.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="p-6 flex items-start gap-4"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                                        <IconComponent className="w-7 h-7 text-violet-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            {category.name}
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {category._count.storeCategories} stores •{" "}
                                            {category._count.coupons} coupons
                                        </p>
                                    </div>
                                </Link>
                                {category.children.length > 0 && (
                                    <div className="px-6 pb-4 flex flex-wrap gap-2">
                                        {category.children.slice(0, 4).map((child) => (
                                            <Link
                                                key={child.id}
                                                href={`/category/${child.slug}`}
                                                className="text-sm text-gray-600 hover:text-violet-600 transition-colors"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                        {category.children.length > 4 && (
                                            <span className="text-sm text-gray-400">
                                                +{category.children.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
