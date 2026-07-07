import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PublishService } from "@/lib/import-engine/publish-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const confirmedStoreId = body.storeId || undefined;

    const publisher = new PublishService();
    // In a real app we'd map session.user.id to adminId
    const result: any = await publisher.publish(params.id, "admin", confirmedStoreId); 

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
