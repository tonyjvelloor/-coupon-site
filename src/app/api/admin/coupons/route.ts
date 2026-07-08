import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all coupons
export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
            include: { store: true },
        });
        return NextResponse.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return NextResponse.json(
            { error: "Failed to fetch coupons" },
            { status: 500 }
        );
    }
}

// POST create new coupon
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const coupon = await prisma.coupon.create({
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
                storeId: data.storeId,
            },
        });

        // Update store offer count
        await prisma.store.update({
            where: { id: data.storeId },
            data: { offerCount: { increment: 1 } },
        });

        revalidatePath("/", "layout");

        return NextResponse.json(coupon, { status: 201 });
    } catch (error) {
        console.error("Error creating coupon:", error);
        return NextResponse.json(
            { error: "Failed to create coupon" },
            { status: 500 }
        );
    }
}
