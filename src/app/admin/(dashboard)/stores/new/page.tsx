import { prisma } from "@/lib/db";
import StoreForm from "@/components/admin/StoreForm";

export default async function NewStorePage() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return <StoreForm categories={categories} />;
}
