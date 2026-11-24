import { NextRequest, NextResponse } from "next/server";
import { connectorRegistry } from "@/lib/import-engine/registry";
import { ImportPipeline } from "@/lib/import-engine/pipeline";
import { ImpactConnector } from "@/lib/import-engine/connectors/impact";
import { CJConnector } from "@/lib/import-engine/connectors/cj";
import { CuelinksConnector } from "@/lib/import-engine/connectors/cuelinks/cuelinks.connector";
import { notificationEngine } from "@/lib/notifications";
import { runCouponScoringAndIndexNow } from "@/lib/services/coupon-maintenance.service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Security: Ensure this is called by Vercel Cron or a trusted source
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    token !== process.env.CRON_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Register ONLY configured connectors so unconfigured providers don't waste Neon compute wakeups
    const isDev = process.env.NODE_ENV !== "production";
    if (process.env.CUELINKS_API_KEY) {
      connectorRegistry.register(new CuelinksConnector());
    }
    if (process.env.CJ_API_TOKEN) {
      connectorRegistry.register(new CJConnector(isDev));
    }
    if (process.env.IMPACT_ACCOUNT_SID && process.env.IMPACT_AUTH_TOKEN) {
      connectorRegistry.register(new ImpactConnector(isDev) as any);
    }

    const connectors = connectorRegistry.list();
    const pipeline = new ImportPipeline();

    for (const connector of connectors) {
      try {
        await pipeline.run(connector, "v1.0");
      } catch (err) {
        const c = connector as any;
        const cid = c.sourceId || c.id || c.manifest?.id;
        console.error(`Scheduled run failed for ${cid}:`, err);
      }
    }

    // Automatically re-score best coupons, sync store counts, and ping IndexNow
    let maintenance = null;
    try {
      maintenance = await runCouponScoringAndIndexNow();
    } catch (maintErr) {
      console.warn("[Cron] Post-import coupon scoring skipped:", maintErr);
    }

    return NextResponse.json({
      success: true,
      message: `Scheduled import complete for ${connectors.length} active connector(s).`,
      maintenance,
    });
  } catch (error) {
    await notificationEngine.notify({
      title: "Cron Scheduler Failed",
      message: error instanceof Error ? error.message : "Unknown error",
      level: "ERROR",
      source: "scheduler",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scheduler failed" },
      { status: 500 }
    );
  }
}
