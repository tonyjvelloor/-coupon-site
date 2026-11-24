import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getFallbackMerchantBySlug } from "@/lib/fallback-catalog";

interface LayoutProps {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
}

export default async function StoreLayout({ params, children }: LayoutProps) {
    const { slug } = await params;

    let storeName: string | null = null;
    try {
        const store = await prisma.store.findUnique({
            where: { slug, isActive: true },
            select: { name: true },
        });
        storeName = store?.name || null;
    } catch {
        const fallback = getFallbackMerchantBySlug(slug);
        storeName = fallback?.name || null;
    }

    if (!storeName) {
        notFound();
    }

    return (
        <div>
            <Breadcrumbs items={[
                { name: "Stores", href: "/stores" },
                { name: storeName }
            ]} />
            {children}
        </div>
    );
}
