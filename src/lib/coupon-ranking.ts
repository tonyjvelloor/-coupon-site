export interface RankableCoupon {
    id: string;
    title: string;
    description?: string | null;
    code?: string | null;
    type?: string | null;
    discountType?: string | null;
    discountValue?: string | null;
    affiliateUrl: string;
    expiresAt?: Date | string | null;
    isVerified?: boolean;
    isExclusive?: boolean;
    isFeatured?: boolean;
    qualityScore?: number | null;
    clicks?: number | null;
    upvotes?: number | null;
    downvotes?: number | null;
    bank?: string | null;
    merchantName?: string;
    merchantSlug?: string;
    merchantLogo?: string | null;
    storeId?: string | null;
    createdAt?: Date | string | null;
    store?: {
        id?: string;
        slug?: string;
        name?: string;
        logo?: string | null;
        clicks?: number | null;
        isFeatured?: boolean;
        cashbackRate?: string | null;
    } | null;
    merchantIdentity?: {
        store?: {
            id?: string;
            slug?: string;
            name?: string;
            logo?: string | null;
            clicks?: number | null;
            isFeatured?: boolean;
            cashbackRate?: string | null;
        } | null;
    } | null;
}

const KNOWN_AFFILIATE_HOSTS = [
    "linksredirect.com",
    "clnk.in",
    "cuelinks.com",
    "amzn.to",
    "fktr.in",
    "fkrt.it",
    "ekaro.in",
    "earnkaro.com",
    "dpbolvw.net",
    "tkqlhce.com",
    "anrdoezrs.net",
    "jdoqocy.com",
    "kqzyfj.com",
    "ojrq.net",
    "sjv.io",
    "pxf.io",
    "evyy.net",
    "admitad.com",
    "ad.admitad.com",
    "vcommission.com",
    "inrdeals.com",
    "track.vcommission.com",
    "impact.com",
    "rstyle.me",
    "awin1.com",
    "shareasale.com",
];

// Priority high-EPC / high-demand Indian brands for tie-breaking
const PRIORITY_BRAND_SLUGS = new Set([
    "amazon",
    "flipkart",
    "myntra",
    "ajio",
    "nykaa",
    "nykaa-beauty",
    "tata-cliq",
    "croma-retail",
    "reliance-digital",
    "vijay-sales",
    "klook",
    "wellbeing-nutrition",
    "healthkart",
    "hyugalife",
    "swiggy",
    "zomato",
    "boat",
    "mivi",
    "gonoise",
    "levis",
    "uniqlo",
    "jockey",
    "bella-vita",
    "perfora",
    "the-derma-co",
    "air-india-express",
    "tripcom",
    "decathlon",
    "neemans",
]);

export function cleanCouponCode(code?: string | null): string | null {
    if (!code) return null;
    const trimmed = code.trim();
    if (!trimmed || trimmed.length < 2 || /^(none|null|n\/a|na|-+)$/i.test(trimmed)) {
        return null;
    }
    return trimmed;
}

/**
 * Formats raw DB discount values (e.g. "45" + "percentage", "2000" + "fixed")
 * into crisp, human-readable display badges ("45% OFF", "₹2,000 OFF").
 */
export function formatDiscountBadge(
    discountValue?: string | null,
    discountType?: string | null,
    title?: string | null
): string {
    const raw = (discountValue || "").trim();
    const type = (discountType || "").toLowerCase();

    if (raw) {
        // Already richly formatted (contains %, ₹, Rs, OFF, FREE, BOGO, From)
        if (/(%|₹|rs\.?|off|free|bogo|buy\s*\d|cashback|from)/i.test(raw)) {
            return raw.replace(/^rs\.?\s*/i, "₹").toUpperCase();
        }
        // Pure numeric value
        if (/^\d+(\.\d+)?$/.test(raw)) {
            const num = Number(raw);
            if (num > 0) {
                if (type === "percentage" || (type !== "fixed" && type !== "flat" && num <= 95)) {
                    return `${num}% OFF`;
                }
                return `₹${Math.round(num).toLocaleString("en-IN")} OFF`;
            }
        }
    }

    if (type === "free_shipping") return "FREE SHIPPING";
    if (type === "freebie") return "FREE GIFT";

    // Fallback: extract clean offer label from title
    if (title) {
        const bogo = title.match(/buy\s*\d+\s*get\s*\d+\s*free|bogo/i);
        if (bogo) return bogo[0].toUpperCase();

        const pct = title.match(/(?:up\s*to\s*|flat\s*|extra\s*)?(\d{1,2})\s*%\s*off/i);
        if (pct) return `${pct[1]}% OFF`;

        const inr = title.match(/(?:rs\.?|₹)\s*([\d,]+)\s*off/i);
        if (inr) return `₹${inr[1]} OFF`;

        if (/free\s*(delivery|shipping)/i.test(title)) return "FREE SHIPPING";
    }

    return "VERIFIED DEAL";
}

