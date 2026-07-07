import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Tag } from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";
import StoreCard from "@/components/ui/StoreCard";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import InternalLinks from "@/components/ui/InternalLinks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return categories.map((cat) => ({
            slug: cat.slug,
        }));
    } catch (error) {
        console.warn("Failed to generate static params for categories:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug, isActive: true },
    });

    if (!category) return { title: "Category Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    const ogTitle = `${category.name} Coupons & Offers`;
    const ogDescription = category.description || `Get the best ${category.name.toLowerCase()} coupons, promo codes, and deals from top stores. Save big with verified offers.`;

    return {
        title: ogTitle,
        description: ogDescription,
        alternates: {
            canonical: `${siteUrl}/category/${category.slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: `${siteUrl}/api/og?title=${encodeURIComponent(category.name + ' Coupons')}&description=${encodeURIComponent('Save big with ' + category.name.toLowerCase() + ' deals')}&type=category`,
                    width: 1200,
                    height: 630,
                    alt: `${category.name} Coupons`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            images: [`${siteUrl}/api/og?title=${encodeURIComponent(category.name + ' Coupons')}&description=${encodeURIComponent('Save big with ' + category.name.toLowerCase() + ' deals')}&type=category`],
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
            <Breadcrumbs items={[
                { name: "Categories", href: "/categories" },
                { name: category.name }
            ]} />

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

                    {/* SEO Text & FAQ */}
                    <SEOTextAndFAQ
                        title={category.name}
                        aboutContent={category.aboutContent}
                        faqContent={category.faqContent}
                    />

                    {/* Internal Links Engine */}
                    <div className="mt-12">
                        <InternalLinks currentCategoryId={category.id} />
                    </div>
                </div>
            </div>
            <CategorySchema category={category} coupons={category.coupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Category
function CategorySchema({ category, coupons }: { category: any, coupons: any }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} Coupons`,
        description: category.description || `Best coupons and offers for ${category.name}`,
        url: `${siteUrl}/category/${category.slug}`,
        hasPart: coupons.slice(0, 10).map((coupon: any) => ({
            "@type": "Offer",
            itemOffered: {
                "@type": "Service",
                name: coupon.title
            },
            priceCurrency: "USD",
            price: "0",
            description: coupon.description || coupon.title,
            url: `${siteUrl}/category/${category.slug}`
        }))
    };

    let faqSchema = null;
    if (category.faqContent) {
        try {
            const faqs = JSON.parse(category.faqContent);
            if (Array.isArray(faqs) && faqs.length > 0) {
                faqSchema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map((faq: any) => ({
                        "@type": "Question",
                        name: faq.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: faq.answer
                        }
                    }))
                };
            }
        } catch (e) {
            // ignore JSON parse errors
        }
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Categories",
                item: `${siteUrl}/categories`
            },
            {
                "@type": "ListItem",
                position: 3,
                name: category.name,
                item: `${siteUrl}/category/${category.slug}`
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
        </>
    );
}
