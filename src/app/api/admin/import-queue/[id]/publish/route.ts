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

    // The UI sends a Store ID (or MerchantIdentity ID).
    // We need a MerchantIdentity ID for PublishService.
    // Strategy: if storeId provided, find or create the canonical MerchantIdentity for that store.
    // If not provided, fall back to the ImportedOffer's own resolvedIdentityId.
    const confirmedStoreId: string | undefined = body.storeId || undefined;

    // Resolve merchantIdentityId
    let merchantIdentityId: string | undefined;

    if (confirmedStoreId) {
      // Try to find a CANONICAL MerchantIdentity for this store
      const identity = await prisma.merchantIdentity.findFirst({
        where: {
          canonicalStoreId: confirmedStoreId,
          type: "CANONICAL",
        },
        select: { id: true },
      });

      if (identity) {
        merchantIdentityId = identity.id;
      } else {
        // No CANONICAL identity yet — create one on the fly
        const newIdentity = await prisma.merchantIdentity.create({
          data: {
            type: "CANONICAL",
            canonicalStoreId: confirmedStoreId,
          },
          select: { id: true },
        });
        merchantIdentityId = newIdentity.id;
      }
    } else {
      // No store selected — fall back to the ImportedOffer's suggestedStoreId
      const offer = await prisma.importedOffer.findUnique({
        where: { id },
        select: { suggestedStoreId: true },
      });
      const fallbackStoreId = offer?.suggestedStoreId ?? undefined;

      if (fallbackStoreId) {
        const identity = await prisma.merchantIdentity.findFirst({
          where: { canonicalStoreId: fallbackStoreId, type: "CANONICAL" },
          select: { id: true },
        });
        merchantIdentityId = identity?.id;
      }
    }

    if (!merchantIdentityId) {
      return NextResponse.json(
        { error: "No store selected. Please pick a store from the dropdown before publishing." },
        { status: 400 }
      );
    }

    const publisher = new PublishService();

    const result = await publisher.publish(id, {
      actorType: "ADMIN",
      actorId: session.id,
      merchantIdentityId,
    });

    // Spawn async intelligence tasks (non-blocking)
    try {
      const { TaskGenerator } = await import("@/lib/intelligence/task-generator");
      await TaskGenerator.publish("COUPON_PUBLISHED", "Coupon", id);
      if (confirmedStoreId) {
        await TaskGenerator.publish("MERCHANT_UPDATED", "Store", confirmedStoreId);
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
