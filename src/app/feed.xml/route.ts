import { getAllBlogPosts } from "@/lib/blog-data";
import { getSiteUrl } from "@/lib/seo-utils";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache feed for 1 hour

export async function GET() {
    const siteUrl = getSiteUrl();
    const posts = (await getAllBlogPosts()).slice(0, 20);

    const itemsXml = posts
        .map((post) => {
            const postUrl = `${siteUrl}/blog/${post.slug}`;
            const pubDate = new Date(post.publishedAt || Date.now()).toUTCString();
            const description = post.seoDescription || post.excerpt || post.title;
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
