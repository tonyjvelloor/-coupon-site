import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MobileNav } from "@/components/ui/MobileNav";
import { UserProvider } from "@/components/providers/UserProvider";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <div className="min-h-screen flex flex-col relative pb-[env(safe-area-inset-bottom)]">
                <Header />
                <main className="flex-1 md:pb-0 pb-16">{children}</main>
                <Footer />
                <MobileNav />
            </div>
        </UserProvider>
    );
}
