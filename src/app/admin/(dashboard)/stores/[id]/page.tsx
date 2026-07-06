import { prisma } from "@/lib/db";
import StoreForm from "@/components/admin/StoreForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditStorePage({ params }: PageProps) {
    const { id } = await params;

    const store = await prisma.store.findUnique({
        where: { id },
        include: {
            storeCategories: { select: { categoryId: true } },
        },
    });

    if (!store) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return (
        <StoreForm
            categories={categories}
            initialData={{
                ...store,
                categoryIds: store.storeCategories.map((sc) => sc.categoryId),
            }}
        />
    );
}
