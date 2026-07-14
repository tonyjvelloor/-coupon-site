import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
    });

    if (!store) return { title: "Store Not Found" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const ogTitle = `${store.name} Shipping Policy & Free Shipping Codes`;
    
    return {
        title: ogTitle,
        description: `Everything you need to know about ${store.name} shipping policies, delivery times, and free shipping promo codes.`,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}/shipping`,
        }
    };
}

export default async function StoreShippingPage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: { storeContents: true },
    });

    if (!store) notFound();

    const shippingContent = store.storeContents.find(c => c.type === 'SHIPPING')?.content;
    
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
