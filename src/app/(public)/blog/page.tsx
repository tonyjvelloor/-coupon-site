import { prisma } from "@/lib/db";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Latest Deals & Saving Tips | CouponHub",
    description: "Discover the best ways to save money, shopping guides, and exclusive deal analysis on the CouponHub blog.",
};

export const revalidate = 86400; // Revalidate every 24 hours

export default async function BlogListingPage() {
    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        include: {
            author: { select: { name: true } },
        },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        The CouponHub Blog
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Smart shopping tips, deal roundups, and guides to help you save more on every purchase.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📝</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
                        <p className="text-gray-500">Check back soon for the latest updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.publishedAt
                                                ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "Draft"}
                                        </div>
                                        {post.author?.name && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author.name}
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/blog/${post.slug}`} className="group block mb-3">
                                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                        {post.seoDescription || post.content.substring(0, 150) + "..."}
                                    </p>

                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700 mt-auto"
                                    >
                                        Read Article
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Blog Index Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        name: "CouponHub Blog",
                        url: `${siteUrl}/blog`,
                        description: "Latest articles on saving money, best deals, and shopping hacks.",
                        blogPost: posts.slice(0, 10).map((post) => ({
                            "@type": "BlogPosting",
                            headline: post.title,
                            datePublished: post.publishedAt?.toISOString(),
                            url: `${siteUrl}/blog/${post.slug}`,
                            image: post.coverImage || undefined,
                            author: {
                                "@type": "Person",
                                name: post.author?.name || "CouponHub"
                            }
                        }))
                    })
                }}
            />
        </div>
    );
}
