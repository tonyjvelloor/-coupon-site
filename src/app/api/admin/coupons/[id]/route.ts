import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single coupon
export async function GET(_request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const coupon = await prisma.coupon.findUnique({
            where: { id },
            include: { merchantIdentity: { include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } } } },
        });

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Error fetching coupon:", error);
        return NextResponse.json(
            { error: "Failed to fetch coupon" },
            { status: 500 }
        );
    }
}

// PUT update coupon
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description || null,
                code: data.code || null,
                type: data.type,
                discountType: data.discountType,
                discountValue: data.discountValue || null,
                affiliateUrl: data.affiliateUrl,
                image: data.image || null,
                bank: data.bank || null,
                termsConditions: data.termsConditions || null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                isVerified: data.isVerified,
                isExclusive: data.isExclusive,
                isFeatured: data.isFeatured,
                merchantIdentityId: data.storeId, // assuming storeId from UI maps to merchantIdentityId
            },
        });

        revalidatePath("/", "layout");

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Error updating coupon:", error);
        return NextResponse.json(
            { error: "Failed to update coupon" },
            { status: 500 }
        );
    }
}

// DELETE coupon
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const coupon = await prisma.coupon.findUnique({ 
            where: { id },
            include: { merchantIdentity: true }
        });
        if (coupon && coupon.merchantIdentity?.canonicalStoreId) {
            await prisma.store.update({
                where: { id: coupon.merchantIdentity.canonicalStoreId },
                data: { offerCount: { decrement: 1 } },
            });
        }

        await prisma.coupon.delete({ where: { id } });

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        return NextResponse.json(
            { error: "Failed to delete coupon" },
            { status: 500 }
        );
    }
}
