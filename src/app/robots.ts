import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://couponhub.store";

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/images/", "/api/og/"],
            disallow: ["/admin/", "/api/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
