import { NextRequest, NextResponse } from "next/server";
import { AnomalyDetector } from "@/lib/monitoring/anomaly-detector";

export async function GET(request: NextRequest) {
  // In production, verify auth headers/cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // For testing we won't strictly enforce it unless CRON_SECRET is set
      if (process.env.CRON_SECRET) {
          return new Response('Unauthorized', { status: 401 });
      }
  }

  try {
    const detector = new AnomalyDetector();
    await detector.runDailyChecks();
    
    return NextResponse.json({ success: true, message: "Anomaly detection complete" });
  } catch (error) {
    console.error("Anomaly Detection failed:", error);
    return NextResponse.json({ error: "Failed to run anomaly detection" }, { status: 500 });
  }
}
