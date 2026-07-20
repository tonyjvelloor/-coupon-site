import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { format } from "date-fns";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import { AdBannerInArticle, AdBannerSidebar } from "@/components/ui/AdBanner";

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export const revalidate = 86400; // 24 hours ISR

export async function generateStaticParams() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { slug: true },
        });
        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.warn("Failed to generate static params for blog:", error);
        return [];
    }
}

// SEO Metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug },
        include: { author: { select: { name: true } } }
    });

    if (!post || !post.isPublished) {
        return {
            title: "Post Not Found",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    const ogTitle = post.seoTitle || post.title;
    const ogDescription = post.seoDescription || post.content.substring(0, 160);

    return {
        title: ogTitle,
        description: ogDescription,
        keywords: post.keywords?.split(","),
        alternates: {
            canonical: `${siteUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
            authors: post.author?.name ? [post.author.name] : undefined,
            images: [
                {
                    url: post.coverImage || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(ogDescription.substring(0, 100))}&type=blog`,
                    width: 1200,
                    height: 630,
                    alt: ogTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            images: [post.coverImage || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(ogDescription.substring(0, 100))}&type=blog`],
        }
    };
}

// Simple Markdown-ish Renderer
function SimpleMarkdown({ content }: { content: string }) {
    return (
        <div className="prose prose-lg prose-violet max-w-none text-gray-700 leading-relaxed">
            {content.split("\n").map((line, index) => {
                const trimmed = line.trim();

                // Headers
                if (trimmed.startsWith("# ")) {
                    return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{trimmed.substring(2)}</h1>;
                }
                if (trimmed.startsWith("## ")) {
                    return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{trimmed.substring(3)}</h2>;
                }
                if (trimmed.startsWith("### ")) {
                    return <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{trimmed.substring(4)}</h3>;
                }

                // Blockquotes
                if (trimmed.startsWith("> ")) {
                    return (
                        <blockquote key={index} className="border-l-4 border-violet-500 pl-4 py-1 my-6 italic text-gray-600 bg-gray-50 rounded-r-lg">
                            {trimmed.substring(2)}
                        </blockquote>
                    );
                }

                // List items
                if (trimmed.startsWith("- ")) {
                    return <li key={index} className="ml-4 list-disc mb-2">{trimmed.substring(2)}</li>;
                }
                if (/^\d+\.\s/.test(trimmed)) {
                    // Match numbered lists like "1. "
                    const text = trimmed.replace(/^\d+\.\s/, "");
                    // Add basic bold parsing to list items
                    const boldParsed = text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part));
                    return <li key={index} className="ml-4 list-decimal mb-3">{boldParsed}</li>;
                }

                // Bold text in paragraphs (very simple parser)
                const parts = line.split("**");
                if (parts.length > 1) {
                    return (
                        <p key={index} className="mb-4">
                            {parts.map((part, i) => (
                                i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part
                            ))}
                        </p>
                    )
                }

                // Empty lines
                if (!trimmed) return <br key={index} />;

                // Regular paragraphs
                return <p key={index} className="mb-4">{line}</p>;
            })}
        </div>
    );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug },
        include: {
            author: { select: { name: true, profileImage: true, bio: true } },
        },
    });

    if (!post || !post.isPublished) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";
    
    // JSON-LD Structured Data Schema for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/blog/${post.slug}`
        },
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.content.substring(0, 160),
        image: post.coverImage ? [post.coverImage] : undefined,
        author: {
            "@type": "Person",
            name: post.author?.name || "CouponHub Editor",
        },
        publisher: {
            "@type": "Organization",
            name: "CouponHub",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`
            }
        },
        datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Breadcrumbs items={[
                { name: "Blog", href: "/blog" },
                { name: post.title }
            ]} />

            {/* Article Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-8 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
                        <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                            <Calendar className="w-4 h-4 text-violet-500" />
                            {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "Draft"}
                        </span>
                        {post.author?.name && (
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                <User className="w-4 h-4 text-violet-500" />
                                {post.author.name}
                            </span>
                        )}
                        <span className="text-gray-300">|</span>
                        <span>5 min read</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>

                    {post.seoDescription && (
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {post.seoDescription}
                        </p>
                    )}
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <SimpleMarkdown content={post.content} />

                        {/* In-article ad */}
                        <AdBannerInArticle />

                        {/* Share Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="font-semibold text-gray-900">Share this article</div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors font-medium">
                                <Share2 className="w-4 h-4" />
                                Share Link
                            </button>
                        </div>

                        {/* Author Profile Box (E-E-A-T) */}
                        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                                {post.author.profileImage ? (
                                    <Image src={post.author.profileImage} alt={post.author.name || "Author"} width={80} height={80} className="rounded-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-violet-500" />
                                )}
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Written by {post.author.name || "CouponHub Editorial Team"}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    {post.author.bio || "Our editorial team consists of deal experts and savings enthusiasts dedicated to finding you the best discounts online. Every post is fact-checked and verified for accuracy."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Table of Contents */}
                    <div className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-24">
                            {/* Premium Newsletter Signup in Sidebar */}
                            <div className="transform scale-90 origin-top">
                                <NewsletterSignup />
                            </div>

                            {/* Sidebar Ad */}
                            <div className="mt-6">
                                <AdBannerSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
