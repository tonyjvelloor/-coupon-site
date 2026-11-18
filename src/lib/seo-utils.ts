/**
 * Shared SEO utilities for metadata freshness, URL normalization,
 * and crawl-budget quality gates.
 */

const FULL_MONTH_YEAR_RE =
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+202\d\b/gi;

const SHORT_MONTH_YEAR_RE =
  /\b(?:Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)\.?\s+202\d\b/gi;

export const MIN_STORE_OFFERS_FOR_SUBPAGES = 5;

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store").replace(/\/$/, "");
}

export function getCurrentMonthYear(date: Date = new Date()): {
  fullMonthYear: string;
  shortMonthYear: string;
} {
  const fullMonthYear = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(date);

  const shortMonthYear = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);

  return { fullMonthYear, shortMonthYear };
}

/**
 * Replaces stale month-year patterns (e.g. "September 2026" or "Sep 2026")
 * in stored DB SEO titles/descriptions with the current month and year.
 */
export function refreshSeoDate(text: string, date: Date = new Date()): string {
  if (!text) return text;
  const { fullMonthYear, shortMonthYear } = getCurrentMonthYear(date);
  return text
    .replace(FULL_MONTH_YEAR_RE, fullMonthYear)
    .replace(SHORT_MONTH_YEAR_RE, shortMonthYear);
}

/**
 * Strips redundant "| CouponHub", "| CouponHub India", or "| CouponHub by TheBrandManiacs"
 * suffixes when RootLayout's title.template already appends "| CouponHub India".
 */
export function cleanSeoTitle(text: string, date: Date = new Date()): string {
  if (!text) return text;
  return refreshSeoDate(text, date)
    .replace(/\s*\|\s*CouponHub(?:\s+India|\s+by\s+TheBrandManiacs)?$/i, "")
    .trim();
}

/**
 * Crawl-budget gate: only index store subpages (returns, shipping, student-discount,
 * split buying-guide/FAQ) for stores with sufficient active offer demand and text depth.
 */
export function isStoreSubpageIndexable(
  activeOfferCount: number | null | undefined,
  content?: string | null,
  minWords = 80
): boolean {
  if ((activeOfferCount ?? 0) < MIN_STORE_OFFERS_FOR_SUBPAGES) {
    return false;
  }
  if (!content) return false;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return words >= minWords;
}
