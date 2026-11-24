import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSiteUrl, isStoreSubpageIndexable } from "@/lib/seo-utils";
import { getFallbackMerchantBySlug } from "@/lib/fallback-catalog";

export const revalidate = 21600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    let store: any = null;
    try {
        store = await prisma.store.findUnique({
            where: { slug, isActive: true },
            include: { storeContents: { where: { type: "SHIPPING" } } },
        });
    } catch {
        const fb = getFallbackMerchantBySlug(slug);
        if (fb) store = { ...fb, storeContents: fb.contents };
    }

    if (!store) return { title: "Store Not Found" };

    const siteUrl = getSiteUrl();
    const ogTitle = `${store.name} Shipping Policy & Free Shipping Codes`;
    const shippingContent = store.storeContents.find((c: any) => c.type === "SHIPPING")?.content;
    const isIndexable = isStoreSubpageIndexable(store.activeOfferCount, shippingContent);
    
    return {
        title: ogTitle,
        description: `Everything you need to know about ${store.name} shipping policies, delivery times, and free shipping promo codes.`,
        robots: { index: isIndexable, follow: true },
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}/shipping`,
        }
    };
}

export default async function StoreShippingPage({ params }: PageProps) {
    const { slug } = await params;

    let store: any = null;
    try {
        store = await prisma.store.findUnique({
            where: { slug, isActive: true },
            include: { storeContents: true },
        });
    } catch {
        const fb = getFallbackMerchantBySlug(slug);
        if (fb) store = { ...fb, storeContents: fb.contents };
    }

    if (!store) notFound();

    const shippingContent = store.storeContents.find((c: any) => c.type === 'SHIPPING')?.content;
    
    if (!shippingContent) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">Shipping policy details are not available for {store.name} at this time.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{store.name} Shipping Policy</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {shippingContent}
                </div>
            </div>
        </div>
    );
}
