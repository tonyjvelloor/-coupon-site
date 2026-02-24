import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://couponhub.store"; // Replace with actual domain

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

    return [...staticRoutes, ...storeRoutes, ...categoryRoutes];
}
