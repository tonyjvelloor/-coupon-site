import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const couponId = searchParams.get('couponId');
    const storeId = searchParams.get('storeId');
    const source = searchParams.get('source');

    if (!url) {
        // If no URL is provided, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        // Capture basic tracking info
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Log the click event
        const clickEvent = await prisma.clickEvent.create({
            data: {
                url,
                couponId: couponId || null,
                storeId: storeId || null,
                source: source || null,
                ipAddress,
                userAgent,
            }
        });

        // Parse destination URL and inject Sub-ID
        const outUrl = new URL(url);
        // We inject the unique click ID as subid1 so we can reconcile it later from affiliate network reports
        outUrl.searchParams.set('subid1', clickEvent.id);

        return NextResponse.redirect(outUrl.toString(), 302);
    } catch (error) {
        console.error("Redirection Engine Error:", error);
        // Fallback to basic redirect if DB logging fails
        return NextResponse.redirect(url, 302);
    }
}
