import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex text-slate-900">
            <AdminSidebar user={session} />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
    );
}
