import { prisma } from "@/lib/db";
import CouponForm from "@/components/admin/CouponForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCouponPage({ params }: PageProps) {
    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({
        where: { id },
        include: { merchantIdentity: true }
    });

    if (!coupon) {
        notFound();
    }

    const stores = await prisma.store.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    const initialData = {
        ...coupon,
        storeId: coupon.merchantIdentity?.canonicalStoreId || "",
    };

    return <CouponForm stores={stores} initialData={initialData} />;
}
