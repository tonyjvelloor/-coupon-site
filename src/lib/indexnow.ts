import { getSiteUrl } from "./seo-utils";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "6d4c97b00f904f008ab1f87f8990aadc";

const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export interface IndexNowResult {
  ok: boolean;
  reason?: string;
  submitted: number;
  urls: string[];
  results: Record<string, number>;
}

/**
 * Submits one or more site URLs to IndexNow endpoints (Bing, IndexNow API)
 * for rapid crawling and search index updates. Non-throwing for safe fire-and-forget usage.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (!INDEXNOW_KEY) {
    return { ok: false, reason: "INDEXNOW_KEY not configured", submitted: 0, urls: [], results: {} };
  }

  const uniqueInputs = Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean)));
  if (uniqueInputs.length === 0) {
    return { ok: false, reason: "No URLs provided", submitted: 0, urls: [], results: {} };
  }

  const siteUrl = getSiteUrl();
  const absoluteUrls = uniqueInputs.map((u) =>
    u.startsWith("http") ? u : `${siteUrl}${u.startsWith("/") ? "" : "/"}${u}`
  );

  const payload = {
    host: new URL(siteUrl).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
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

  console.log(`[IndexNow] Submitted ${absoluteUrls.length} URL(s):`, results);
  return {
    ok: true,
    submitted: absoluteUrls.length,
    urls: absoluteUrls,
    results,
  };
}
