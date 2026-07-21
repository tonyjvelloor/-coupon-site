import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PublishService } from "@/lib/import-engine/publish-service";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const confirmedStoreId = body.storeId || undefined;

    const result: any = await prisma.$transaction(async (tx) => {
      const publisher = new PublishService(tx);
      // In a real app we'd map session.user.id to adminId
      const publishResult = await publisher.publish(id, "admin", confirmedStoreId); 
      
      await tx.importedOffer.update({
        where: { id: id },
        data: { status: "PUBLISHED" }
      });

      return publishResult;
    });

    // Spawn async intelligence tasks (non-blocking)
    try {
      const { TaskGenerator } = await import("@/lib/intelligence/task-generator");
      await TaskGenerator.publish("COUPON_PUBLISHED", "Coupon", result.couponId);
      
      if (result.storeId) {
          await TaskGenerator.publish("MERCHANT_UPDATED", "Store", result.storeId);
      }
    } catch (err) {
      console.error("Failed to spawn intelligence tasks:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish offer" },
      { status: 500 }
    );
  }
}
