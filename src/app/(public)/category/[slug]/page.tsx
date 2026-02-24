import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Tag } from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";
import StoreCard from "@/components/ui/StoreCard";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
    });

    if (!category) return { title: "Category Not Found" };

    return {
        title: `${category.name} Coupons & Offers`,
        description:
            category.description ||
            `Get the best ${category.name.toLowerCase()} coupons, promo codes, and deals from top stores. Save big with verified offers.`,
        alternates: {
            canonical: `https://couponhub.store/category/${category.slug}`,
        }
    };
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
        include: {
            children: { where: { isActive: true } },
            storeCategories: {
                include: {
                    store: {
                        include: {
                            _count: { select: { coupons: true } },
                        },
                    },
                },
            },
            coupons: {
                include: { store: true },
                orderBy: { createdAt: "desc" },
                take: 12,
            },
        },
    });

    if (!category) {
        notFound();
    }

    const stores = category.storeCategories.map((sc) => ({
        ...sc.store,
        offerCount: sc.store._count.coupons,
    }));

    return (
        <div>
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-violet-600">
                            <Home className="w-4 h-4" />
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link href="/categories" className="text-gray-500 hover:text-violet-600">
                            Categories
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            {/* Category Header */}
            <section className="bg-gradient-to-br from-violet-600 to-purple-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                            <Tag className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold">
                            {category.name} Coupons & Offers
                        </h1>
                    </div>
                    <p className="text-violet-200 text-lg max-w-2xl">
                        {category.description ||
                            `Get the best deals and coupons for ${category.name.toLowerCase()} from top stores.`}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Subcategories */}
                {category.children.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Subcategories
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {category.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/category/${child.slug}`}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-violet-300 hover:text-violet-600 transition-colors"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stores in Category */}
                {stores.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Top {category.name} Stores
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {stores.slice(0, 6).map((store) => (
                                <StoreCard key={store.id} store={store} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Coupons */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Latest {category.name} Coupons
                    </h2>
                    {category.coupons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.coupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    coupon={coupon}
                                    storeName={coupon.store.name}
                                    storeLogo={coupon.store.logo}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                                No coupons available in this category right now.
                            </p>
                            <Link href="/stores" className="text-violet-600 hover:underline mt-2 inline-block">
                                Browse all stores
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <CategorySchema category={category} coupons={category.coupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Category
function CategorySchema({ category, coupons }: { category: any, coupons: any }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} Coupons`,
        description: category.description || `Best coupons and offers for ${category.name}`,
        url: `https://couponhub.store/category/${category.slug}`,
        hasPart: coupons.slice(0, 10).map((coupon: any) => ({
            "@type": "Offer",
            itemOffered: {
                "@type": "Service",
                name: coupon.title
            },
            priceCurrency: "USD",
            price: "0",
            description: coupon.description || coupon.title,
            seller: {
                "@type": "Organization",
                name: coupon.store.name,
                image: coupon.store.logo
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
