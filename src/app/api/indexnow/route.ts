import { NextRequest, NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "6d4c97b00f904f008ab1f87f8990aadc";


const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

/**
 * POST /api/indexnow  Body: { urls: string[] }
 * GET  /api/indexnow?url=/stores/off-duty
 * Submits URLs to Google/Bing for fast indexing via IndexNow protocol.
 */
export async function POST(req: NextRequest) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json({ ok: false, reason: "INDEXNOW_KEY not configured" });
  }

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

  const absoluteUrls = urls.map((u) =>
    u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`
  );

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: absoluteUrls,
  };

  const results: Record<string, number> = {};
  await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
        });
        results[endpoint] = res.status;
      } catch {
        results[endpoint] = 0;
      }
    })
  );

  console.log(`[IndexNow] Submitted ${absoluteUrls.length} URLs:`, results);
  return NextResponse.json({ ok: true, submitted: absoluteUrls.length, urls: absoluteUrls, results });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ ok: false, reason: "?url= param required" }, { status: 400 });
  const forwarded = new NextRequest(req.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: [url] }),
  });
  return POST(forwarded);
}
