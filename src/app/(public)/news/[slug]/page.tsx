import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Sparkles, ArrowLeft, ExternalLink, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NewsArticlePageProps {
    params: {
        slug: string;
    };
}

// Generate SEO Metadata
export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
    const article = await prisma.newsArticle.findUnique({
        where: { slug: params.slug },
    });

    if (!article || !article.isVerified) {
        return {
            title: "News Article Not Found",
        };
    }

    return {
        title: `${article.title} | Viral Deals News`,
        description: article.summary,
    };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
    const article = await prisma.newsArticle.findUnique({
        where: { slug: params.slug },
    });

    if (!article || !article.isVerified) {
        notFound();
    }

    // JSON-LD Structured Data for NewsArticle
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.summary,
        image: article.imageUrl ? [article.imageUrl] : [],
        datePublished: article.publishedAt.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: {
            "@type": "Organization",
            name: "CouponHub AI Tracker",
        },
        publisher: {
            "@type": "Organization",
            name: "CouponHub",
            logo: {
                "@type": "ImageObject",
                url: "https://couponhub.store/logo.png"
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Back Navigation Layer */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6">
                <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 font-medium transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to News
                </Link>
            </div>

            {/* Main Article Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Header/Hero Section */}
                    {article.imageUrl ? (
                        <div className="w-full h-[400px] relative bg-gray-900 flex items-end">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover opacity-60 mix-blend-overlay"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                            <div className="relative z-10 p-8 md:p-12 w-full">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        <Sparkles className="w-4 h-4" />
                                        AI Verified Deal
                                    </span>
                                    {article.sourceName && (
                                        <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                            via {article.sourceName}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                                    {article.title}
                                </h1>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full p-8 md:p-12 bg-gradient-to-br from-gray-900 to-violet-950 text-white relative overflow-hidden">
                            <Sparkles className="absolute top-0 right-0 w-64 h-64 text-white opacity-5 transform translate-x-1/4 -translate-y-1/4" />
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        <Sparkles className="w-4 h-4" />
                                        AI Verified Deal
                                    </span>
                                    {article.sourceName && (
                                        <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                            via {article.sourceName}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-2">
                                    {article.title}
                                </h1>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-2 text-gray-500 font-medium mb-8 pb-8 border-b border-gray-100">
                            <Clock className="w-5 h-5" />
                            Detected on {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>

                        <div className="prose prose-lg prose-violet max-w-none text-gray-700 leading-relaxed mb-12">
                            <p className="text-2xl text-gray-900 leading-normal font-medium first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-bold first-letter:text-violet-600">
                                {article.summary}
                            </p>
                        </div>

                        {/* Action Area */}
                        <div className="bg-violet-50 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-violet-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to grab this?</h3>
                                <p className="text-gray-600">This deal was found on <strong>{article.sourceName || "the web"}</strong>. Prices change rapidly.</p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button className="p-3 text-gray-600 hover:text-violet-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <a
                                    href={article.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5"
                                >
                                    Claim Target Deal <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Automation Disclaimer */}
                <p className="text-center text-gray-400 text-sm mt-8 max-w-2xl mx-auto">
                    This article was automatically detected and summarized by the CouponHub AI tracking engine. We do not guarantee the availability or final price of the product on the destination site as deals can expire at any moment.
                </p>
            </div>
        </div>
    );
}
