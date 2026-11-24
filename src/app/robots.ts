import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo-utils";

const AI_CRAWLERS = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "PerplexityBot",
    "Perplexity-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "Google-Extended",
    "Applebot-Extended",
    "DuckAssistBot",
    "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/images/", "/api/og/", "/llms.txt", "/llms-full.txt", "/ai.txt", "/ai-index.json"],
                disallow: ["/admin/", "/api/", "/out/"],
            },
            {
                // Explicitly allow Google AdSense crawler full access to crawl pages for contextual ads
                userAgent: "Mediapartners-Google",
                allow: "/",
            },
            ...AI_CRAWLERS.map((userAgent) => ({
                userAgent,
                allow: ["/", "/llms.txt", "/llms-full.txt", "/ai.txt", "/ai-index.json", "/stores/", "/banks/", "/blog/", "/compare/", "/events/", "/best/", "/tools/"],
                disallow: ["/admin/", "/api/", "/out/"],
            })),
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
