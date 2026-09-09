import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { storeSeoGeneratorService } from "@/lib/services/store-seo-generator.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let overwrite = false;
    try {
      const body = await request.json();
      overwrite = Boolean(body?.overwrite);
    } catch {
      // Body is optional
    }

    const result = await storeSeoGeneratorService.backfillMissing({ overwrite });

    return NextResponse.json({
      success: true,
      message: `Successfully generated descriptions for ${result.updatedCount} stores.`,
      ...result
    });
  } catch (error) {
    console.error("Error bulk generating store descriptions:", error);
    return NextResponse.json(
      { error: "Failed to generate store descriptions" },
      { status: 500 }
    );
  }
}
