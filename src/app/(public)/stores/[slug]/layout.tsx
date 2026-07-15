import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Store as StoreIcon,
    ExternalLink,
    Truck,
    RefreshCw,
    CreditCard,
    GraduationCap,
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MerchantNav from "@/components/ui/MerchantNav";
import TrendingWidget from "@/components/ui/TrendingWidget";
import { AdBannerSidebar } from "@/components/ui/AdBanner";

interface LayoutProps {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}

export default async function StoreLayout({ params, children }: LayoutProps) {
    const { slug } = await params;
    
    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: {
            storeCategories: { include: { category: true } },
            storeContents: true,
        }
    });

    if (!store) {
        notFound();
    }

    const hasFaq = store.storeContents.some(c => c.type === 'FAQ');
    const hasGuide = store.storeContents.some(c => c.type === 'BUYING_GUIDE');

    const shippingInfo = store.storeContents.find(c => c.type === 'SHIPPING')?.content || null;
    const returnPolicy = store.storeContents.find(c => c.type === 'RETURNS')?.content || null;
    const paymentMethods = store.storeContents.find(c => c.type === 'PAYMENTS')?.content || null;
    const studentDiscounts = store.storeContents.find(c => c.type === 'STUDENT')?.content || null;

    return (
        <div>
            <Breadcrumbs items={[
                { name: "Stores", href: "/stores" },
                { name: store.name }
            ]} />

            {/* Store Header */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
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
                                    {store.activeOfferCount} Offers
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
                    
                    {/* Navigation Bar */}
                    <MerchantNav storeSlug={store.slug} hasFaq={hasFaq} hasGuide={hasGuide} />
                </div>
            </section>

            {/* Layout Split: Main Content + Sidebar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1">
                        {children}
                    </div>

                    {/* Universal Sidebar */}
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
                                        <dd className="font-medium">{store.activeOfferCount}</dd>
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

                            {/* How to Use (Contextual, could be hidden on Guide but let's keep it for now) */}
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

                            {/* Merchant Authority Box */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">About {store.name}</h3>
                                {shippingInfo && (
                                    <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                        <Truck className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <strong className="block text-gray-900">Shipping</strong>
                                            {shippingInfo}
                                        </div>
                                    </div>
                                )}
                                {returnPolicy && (
                                    <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                        <RefreshCw className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <strong className="block text-gray-900">Returns</strong>
                                            {returnPolicy}
                                        </div>
                                    </div>
                                )}
                                {paymentMethods && (
                                    <div className="flex gap-3 mb-4 text-sm text-gray-600">
                                        <CreditCard className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <strong className="block text-gray-900">Payment Methods</strong>
                                            {paymentMethods}
                                        </div>
                                    </div>
                                )}
                                {studentDiscounts && (
                                    <div className="flex gap-3 text-sm text-gray-600">
                                        <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
                                        <div>
                                            <strong className="block text-gray-900">Student Discount</strong>
                                            {studentDiscounts}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <TrendingWidget />
                            <AdBannerSidebar />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
