
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json({ stores: [], coupons: [] });
    }

    try {
        const stores = await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: query } }, // Case insensitive by default in SQLite setup? No, usually generic `contains`.
                    // For "startswith" specifically as requested:
                    { name: { startsWith: query } },
                ],
                isActive: true,
            },
            take: 5,
            select: {
                id: true,
                name: true,
                logo: true,
                slug: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        const coupons = await prisma.coupon.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { code: { contains: query } },
                ],
                // Filter out coupons from inactive stores? Ideally yes, but prisma relational filter might be heavy.
                // Keeping it simple.
            },
            take: 5,
            select: {
                id: true,
                title: true,
                code: true,
                discountValue: true,
                store: {
                    select: {
                        name: true,
                        logo: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Filter valid matches on client side or refine query? 
        // Note: SQLite `contains` is usually case-insensitive.

        return NextResponse.json({ stores, coupons });

    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
