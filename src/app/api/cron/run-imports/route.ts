import { NextRequest, NextResponse } from "next/server";
import { connectorRegistry } from "@/lib/import-engine/registry";
import { ImportPipeline } from "@/lib/import-engine/pipeline";
import { ImpactConnector } from "@/lib/import-engine/connectors/impact";
import { CJConnector } from "@/lib/import-engine/connectors/cj";
import { notificationEngine } from "@/lib/notifications";

// Ensure connectors are loaded in API context
const isDev = process.env.NODE_ENV !== "production";
connectorRegistry.register(new ImpactConnector(isDev));
connectorRegistry.register(new CJConnector(isDev));

export async function GET(request: NextRequest) {
  // Security: Ensure this is called by Vercel Cron or a trusted source
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connectors = connectorRegistry.list();
    const pipeline = new ImportPipeline();
    
    // Fire and forget so we don't block the cron request (Vercel has 10s limits on free tier, or 60s max)
    // NOTE: In a true long-running setup on Vercel Edge/Serverless, we might need a background queue (like Inngest/Upstash). 
    // For now, we spawn them concurrently.
    const runPromises = connectors.map(async (connector) => {
      try {
        await pipeline.run(connector, "v1.0");
      } catch (err) {
        console.error(`Scheduled run failed for ${connector.sourceId}:`, err);
        // The pipeline already notifies on failure, but we log it here just in case.
      }
    });
    
    // We await them if we want to ensure they finish, but serverless timeouts might kill them.
    // Better to use edge functions or defer. Since we aren't limited by Vercel in this mock environment, we await.
    await Promise.all(runPromises);

    return NextResponse.json({ 
      success: true, 
      message: `Scheduled import triggered for ${connectors.length} connectors.` 
    });
  } catch (error) {
    await notificationEngine.notify({
      title: "Cron Scheduler Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      level: "ERROR",
      source: "scheduler"
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scheduler failed" },
      { status: 500 }
    );
  }
}
