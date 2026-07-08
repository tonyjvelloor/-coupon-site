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

        const { categoryIds, aboutContent, storeContents, ...storeData } = data;

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

        if (aboutContent !== undefined) {
            if (aboutContent) {
                await prisma.storeContent.upsert({
                    where: { storeId_type: { storeId: id, type: 'ABOUT' } },
                    update: { content: aboutContent },
                    create: { storeId: id, type: 'ABOUT', content: aboutContent }
                });
            } else {
                await prisma.storeContent.deleteMany({
                    where: { storeId: id, type: 'ABOUT' }
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
