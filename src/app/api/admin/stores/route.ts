import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all stores
export async function GET() {
    try {
        const stores = await prisma.store.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { coupons: true } } },
        });
        return NextResponse.json(stores);
    } catch (error) {
        console.error("Error fetching stores:", error);
        return NextResponse.json(
            { error: "Failed to fetch stores" },
            { status: 500 }
        );
    }
}

// POST create new store
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Check if slug already exists
        const existing = await prisma.store.findUnique({
            where: { slug: data.slug },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A store with this slug already exists" },
                { status: 400 }
            );
        }

        const { categoryIds, storeContents, ...storeData } = data;

        // Calculate knowledgeDensity
        let score = 0;
        if (storeContents && Array.isArray(storeContents)) {
            const validContents = storeContents.filter(c => c.content && c.content.trim() !== '');
            const validTypes = new Set(validContents.map(c => c.type));
            if (validTypes.has('ABOUT')) score += 10;
            if (validTypes.has('FAQ')) score += 15;
            if (validTypes.has('BUYING_GUIDE')) score += 20;
            if (validTypes.has('SHIPPING')) score += 10;
            if (validTypes.has('RETURNS')) score += 10;
            if (validTypes.has('PAYMENTS')) score += 10;
            if (validTypes.has('STUDENT')) score += 5;
            if (validTypes.has('REFUND')) score += 5;
            if (validTypes.has('EXCHANGE')) score += 5;
            if (validTypes.has('WARRANTY')) score += 5;
            if (validTypes.has('GIFT_CARDS')) score += 5;
        }
        storeData.knowledgeDensity = Math.min(100, score);

        const store = await prisma.store.create({
            data: storeData,
        });

        // Create category associations
        if (categoryIds && categoryIds.length > 0) {
            await prisma.storeCategory.createMany({
                data: categoryIds.map((categoryId: string) => ({
                    storeId: store.id,
                    categoryId,
                })),
            });
        }

        if (storeContents && Array.isArray(storeContents)) {
            const validContents = storeContents.filter(c => c.content && c.content.trim() !== '');
            if (validContents.length > 0) {
                await prisma.storeContent.createMany({
                    data: validContents.map(c => ({
                        storeId: store.id,
                        type: c.type,
                        content: c.content
                    }))
                });
            }
        }

        return NextResponse.json(store, { status: 201 });
    } catch (error) {
        console.error("Error creating store:", error);
        return NextResponse.json(
            { error: "Failed to create store" },
            { status: 500 }
        );
    }
}
