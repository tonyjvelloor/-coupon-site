import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * POST /api/indexnow  Body: { urls: string[] }
 * GET  /api/indexnow?url=/stores/off-duty
 * Submits URLs to Bing/IndexNow endpoints for fast indexing.
 */
export async function POST(req: NextRequest) {
  let urls: string[] = [];
  try {
    const body = await req.json();
    urls = Array.isArray(body.urls) ? body.urls : [];
  } catch {
    return NextResponse.json({ ok: false, reason: "Invalid JSON body" }, { status: 400 });
  }

  if (urls.length === 0) {
    return NextResponse.json({ ok: false, reason: "No URLs provided" }, { status: 400 });
  }

  const result = await submitToIndexNow(urls);
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ok: false, reason: "?url= param required" }, { status: 400 });
  }

  const result = await submitToIndexNow([url]);
  return NextResponse.json(result);
}
