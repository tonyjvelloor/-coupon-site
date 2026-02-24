import { prisma } from "@/lib/db";
import CouponForm from "@/components/admin/CouponForm";

export default async function NewCouponPage() {
    const stores = await prisma.store.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return <CouponForm stores={stores} />;
}
