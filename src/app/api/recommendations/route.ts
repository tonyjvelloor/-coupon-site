import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FALLBACK_STORES } from "@/lib/fallback-catalog";

export async function POST(request: NextRequest) {
    let slugs: string[] = [];
    try {
        const body = await request.json();
        if (body && Array.isArray(body.slugs)) {
            slugs = body.slugs.filter((s: unknown): s is string => typeof s === "string");
        }
    } catch {
        return NextResponse.json({ stores: [] });
    }

    if (slugs.length === 0) {
        return NextResponse.json({ stores: [] });
    }

    try {
        const stores = await prisma.store.findMany({
            where: {
                slug: { in: slugs },
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                offerCount: true,
            },
        });

        const orderedStores = slugs
            .map(slug => stores.find(s => s.slug === slug))
            .filter(Boolean);

        return NextResponse.json({ stores: orderedStores });
    } catch (error) {
        console.warn("[api/recommendations] DB failed, serving fallback stores:", error);
        const orderedFallback = slugs
            .map(slug => FALLBACK_STORES.find(s => s.slug === slug))
            .filter(Boolean)
            .map(s => ({
                id: s!.id,
                name: s!.name,
                slug: s!.slug,
                logo: s!.logo,
                offerCount: s!.offerCount,
            }));

        return NextResponse.json({ stores: orderedFallback });
    }
}
