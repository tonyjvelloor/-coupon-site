import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Store as StoreIcon,
    ExternalLink,
    ChevronRight,
    Home,
} from "lucide-react";
import CouponCard from "@/components/ui/CouponCard";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
    });

    if (!store) return { title: "Store Not Found" };

    return {
        title: store.seoTitle || `${store.name} Coupons & Promo Codes`,
        description:
            store.seoDescription ||
            `Get the latest ${store.name} coupons, promo codes, and deals. Save up to ${store.cashbackRate || "80%"} with verified offers.`,
        alternates: {
            canonical: `https://couponhub.store/stores/${store.slug}`,
        }
    };
}

export default async function StorePage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: {
            coupons: {
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            },
            storeCategories: {
                include: { category: true },
            },
        },
    });

    if (!store) {
        notFound();
    }

    const couponCodes = store.coupons.filter((c) => c.type === "coupon");
    const deals = store.coupons.filter((c) => c.type === "deal");

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
                        <Link href="/stores" className="text-gray-500 hover:text-violet-600">
                            Stores
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{store.name}</span>
                    </nav>
                </div>
            </div>

            {/* Store Header */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                            {store.logo ? (
                                <img
                                    src={store.logo}
                                    alt={store.name}
                                    className="w-20 h-20 object-contain"
                                />
                            ) : (
                                <StoreIcon className="w-12 h-12 text-gray-400" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {store.name} Coupons & Promo Codes
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {store.description ||
                                    `Get the best ${store.name} coupons and deals with verified offers.`}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                {store.cashbackRate && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {store.cashbackRate} Cashback
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                                    {store.coupons.length} Offers
                                </span>
                                {store.storeCategories.map((sc) => (
                                    <Link
                                        key={sc.id}
                                        href={`/category/${sc.category.slug}`}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-violet-100 hover:text-violet-600 transition-colors"
                                    >
                                        {sc.category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div>
                            <a
                                href={store.affiliateUrl || store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                Visit Store
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs and Coupons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tab Navigation */}
                        <div className="flex gap-4 border-b border-gray-200 mb-6">
                            <button className="px-4 py-3 font-medium text-violet-600 border-b-2 border-violet-600">
                                All ({store.coupons.length})
                            </button>
                            <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                                Coupons ({couponCodes.length})
                            </button>
                            <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                                Deals ({deals.length})
                            </button>
                        </div>

                        {/* Coupons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {store.coupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    coupon={coupon}
                                    storeName={store.name}
                                    storeLogo={store.logo}
                                />
                            ))}
                        </div>

                        {store.coupons.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">
                                    No coupons available for this store right now.
                                </p>
                            </div>
                        )}

                        {/* About Store (SEO Content) */}
                        {store.aboutContent && (
                            <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    About {store.name}
                                </h2>
                                <div className="prose prose-gray max-w-none">
                                    {store.aboutContent}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Store Info Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Store Info</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Website</dt>
                                        <dd>
                                            <a
                                                href={store.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:underline"
                                            >
                                                Visit
                                            </a>
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Total Offers</dt>
                                        <dd className="font-medium">{store.coupons.length}</dd>
                                    </div>
                                    {store.cashbackRate && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Cashback</dt>
                                            <dd className="font-medium text-green-600">
                                                {store.cashbackRate}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* How to Use */}
                            <div className="bg-violet-50 rounded-xl p-5">
                                <h3 className="font-semibold text-violet-900 mb-3">
                                    How to Use Coupons
                                </h3>
                                <ol className="space-y-2 text-sm text-violet-800">
                                    <li className="flex gap-2">
                                        <span className="font-bold">1.</span>
                                        <span>Click on &quot;Show Coupon Code&quot; or &quot;Get Deal&quot;</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">2.</span>
                                        <span>Copy the code (if applicable)</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">3.</span>
                                        <span>Paste at checkout on {store.name}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">4.</span>
                                        <span>Enjoy your savings!</span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <StoreSchema store={store} coupons={store.coupons} />
        </div>
    );
}

// Helper to generate JSON-LD for Store
function StoreSchema({ store, coupons }: { store: any, coupons: any }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Store",
        name: store.name,
        image: store.logo,
        description: store.description,
        url: store.website,
        sameAs: store.affiliateUrl ? [store.affiliateUrl] : [],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${store.name} Offers`,
            itemListElement: coupons.slice(0, 10).map((coupon: any, index: number) => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: coupon.title
                },
                priceCurrency: "USD",
                price: "0",
                description: coupon.description || coupon.title,
                url: `https://couponhub.store/stores/${store.slug}`,
                validFrom: coupon.createdAt.toISOString()
            }))
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
