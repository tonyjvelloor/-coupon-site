import { prisma } from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 86400; // 24 hours ISR

export const metadata: Metadata = {
    title: "HTML Sitemap - Explore All Stores, Categories, & Offers",
    description: "Navigate CouponHub easily. Find all our stores, categories, curated collections, and blog posts in one place.",
};

export default async function SitemapPage() {
    const [stores, categories, collections, posts] = await Promise.all([
        prisma.store.findMany({ where: { isActive: true }, select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
        prisma.category.findMany({ where: { isActive: true }, select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
        prisma.collection.findMany({ where: { isIndexable: true }, select: { name: true, slug: true }, orderBy: { priority: 'desc' } }),
        prisma.blogPost.findMany({ where: { isPublished: true }, select: { title: true, slug: true }, orderBy: { createdAt: 'desc' } })
    ]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
            <p className="text-lg text-gray-600 mb-12">
                Explore all active stores, categories, deals, and articles on CouponHub.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Stores */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Stores A-Z</h2>
                    <ul className="space-y-2">
                        {stores.map(store => (
                            <li key={store.slug}>
                                <Link href={`/stores/${store.slug}`} className="text-violet-600 hover:underline">
                                    {store.name} Coupons
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Categories */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Shopping Categories</h2>
                    <ul className="space-y-2">
                        {categories.map(cat => (
                            <li key={cat.slug}>
                                <Link href={`/category/${cat.slug}`} className="text-violet-600 hover:underline">
                                    {cat.name} Coupons
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Collections */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Curated Offers</h2>
                    <ul className="space-y-2">
                        {collections.map(col => (
                            <li key={col.slug}>
                                <Link href={`/offers/${col.slug}`} className="text-violet-600 hover:underline">
                                    {col.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Blog Posts */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Recent Articles</h2>
                    <ul className="space-y-2">
                        {posts.map(post => (
                            <li key={post.slug}>
                                <Link href={`/blog/${post.slug}`} className="text-violet-600 hover:underline">
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
