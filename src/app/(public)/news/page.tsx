import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { ExternalLink, Sparkles, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Viral Tech & Deal News | CouponHub",
    description: "Automated, AI-verified tracking of the most viral tech product launches, price drops, and extreme deals across the web.",
};

export default async function NewsListingPage() {
    // Fetch all verified news articles
    const newsArticles = await prisma.newsArticle.findMany({
        where: { isVerified: true },
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <div className="mb-12 border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Viral Drops & Breaking Deals
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                        Our AI engine scans the web every 48 hours for the most viral product launches, secret price drops, and extreme discounts. If it's on this page, our algorithm verified it's a genuinely explosive deal.
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 w-fit px-4 py-2 rounded-full shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>Crawler Status: <strong>Monitoring Active</strong></span>
                    </div>
                </div>

                {/* News Grid */}
                {newsArticles.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Viral Drops Yet</h3>
                        <p className="text-gray-500">Our engine just started monitoring. Check back shortly for explosive deals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsArticles.map((article) => (
                            <article
                                key={article.id}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative"
                            >
                                {/* "Verified" Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    AI Verified
                                </div>

                                {article.imageUrl ? (
                                    <div className="w-full h-48 relative bg-gray-100 overflow-hidden">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-black/20" />
                                        <Sparkles className="w-8 h-8 mb-2 opacity-50 relative z-10" />
                                        <span className="font-bold relative z-10 opacity-90">{article.sourceName || 'Web Crawl'}</span>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col flex-1 border-t border-gray-100/50">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-3">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(article.publishedAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {article.sourceName && (
                                            <>
                                                <span>•</span>
                                                <span className="text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">via {article.sourceName}</span>
                                            </>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-violet-600 transition-colors">
                                        {article.title}
                                    </h2>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                                        {article.summary}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                        <Link
                                            href={`/news/${article.slug}`}
                                            className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
                                        >
                                            Read Details
                                        </Link>

                                        <a
                                            href={article.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-lg text-sm font-semibold transition-all border border-gray-200 hover:border-violet-200"
                                        >
                                            Grab Deal <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
