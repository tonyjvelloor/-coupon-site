import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { slugs } = body;

        if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
            return NextResponse.json({ stores: [] });
        }

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
                // We'll mock rating and savings in the component, or we can fetch them here if we have real data.
            },
        });

        // Ensure stores are returned in the exact order they were requested (e.g. recently viewed order)
        const orderedStores = slugs
            .map(slug => stores.find(s => s.slug === slug))
            .filter(Boolean);

        return NextResponse.json({ stores: orderedStores });
    } catch (error) {
        console.error("Recommendations error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
