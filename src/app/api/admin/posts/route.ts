import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content, seoTitle, seoDescription, keywords, isPublished } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        // Generate slug from title
        let slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        // Ensure unique slug
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                seoTitle,
                seoDescription,
                keywords,
                isPublished: isPublished || false,
                publishedAt: isPublished ? new Date() : null,
                authorId: session.id,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Create post error:", error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // For admin listing (though we use server component for page)
    // This could be used for frontend list
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            coverImage: true,
        },
    });

    return NextResponse.json(posts);
}
