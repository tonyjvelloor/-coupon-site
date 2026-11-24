import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const { type, id, experiment_id, variant } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        if (experiment_id && variant) {
             logger.info({
                 type: "experiment_conversion",
                 experiment_id,
                 variant,
                 target_type: type,
                 target_id: id
             });
        }

        if (type === "coupon") {
            if (!String(id).startsWith("fb-")) {
                await prisma.coupon.update({
                    where: { id },
                    data: { clicks: { increment: 1 } },
                }).catch((err) => console.warn("[api/track] coupon click update skipped:", err));
            }
            return NextResponse.json({ success: true });
        } else if (type === "store") {
            if (!String(id).startsWith("fb-")) {
                await prisma.store.update({
                    where: { id },
                    data: { clicks: { increment: 1 } },
                }).catch((err) => console.warn("[api/track] store click update skipped:", err));
            }
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.warn("Tracking request error:", error);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
}
