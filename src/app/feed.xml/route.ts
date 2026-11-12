import { prisma } from "@/lib/db";
import { FALLBACK_BLOG_POSTS } from "@/lib/blog-data";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache feed for 1 hour

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    let posts: Array<{
        title: string;
        slug: string;
        seoDescription?: string | null;
        content?: string | null;
        publishedAt?: Date | null;
        createdAt?: Date | null;
    }> = [];

    try {
        posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
    } catch (e) {
        console.warn("[feed.xml] DB fetch failed, using fallback blog posts:", e);
    }

    if (!posts || posts.length === 0) {
        posts = FALLBACK_BLOG_POSTS;
    }

    const itemsXml = posts
        .map((post) => {
            const postUrl = `${siteUrl}/blog/${post.slug}`;
            const pubDate = new Date(post.publishedAt || post.createdAt || Date.now()).toUTCString();
            const description = post.seoDescription || post.title;
            const contentHtml = post.content || description;
            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${description}]]></description>
            <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
        </item>`;
        })
        .join("");

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
            <title>CouponHub - Verified Coupons &amp; Money Saving Intelligence</title>
            <link>${siteUrl}</link>
            <description>Real-time tested coupons, promo codes, UPI cashback, and bank card discounts for Indian online shoppers.</description>
            <language>en-in</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
            ${itemsXml}
        </channel>
    </rss>`;

    return new NextResponse(feedXml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
