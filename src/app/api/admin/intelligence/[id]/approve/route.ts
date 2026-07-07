import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { selectedFields } = await request.json();
    
    const task = await prisma.intelligenceTask.findUnique({
      where: { id: params.id }
    });

    if (!task || task.status !== "PENDING_REVIEW") {
      return NextResponse.json({ error: "Invalid task state" }, { status: 400 });
    }

    const proposalData = (task.generatedData as any)?.data || {};
    
    // Build update object based on selections
    const updateData: any = {};
    for (const [field, isSelected] of Object.entries(selectedFields)) {
      if (isSelected && proposalData[field] !== undefined) {
        updateData[field] = proposalData[field];
      }
    }

    // Apply to production
    await prisma.$transaction(async (tx) => {
      if (task.entityType === "Coupon") {
        await tx.coupon.update({
          where: { id: task.entityId },
          data: updateData
        });
      } else if (task.entityType === "Store") {
        await tx.store.update({
          where: { id: task.entityId },
          data: updateData
        });
      }

      // Mark applied
      await tx.intelligenceTask.update({
        where: { id: task.id },
        data: {
          status: "APPLIED",
          completedAt: new Date()
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to approve task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
