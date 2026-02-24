import { prisma } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const post = await prisma.blogPost.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        notFound();
    }

    // Convert keys to satisfy interface if needed, generally Prisma matches
    return <PostForm initialData={post} />;
}