/**
 * Computes a normalized discount strength score (0..25) without concatenating
 * multiple numbers from strings like "10% off up to ₹500".
 */
export function parseNormalizedDiscountScore(
    discountValue?: string | null,
    discountType?: string | null,
    title?: string | null
): number {
    const type = (discountType || "").toLowerCase();
    const raw = (discountValue || "").trim();
    const text = `${raw} ${title || ""}`;

    // Check percentage first (1..90%)
    const pctMatch =
        raw.match(/^(\d{1,2})(?:\.\d+)?\s*%?$/) && (type === "percentage" || raw.includes("%"))
            ? raw.match(/^(\d{1,2})/)
            : text.match(/(\d{1,2})\s*%/);

    if (pctMatch) {
        const pct = Math.min(90, Math.max(0, parseInt(pctMatch[1], 10)));
        return Math.round((pct / 90) * 24);
    }

    // Check INR flat discount
    const inrMatch =
        raw.match(/^₹?\s*([\d,]+)$/) && (type === "fixed" || type === "flat" || Number(raw.replace(/,/g, "")) > 95)
            ? raw.match(/([\d,]+)/)
            : text.match(/(?:rs\.?|₹)\s*([\d,]+)/i);

    if (inrMatch) {
        const amt = parseInt(inrMatch[1].replace(/,/g, ""), 10);
        if (amt >= 3000) return 24;
        if (amt >= 1500) return 21;
        if (amt >= 500) return 17;
        if (amt >= 200) return 13;
        if (amt >= 50) return 9;
    }

    if (/bogo|buy\s*\d+\s*get\s*\d+/i.test(text) || type === "freebie") return 18;
    if (/free\s*(delivery|shipping)/i.test(text) || type === "free_shipping") return 11;

    return 5;
}

export function isBankStackableOffer(coupon: RankableCoupon): boolean {
    if (coupon.bank) return true;
    const text = `${coupon.title || ""} ${coupon.description || ""}`;
    return /\b(hdfc|icici|sbi|axis|kotak|mastercard|rupay|visa|amex|emi|upi|bank|card|neu\s*card)\b/i.test(text);
}

export function scoreCoupon(coupon: RankableCoupon, now: Date = new Date()): number {
    let score = 0;
    const code = cleanCouponCode(coupon.code);
    const storeSlug = coupon.merchantSlug || coupon.store?.slug || coupon.merchantIdentity?.store?.slug || "";
    const storeClicks = coupon.store?.clicks || coupon.merchantIdentity?.store?.clicks || 0;

    // 1. Copyable promo codes are the highest-converting asset on coupon sites
    if (code) {
        score += 38;
        // Clean short/readable codes perform better than long weird strings
        if (code.length >= 4 && code.length <= 16 && !/\s/.test(code)) {
            score += 4;
        }
    }

    // 2. Editorial & verification quality signals
    if (coupon.isExclusive) score += 12;
    if (coupon.isFeatured) score += 8;
    if (coupon.isVerified) score += 6;
    if (typeof coupon.qualityScore === "number" && coupon.qualityScore > 0) {
        score += Math.min(18, Math.round((coupon.qualityScore / 100) * 18));
    }

    // 3. Normalized savings magnitude
    score += parseNormalizedDiscountScore(coupon.discountValue, coupon.discountType, coupon.title);

    // 4. Bank stacking bonus (high AOV / high affiliate commission)
    if (isBankStackableOffer(coupon)) {
        score += 6;
    }

    // 5. High-EPC / high-demand brand priority
    if (storeSlug && PRIORITY_BRAND_SLUGS.has(storeSlug.toLowerCase())) {
        score += 14;
    }
    if (storeClicks > 0) {
        score += Math.min(8, Math.floor(Math.log10(storeClicks + 1) * 3));
    }

    // 6. Community feedback & click proof
    const netVotes = (coupon.upvotes || 0) - (coupon.downvotes || 0);
    if (netVotes > 0) score += Math.min(8, netVotes * 2);
    if (netVotes < 0) score -= Math.min(15, Math.abs(netVotes) * 4);

    // 7. Active freshness check
    if (coupon.expiresAt) {
        const exp = new Date(coupon.expiresAt);
        if (exp > now) {
            score += 10;
        } else {
            score -= 20;
        }
    } else {
        score += 6;
    }

    return score;
}

