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
    const ogTitle = `${store.name} Buying Guide & Saving Tips`;
    
    return {
        title: ogTitle,
        description: `Learn the best tips, tricks, and sales schedules to save the most money at ${store.name}.`,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}/buying-guide`,
        }
    };
}

export default async function StoreBuyingGuidePage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: { storeContents: true },
    });

    if (!store) notFound();

    const guideContent = store.storeContents.find(c => c.type === 'BUYING_GUIDE')?.content;
    
    if (!guideContent) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">No buying guide available for {store.name} at this time.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Save at {store.name}</h2>
                <div className="prose max-w-none text-gray-700">
                    {guideContent.split('\n').map((paragraph, idx) => {
                        if (paragraph.trim() === '') return null;
                        if (paragraph.startsWith('## ')) {
                            return <h3 key={idx} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                        }
                        if (paragraph.startsWith('# ')) {
                            return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('# ', '')}</h2>;
                        }
                        if (paragraph.startsWith('- ')) {
                            return <li key={idx} className="ml-4 list-disc">{paragraph.replace('- ', '')}</li>;
                        }
                        return <p key={idx} className="mb-4">{paragraph}</p>;
                    })}
                </div>
            </div>
        </div>
    );
}
