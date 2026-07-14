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
    const ogTitle = `${store.name} Return Policy & Refunds`;
    
    return {
        title: ogTitle,
        description: `Everything you need to know about ${store.name} return policies, refund timelines, and exchange rules.`,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}/returns`,
        }
    };
}

export default async function StoreReturnsPage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: { storeContents: true },
    });

    if (!store) notFound();

    const returnsContent = store.storeContents.find(c => c.type === 'RETURNS')?.content;
    
    if (!returnsContent) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">Return policy details are not available for {store.name} at this time.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{store.name} Return Policy</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {returnsContent}
                </div>
            </div>
        </div>
    );
}
