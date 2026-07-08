import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
