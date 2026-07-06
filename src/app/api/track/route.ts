import { NextResponse } from "next";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { type, id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        if (type === "coupon") {
            await prisma.coupon.update({
                where: { id },
                data: { clicks: { increment: 1 } },
            });
            return NextResponse.json({ success: true });
        } else if (type === "store") {
            await prisma.store.update({
                where: { id },
                data: { clicks: { increment: 1 } },
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
    }
}
