import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all coupons
export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
            include: { merchantIdentity: { include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } } } },
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
                merchantIdentityId: data.storeId, // storeId from frontend actually represents the merchant identity or needs to be mapped to it
            },
        });

        // Since Coupon doesn't link directly to Store, we might need to find the store via MerchantIdentity
        // But for simplicity, assuming data.storeId is actually MerchantIdentityId from the admin form for now,
        // we'll skip incrementing store offer count in the API directly unless we resolve the store.
        if (data.storeId) {
            const identity = await prisma.merchantIdentity.findUnique({
                where: { id: data.storeId },
                include: { merchantIdentity: { include: { merchantIdentity: { include: { store: true } } } } }
            });
            if (identity?.store) {
                await prisma.store.update({
                    where: { id: identity.store.id },
                    data: { offerCount: { increment: 1 } },
                });
            }
        }

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
