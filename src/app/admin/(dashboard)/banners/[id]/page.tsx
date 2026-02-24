
import { prisma } from "@/lib/db";
import BannerForm from "@/components/admin/BannerForm";
import { notFound } from "next/navigation";

export default async function EditBannerPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const banner = await prisma.banner.findUnique({
        where: { id: params.id },
    });

    if (!banner) return notFound();

    return <BannerForm initialData={banner} />;
}
