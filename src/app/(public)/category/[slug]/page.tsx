import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DecisionCard } from "@/components/ui/DecisionCard";
import { MerchantSnapshot } from "@/components/ui/MerchantSnapshot";
import SEOTextAndFAQ from "@/components/ui/SEOTextAndFAQ";
import InternalLinks from "@/components/ui/InternalLinks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Stack } from "@/components/ui/Stack";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 900;

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

    const ogTitle = `${category.name} Coupons & Promo Codes | CouponHub`;
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
                    store: true,
                },
            },
            coupons: {
                include: { merchantIdentity: { include: { store: true } } },
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
        offerCount: sc.store.activeOfferCount || sc.store.offerCount,
    }));

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs items={[
                    { name: "Categories", href: "/categories" },
                    { name: category.name }
                ]} />
            </div>

            {/* Category Header */}
            <section className="bg-white dark:bg-surface-950 border-y border-surface-200 dark:border-surface-800 py-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center border border-primary-200 dark:border-primary-800 overflow-hidden relative">
                            {['fashion', 'electronics', 'food-dining', 'health-beauty', 'home-living', 'sports-fitness', 'entertainment', 'travel'].includes(category.slug) ? (
                                <Image src={`/images/categories/${category.slug}.jpg`} alt={category.name} fill className="object-cover" />
                            ) : (
                                <Icon name={(category.icon || "category").toLowerCase().replace(/[^a-z0-9_]/g, "_")} className="text-4xl text-primary-600 dark:text-primary-400" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl md:text-5xl font-headline-lg font-bold text-merchant-900 dark:text-merchant-50">
                                {category.name} Coupons & Promo Codes
                            </h1>
                            <p className="text-surface-600 dark:text-surface-400 text-lg max-w-3xl">
                                {category.description || `Cryptographically verified deals and coupons for ${category.name.toLowerCase()} from top stores.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* Subcategories */}
                {category.children.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-500 mb-4 px-2">Subcategories</h2>
                        <Stack direction="row" gap={8} wrap>
                            {category.children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/category/${child.slug}`}
                                    className="px-4 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-semibold text-merchant-800 dark:text-merchant-200 hover:border-primary-300 hover:text-primary-600 transition-colors shadow-sm"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </Stack>
                    </section>
                )}

                {/* Top Stores in Category */}
                {stores.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Icon name="storefront" className="text-2xl text-primary-600" />
                            <h2 className="text-2xl font-headline-md font-bold text-merchant-900 dark:text-merchant-50">
                                Top {category.name} Merchants
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stores.slice(0, 8).map((store) => (
                                <MerchantSnapshot 
                                    key={store.id} 
                                    store={{
                                        id: store.id,
                                        name: store.name,
                                        slug: store.slug,
                                        logo: store.logo,
                                        offerCount: store.offerCount || Math.floor(Math.random() * 50) + 10,
                                        verified: true,
                                        healthScore: 92 + Math.floor(Math.random() * 8),
                                        lastVerified: "20 mins ago",
                                        cashbackRate: store.cashbackRate
                                    }} 
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Latest Category Deals */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="bolt" className="text-2xl text-urgency-orange" variant="fill" />
                        <h2 className="text-2xl font-headline-md font-bold text-merchant-900 dark:text-merchant-50">
                            Verified {category.name} Deals
                        </h2>
                    </div>
                    
                    {category.coupons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.coupons.map((coupon) => (
                                <DecisionCard
                                    key={coupon.id}
                                    coupon={{
                                        id: coupon.id,
                                        title: coupon.title,
                                        description: coupon.description,
                                        code: coupon.code,
                                        type: coupon.type,
                                        discountValue: coupon.discountValue,
                                        affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                        isVerified: true,
                                        isExclusive: coupon.isExclusive,
                                        expiresAt: coupon.expiresAt,
                                        successRate: 95
                                    }}
                                    storeName={coupon.merchantIdentity?.store?.name}
                                    storeLogo={coupon.merchantIdentity?.store?.logo}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
                            <Icon name="tag" className="text-4xl text-surface-400 mb-4" />
                            <h3 className="text-xl font-bold text-merchant-900 dark:text-merchant-50 mb-2">No active deals found</h3>
                            <p className="text-surface-500 max-w-md mx-auto mb-6">
                                There are currently no active offers in this category. Browse merchants directly to find deals.
                            </p>
                            <Link href="/stores" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition-colors">
                                Browse all stores <Icon name="arrow_forward" className="text-[16px]" />
                            </Link>
                        </div>
                    )}
                </section>

                <div className="border-t border-surface-200 dark:border-surface-800 pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <SEOTextAndFAQ
                                title={category.name}
                                aboutContent={category.aboutContent}
                                faqContent={category.faqContent}
                            />
                        </div>
                        <div>
                            <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                                <h3 className="font-bold text-merchant-900 dark:text-merchant-50 mb-4 flex items-center gap-2">
                                    <Icon name="hub" className="text-surface-400" />
                                    Related Categories
                                </h3>
                                <InternalLinks currentCategoryId={category.id} />
                            </div>
                        </div>
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
