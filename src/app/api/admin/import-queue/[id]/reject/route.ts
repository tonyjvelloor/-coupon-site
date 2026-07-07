import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const importedOffer = await prisma.importedOffer.findUnique({
      where: { id: params.id }
    });
    
    if (!importedOffer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.importedOffer.update({
        where: { id: params.id },
        data: { status: "rejected" }
      });
      
      await tx.importJob.update({
        where: { id: importedOffer.importJobId },
        data: { rejected: { increment: 1 } }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json(
      { error: "Failed to reject offer" },
      { status: 500 }
    );
  }
}
