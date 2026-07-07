import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectorRegistry } from "@/lib/import-engine/registry";
import { ImportPipeline } from "@/lib/import-engine/pipeline";
import { prisma } from "@/lib/db";

// Ensure the pipeline doesn't run concurrently for the same connector
const runningImports = new Set<string>();

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sourceId } = await request.json();
    if (!sourceId) {
      return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
    }

    if (runningImports.has(sourceId)) {
      return NextResponse.json({ error: `An import for ${sourceId} is already running` }, { status: 409 });
    }

    const connector = connectorRegistry.get(sourceId);
    if (!connector) {
      return NextResponse.json({ error: `Connector not found: ${sourceId}` }, { status: 404 });
    }

    // Lock
    runningImports.add(sourceId);

    // Fire and forget the pipeline run
    const pipeline = new ImportPipeline();
    pipeline.run(connector, "v1.0").finally(() => {
      // Release lock
      runningImports.delete(sourceId);
    });

    return NextResponse.json({ success: true, message: `Import started for ${sourceId}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to trigger import" },
      { status: 500 }
    );
  }
}
