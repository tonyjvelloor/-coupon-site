import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsTicker from "@/components/ui/NewsTicker";

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
            <NewsTicker />
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
