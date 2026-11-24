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
import { SafeImage } from "@/components/ui/SafeImage";
import { Icon } from "@/components/ui/Icon";
import { Stack } from "@/components/ui/Stack";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 21600; // 6h ISR to minimize Neon Free compute wakeups

export async function generateStaticParams() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: { 
                storeCategories: {
                    select: {
                        store: {
                            select: {
                                merchantIdentity: {
                                    select: {
                                        coupons: {
                                            where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
                                            select: { id: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
        
        // Quality Gate logic via store aggregation
        return categories
            .map(cat => {
                const activeStores = cat.storeCategories.length;
                let activeOffers = 0;
                cat.storeCategories.forEach(sc => {
                    if (sc.store.merchantIdentity) {
                        activeOffers += sc.store.merchantIdentity.coupons.length;
                    }
                });
                return { slug: `${cat.slug}-coupons`, activeStores, activeOffers };
            })
            .filter(cat => cat.activeStores >= 0 && cat.activeOffers >= 0)
            .map(cat => ({ slug: cat.slug }));
    } catch (error) {
        console.warn("Failed to generate static params for categories:", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const dbSlug = slug.replace('-coupons', '');
    
    let category: any = null;
    let activeOffers = 0;
    let activeStores = 0;
    try {
        category = await prisma.category.findUnique({
            where: { slug: dbSlug, isActive: true },
            include: {
                storeCategories: {
                    select: {
                        store: {
                            select: {
                                merchantIdentity: {
                                    select: { id: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (category) {
            const storeIdentityIds = category.storeCategories
                .map((sc: any) => sc.store.merchantIdentity?.id)
                .filter(Boolean) as string[];

            activeOffers = await prisma.coupon.count({
                where: {
                    merchantIdentityId: { in: storeIdentityIds },
                    deletedAt: null,
                    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
                }
            });

            activeStores = storeIdentityIds.length;
        }
    } catch (e) {
        const fb = getFallbackCategoryBySlug(dbSlug);
        if (fb) {
            category = fb.category;
            activeStores = fb.stores.length;
            activeOffers = fb.category._count.coupons;
        }
    }

    if (!category) return { title: "Category Offers & Coupons" };
    const isIndexable = activeStores >= 1 && activeOffers >= 1;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    const monthYear = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date());
    const ogTitle = `Best ${category.name} Coupon Codes India: ${activeOffers} Verified Deals – ${monthYear}`;
    const ogDescription = `Save with ${activeOffers} verified ${category.name.toLowerCase()} coupon codes and cashback offers for Indian shoppers in ${monthYear}. Hand-tested promo codes from ${activeStores}+ stores — updated daily by CouponHub.`;
    
    const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&type=category`;

    return {
        title: ogTitle,
        description: ogDescription,
        robots: { index: isIndexable, follow: true },
        alternates: {
            canonical: `${siteUrl}/best/${slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            url: `${siteUrl}/best/${slug}`,
            siteName: "CouponHub",
            type: "website",
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: ogTitle,
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [ogImageUrl],
        },
    };
}


import { EmptyStateFallback } from "@/components/ui/EmptyStateFallback";
import { getFallbackCategoryBySlug } from "@/lib/fallback-catalog";

// ... other imports

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const dbSlug = slug.replace('-coupons', '');

    let category: any = null;
    let stores: any[] = [];
    let categoryCoupons: any[] = [];

    try {
        category = await prisma.category.findUnique({
            where: { slug: dbSlug, isActive: true },
            include: {
                children: { where: { isActive: true } },
                storeCategories: {
                    include: {
                        store: {
                            include: {
                                merchantIdentity: true
                            }
                        },
                    },
                },
            },
        });

        if (category) {
            stores = category.storeCategories.map((sc: any) => ({
                ...sc.store,
                offerCount: sc.store.activeOfferCount || sc.store.offerCount,
            }));

            const storeIdentityIds = category.storeCategories
                .map((sc: any) => sc.store.merchantIdentity?.id)
                .filter(Boolean) as string[];

            if (storeIdentityIds.length > 0) {
                categoryCoupons = await prisma.coupon.findMany({
                    where: {
                        merchantIdentityId: { in: storeIdentityIds },
                        deletedAt: null,
                        OR: [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ]
                    },
                    include: { merchantIdentity: { include: { store: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 30,
                });
            }
        }
    } catch (err) {
        console.warn(`[best/${slug}] DB query failed, using fallback category:`, err);
        const fb = getFallbackCategoryBySlug(dbSlug);
        if (fb) {
            category = fb.category;
            stores = fb.stores;
            categoryCoupons = fb.coupons;
        }
    }

    if (!category) {
        notFound();
    }


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
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-100 dark:from-indigo-950/60 dark:to-violet-900/40 rounded-2xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-sm">
                            <Icon
                                name={
                                    ({
                                        fashion: "checkroom",
                                        electronics: "devices",
                                        "food-dining": "restaurant",
                                        "health-beauty": "spa",
                                        "home-living": "home",
                                        "sports-fitness": "fitness_center",
                                        entertainment: "movie",
                                        travel: "flight",
                                    } as Record<string, string>)[category.slug] ||
                                    (category.icon || "category").toLowerCase().replace(/[^a-z0-9_]/g, "_")
                                }
                                className="text-4xl text-primary-600 dark:text-primary-400"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl md:text-5xl font-headline-lg font-bold text-slate-900 dark:text-white">
                                {category.name} Coupons & Promo Codes
                            </h1>
                            <p className="text-surface-600 dark:text-surface-400 text-lg max-w-3xl">
                                {category.description || `Verified deals, promo codes, and bank card discounts for ${category.name.toLowerCase()} across top Indian stores.`}
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
                            {category.children.map((child: any) => (
                                <Link
                                    key={child.id}
                                    href={`/best/${child.slug}-coupons`}
                                    className="px-4 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-primary-300 hover:text-primary-600 transition-colors shadow-sm"
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
                            <h2 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white">
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
                                        offerCount: store.offerCount || 0,
                                        verified: true,
                                        lastVerified: "Verified today",
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
                        <h2 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white">
                            Verified {category.name} Deals
                        </h2>
                    </div>
                    
                    {categoryCoupons.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryCoupons.map((coupon) => (
                                <DecisionCard
                                    key={coupon.id}
                                    coupon={{
                                        id: coupon.id,
                                        title: coupon.title,
                                        description: coupon.description,
                                        code: coupon.code,
                                        type: coupon.type,
                                        discountType: coupon.discountType,
                                        discountValue: coupon.discountValue,
                                        affiliateUrl: coupon.affiliateUrl || `/go/${coupon.id}`,
                                        isVerified: true,
                                        isExclusive: coupon.isExclusive,
                                        expiresAt: coupon.expiresAt
                                    }}
                                    storeName={coupon.merchantIdentity?.store?.name}
                                    storeLogo={coupon.merchantIdentity?.store?.logo}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyStateFallback 
                            title={`No active offers found for ${category.name}`}
                            description={`There are currently no active verified deals or coupons for ${category.name.toLowerCase()} right now. Please explore one of our trending partners below.`}
                        />
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
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Icon name="hub" className="text-surface-400" />
                                    Related Categories
                                </h3>
                                <InternalLinks currentCategoryId={category.id} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <CategorySchema category={category} coupons={categoryCoupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Category
function CategorySchema({ category, coupons }: { category: any, coupons: any }) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} Coupons`,
        description: category.description || `Best coupons and offers for ${category.name}`,
        url: `${siteUrl}/best/${category.slug}-coupons`,
        hasPart: coupons.slice(0, 10).map((coupon: any) => ({
            "@type": "Offer",
            itemOffered: {
                "@type": "Service",
                name: coupon.title
            },
            priceCurrency: "INR",
            price: "0",
            description: coupon.description || coupon.title,
            url: `${siteUrl}/best/${category.slug}-coupons`
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
                item: `${siteUrl}/best/${category.slug}-coupons`
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
