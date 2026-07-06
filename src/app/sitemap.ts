import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    // 1. Static Routes
    const staticRoutes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/stores`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/html-sitemap`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.5,
        },
    ];

    // 2. Dynamic Store Routes
    const stores = await prisma.store.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
    });

    const storeRoutes = stores.map((store) => ({
        url: `${baseUrl}/stores/${store.slug}`,
        lastModified: store.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.9, // Stores are high priority
    }));

    // 3. Dynamic Category Routes
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
    });

    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
    }));

    // 4. Dynamic Blog Routes
    const blogPosts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
    });

    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    // 5. Dynamic Collection Routes (Programmatic SEO)
    const collections = await prisma.collection.findMany({
        where: { isIndexable: true },
        select: { slug: true, updatedAt: true },
    });

    const collectionRoutes = collections.map((col) => ({
        url: `${baseUrl}/offers/${col.slug}`,
        lastModified: col.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...storeRoutes, ...categoryRoutes, ...blogRoutes, ...collectionRoutes];
}
