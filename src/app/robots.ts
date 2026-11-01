import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/images/", "/api/og/"],
                disallow: ["/admin/", "/api/", "/out/"],
            },
            {
                // Explicitly allow Google AdSense crawler full access to crawl pages for contextual ads
                userAgent: "Mediapartners-Google",
                allow: "/",
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
