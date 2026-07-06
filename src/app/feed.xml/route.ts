import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache feed for 1 hour

export async function GET() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    const posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    const itemsXml = posts
        .map((post) => {
            const postUrl = `${siteUrl}/blog/${post.slug}`;
            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${postUrl}</link>
            <guid>${postUrl}</guid>
            <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
            <description><![CDATA[${post.seoDescription || ""}]]></description>
        </item>
        `;
        })
        .join("");

    const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            <title>CouponHub - Latest Offers and Money Saving Tips</title>
            <link>${siteUrl}</link>
            <description>Get the best coupons, promo codes, and deals from top online stores.</description>
            <language>en-us</language>
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
