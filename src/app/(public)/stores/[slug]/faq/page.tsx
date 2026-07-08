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
    const ogTitle = `${store.name} FAQ & Common Questions`;
    
    return {
        title: ogTitle,
        description: `Frequently asked questions about ${store.name} coupons, shipping, and returns.`,
        alternates: {
            canonical: `${siteUrl}/stores/${store.slug}/faq`,
        }
    };
}

export default async function StoreFaqPage({ params }: PageProps) {
    const { slug } = await params;

    const store = await prisma.store.findUnique({
        where: { slug, isActive: true },
        include: { storeContents: true },
    });

    if (!store) notFound();

    const faqContentStr = store.storeContents.find(c => c.type === 'FAQ')?.content;
    
    if (!faqContentStr) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-xl">
                <p className="text-gray-500">No FAQ available for {store.name} at this time.</p>
            </div>
        );
    }

    let faqs = [];
    try {
        faqs = JSON.parse(faqContentStr);
    } catch (e) {
        // ignore
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                {Array.isArray(faqs) && faqs.length > 0 ? (
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="prose max-w-none text-gray-700">
                        {faqContentStr}
                    </div>
                )}
            </div>
        </div>
    );
}
