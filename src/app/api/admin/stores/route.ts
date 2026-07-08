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

        const { categoryIds, aboutContent, ...storeData } = data;

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

        if (aboutContent) {
            await prisma.storeContent.create({
                data: { storeId: store.id, type: 'ABOUT', content: aboutContent }
            });
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
