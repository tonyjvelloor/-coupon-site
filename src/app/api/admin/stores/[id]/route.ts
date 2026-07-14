import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single store
export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const store = await prisma.store.findUnique({
            where: { id },
            include: {
                storeCategories: { include: { category: true } },
                coupons: { orderBy: { createdAt: "desc" } },
                storeContents: true,
            },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json(store);
    } catch (error) {
        console.error("Error fetching store:", error);
        return NextResponse.json(
            { error: "Failed to fetch store" },
            { status: 500 }
        );
    }
}

// PUT update store
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        // Check if slug already exists for different store
        const existing = await prisma.store.findFirst({
            where: { slug: data.slug, NOT: { id } },
        });
        if (existing) {
            return NextResponse.json(
                { error: "A store with this slug already exists" },
                { status: 400 }
            );
        }

        const { categoryIds, storeContents, ...storeData } = data;

        // Calculate knowledgeDensity
        if (storeContents && Array.isArray(storeContents)) {
            let score = 0;
            const validContents = storeContents.filter((c: any) => c.content && c.content.trim() !== '');
            const validTypes = new Set(validContents.map((c: any) => c.type));
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
            storeData.knowledgeDensity = Math.min(100, score);
        }

        const store = await prisma.store.update({
            where: { id },
            data: storeData,
        });

        // Update category associations
        await prisma.storeCategory.deleteMany({ where: { storeId: id } });
        if (categoryIds && categoryIds.length > 0) {
            await prisma.storeCategory.createMany({
                data: categoryIds.map((categoryId: string) => ({
                    storeId: store.id,
                    categoryId,
                })),
            });
        }

        if (storeContents && Array.isArray(storeContents)) {
            const validContents = storeContents.filter((c: any) => c.content && c.content.trim() !== '');
            const validTypes = validContents.map((c: any) => c.type);
            
            // Delete types that are no longer present
            await prisma.storeContent.deleteMany({
                where: { 
                    storeId: id,
                    type: { notIn: validTypes }
                }
            });

            // Upsert valid ones
            for (const item of validContents) {
                await prisma.storeContent.upsert({
                    where: { storeId_type: { storeId: id, type: item.type } },
                    update: { content: item.content },
                    create: { storeId: id, type: item.type, content: item.content }
                });
            }
        }

        return NextResponse.json(store);
    } catch (error) {
        console.error("Error updating store:", error);
        return NextResponse.json(
            { error: "Failed to update store" },
            { status: 500 }
        );
    }
}

// DELETE store
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.store.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting store:", error);
        return NextResponse.json(
            { error: "Failed to delete store" },
            { status: 500 }
        );
    }
}
