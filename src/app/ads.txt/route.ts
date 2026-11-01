import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
    const rawPubId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "pub-2697580332564903";
    // Strip "ca-" prefix if present (e.g. ca-pub-2697580332564903 -> pub-2697580332564903)
    const pubId = rawPubId.replace(/^ca-/, "");

    const adsTxtContent = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

    return new NextResponse(adsTxtContent, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
