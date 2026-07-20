import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";
import { AdBannerSidebar } from "@/components/ui/AdBanner";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import InternalLinks from "@/components/ui/InternalLinks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const revalidate = 900; // 15 minutes ISR

interface PageProps {
    params: Promise<{ slug: string }>;
}


export async function generateStaticParams() {
    try {
        const collections = await prisma.collection.findMany({
            select: { slug: true },
        });
        return collections.map((collection) => ({
            slug: collection.slug,
        }));
    } catch (error) {
        console.warn("Failed to generate static params for collections:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const collection = await prisma.collection.findUnique({
        where: { slug },
    });

    if (!collection) return { title: "Collection Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const ogTitle = collection.seoTitle || `${collection.name} Coupons & Offers`;
    const ogDescription = collection.seoDescription || `Discover the best ${collection.name} coupons and deals today.`;

    return {
        title: ogTitle,
        description: ogDescription,
        alternates: {
            canonical: `${siteUrl}/offers/${collection.slug}`,
        },
        robots: {
            index: collection.isIndexable,
            follow: true,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: `${siteUrl}/api/og?title=${encodeURIComponent(collection.name)}&description=${encodeURIComponent(ogDescription.substring(0, 100))}&type=${collection.type}`,
                    width: 1200,
                    height: 630,
                    alt: collection.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [`${siteUrl}/api/og?title=${encodeURIComponent(collection.name)}&description=${encodeURIComponent(ogDescription.substring(0, 100))}&type=${collection.type}`],
        },
    };
}

export default async function CollectionPage({ params }: PageProps) {
    const { slug } = await params;

    const collection = await prisma.collection.findUnique({
        where: { slug },
        include: {
            coupons: {
                where: {
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } }
                    ]
                },
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
                include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } },
            },
        },
    });

    if (!collection) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    // Collection JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collection.name,
        description: collection.seoDescription || collection.content || "",
        url: `${siteUrl}/offers/${collection.slug}`,
        mainEntity: {
            "@type": "OfferCatalog",
            name: `${collection.name} Offers`,
            itemListElement: collection.coupons.slice(0, 20).map((coupon, index) => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: coupon.title,
                },
                priceCurrency: "USD",
                price: "0",
                description: coupon.description || coupon.title,
                url: `${siteUrl}/offers/${collection.slug}`,
                validFrom: coupon.createdAt.toISOString(),
            })),
        },
    };

    return (
        <div>
            <Breadcrumbs items={[
                { name: "Offers", href: "/offers" },
                { name: collection.name }
            ]} />

            {/* Collection Header */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {collection.name}
                    </h1>
                    {collection.content && (
                        <p className="text-lg text-gray-600 max-w-3xl">
                            {collection.content}
                        </p>
                    )}
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium uppercase tracking-wide">
                            {collection.type}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {collection.coupons.length} Active Offers
                        </span>
                    </div>
                </div>
            </section>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Coupons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {collection.coupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    coupon={coupon}
                                    storeName={coupon.store?.name}
                                    storeLogo={coupon.store?.logo}
                                />
                            ))}
                        </div>

                        {collection.coupons.length === 0 && (
                            <div className="text-center py-16 bg-gray-50 rounded-xl mt-6 border border-dashed border-gray-300">
                                <h3 className="text-lg font-medium text-gray-900">No active offers</h3>
                                <p className="text-gray-500 mt-2">
                                    Check back soon for more {collection.name} coupons and deals.
                                </p>
                            </div>
                        )}

                        {/* SEO Text & FAQ */}
                        <SEOTextAndFAQ
                            title={collection.name}
                            aboutContent={null}
                            faqContent={collection.faqContent}
                        />

                        {/* Internal Links System */}
                        <div className="mt-12">
                            <InternalLinks currentCollectionId={collection.id} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <AdBannerSidebar />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Inject Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Inject Breadcrumbs Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": siteUrl
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Offers",
                                "item": `${siteUrl}/offers`
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": collection.name,
                                "item": `${siteUrl}/offers/${collection.slug}`
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
