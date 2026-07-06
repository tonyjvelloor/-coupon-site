import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Sparkles, ArrowRight } from 'lucide-react';

export default async function NewsTicker() {
    // Fetch the 3 latest verified news articles
    const latestNews = await prisma.newsArticle.findMany({
        where: { isVerified: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
            title: true,
            slug: true,
            sourceName: true,
        }
    });

    if (!latestNews || latestNews.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white overflow-hidden py-2 relative">
            <div className="max-w-7xl mx-auto px-4 flex items-center">

                {/* Static indicator on the left */}
                <div className="flex items-center gap-2 pr-4 border-r border-white/20 whitespace-nowrap z-10 bg-inherit relative font-bold text-sm">
                    <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
                    <span>VIRAL DEALS</span>
                </div>

                {/* Animated scrolling wrapper */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="flex whitespace-nowrap animate-marquee items-center pl-4">
                        {latestNews.map((news, index) => (
                            <div key={index} className="flex items-center mx-4">
                                <Link href={`/news`} className="hover:underline flex items-center gap-2 group">
                                    <span className="font-medium">{news.title}</span>
                                    {news.sourceName && (
                                        <span className="text-white/70 text-xs px-2 py-0.5 rounded-full bg-white/10">
                                            via {news.sourceName}
                                        </span>
                                    )}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                {/* Separator dot */}
                                {index < latestNews.length - 1 && (
                                    <span className="mx-6 text-white/40">•</span>
                                )}
                            </div>
                        ))}
                        {/* Duplicate the list for seamless looping */}
                        <div className="flex items-center">
                            <span className="mx-6 text-white/40">•</span>
                            {latestNews.map((news, index) => (
                                <div key={`dup-${index}`} className="flex items-center mx-4">
                                    <Link href={`/news`} className="hover:underline flex items-center gap-2 group">
                                        <span className="font-medium">{news.title}</span>
                                        {news.sourceName && (
                                            <span className="text-white/70 text-xs px-2 py-0.5 rounded-full bg-white/10">
                                                via {news.sourceName}
                                            </span>
                                        )}
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    {/* Separator dot */}
                                    {index < latestNews.length - 1 && (
                                        <span className="mx-6 text-white/40">•</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Inline styles for the marquee animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </div>
    );
}