export function getOfferBadgeLabel(coupon: RankableCoupon, index: number): string | undefined {
    const code = cleanCouponCode(coupon.code);
    if (index === 0) return code ? "Best Verified Code" : "Top Featured Deal";
    if (coupon.isExclusive) return "Exclusive Offer";
    if (isBankStackableOffer(coupon)) return "Bank Offer";
    if (code && index < 3) return "Top Promo Code";
    return undefined;
}

export function rankCoupons<T extends RankableCoupon>(coupons: T[], now: Date = new Date()): Array<T & { _rankScore: number; _formattedDiscount: string }> {
    return [...coupons]
        .map((c) => ({
            ...c,
            code: cleanCouponCode(c.code),
            _rankScore: scoreCoupon(c, now),
            _formattedDiscount: formatDiscountBadge(c.discountValue, c.discountType, c.title),
        }))
        .sort((a, b) => b._rankScore - a._rankScore);
}

/**
 * Selects top-ranked coupons while ensuring merchant diversity (maxPerStore)
 * so Homepage and /best-offers spotlight the best codes across multiple top brands.
 */
export function selectDiverseTopCoupons<T extends RankableCoupon>(
    coupons: T[],
    limit: number = 8,
    maxPerStore: number = 1
): Array<T & { _rankScore: number; _formattedDiscount: string }> {
    const ranked = rankCoupons(coupons);
    const storeCounts = new Map<string, number>();
    const selected: Array<T & { _rankScore: number; _formattedDiscount: string }> = [];

    for (const coupon of ranked) {
        if (selected.length >= limit) break;
        const storeKey =
            coupon.merchantSlug ||
            coupon.store?.slug ||
            coupon.merchantIdentity?.store?.slug ||
            coupon.merchantName ||
            coupon.id;
        const count = storeCounts.get(storeKey) || 0;
        if (count >= maxPerStore) continue;

        storeCounts.set(storeKey, count + 1);
        selected.push(coupon);
    }

    // Backfill if diversity cap left fewer than limit
    if (selected.length < limit) {
        const selectedIds = new Set(selected.map((s) => s.id));
        for (const coupon of ranked) {
            if (selected.length >= limit) break;
            if (!selectedIds.has(coupon.id)) {
                selected.push(coupon);
                selectedIds.add(coupon.id);
            }
        }
    }

    return selected;
}

/**
 * Ensures every valid outbound HTTP(S) click is monetized and subid-attributed:
 * - Preserves already-monetized affiliate URLs and appends subid1 safely.
 * - Wraps plain merchant URLs through Cuelinks deep-linking (cid=302299) so zero clicks leak unmonetized.
 */
export function monetizeAffiliateUrl(rawUrl: string, subid: string, cuelinksId = "302299"): string | null {
    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return null;
    }

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return null;
    }

    const host = parsed.hostname.toLowerCase();
    const isAlreadyAffiliate =
        KNOWN_AFFILIATE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ||
        parsed.searchParams.has("tag") ||
        parsed.searchParams.has("affid") ||
        parsed.searchParams.has("subid") ||
        parsed.searchParams.has("subid1") ||
        parsed.searchParams.get("utm_medium")?.toLowerCase() === "affiliate";

    if (isAlreadyAffiliate) {
        if (!parsed.searchParams.has("subid1") && !parsed.searchParams.has("subid")) {
            parsed.searchParams.set("subid1", subid);
        }
        return parsed.toString();
    }

    // Auto-monetize direct merchant URLs through Cuelinks redirector with subid tracking
    const cuelinksUrl = new URL("https://linksredirect.com/");
    cuelinksUrl.searchParams.set("cid", cuelinksId);
    cuelinksUrl.searchParams.set("source", "linkkit");
    cuelinksUrl.searchParams.set("url", parsed.toString());
    cuelinksUrl.searchParams.set("subid", subid);
    return cuelinksUrl.toString();
}
