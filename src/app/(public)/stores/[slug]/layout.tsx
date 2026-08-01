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
            {children}
        </div>
    );
}
