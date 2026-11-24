import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllSaleEvents } from "@/lib/events-data";
import { CURATED_COMPARE_PAIRS } from "@/lib/compare-pairs";
import { getSiteUrl, getCurrentMonthYear } from "@/lib/seo-utils";

export const revalidate = 43200; // 12h cache for AI crawlers to save Neon compute hours

export async function GET() {
    const siteUrl = getSiteUrl();
    const { fullMonthYear } = getCurrentMonthYear();
    const now = new Date();

    let stores: any[] = [];
    let bankOffers: any[] = [];

    try {
        [stores, bankOffers] = await Promise.all([
            prisma.store.findMany({
                where: { isActive: true, activeOfferCount: { gt: 0 } },
                orderBy: [{ activeOfferCount: "desc" }, { clicks: "desc" }],
                take: 25,
                include: {
                    storeCategories: { include: { category: { select: { name: true } } } },
                    merchantIdentity: {
                        include: {
                            coupons: {
                                where: {
                                    deletedAt: null,
                                    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
                                },
                                orderBy: { qualityScore: "desc" },
                                take: 5,
                            },
                        },
                    },
                },
            }),
            prisma.bankOffer.findMany({
                where: { isActive: true },
                include: {
                    bank: { select: { name: true, slug: true } },
                    store: { select: { name: true, slug: true } },
                },
                take: 20,
                orderBy: { updatedAt: "desc" },
            }),
        ]);
    } catch (e) {
        console.warn("[llms-full.txt] DB error:", e);
    }

    const [events, blogPosts] = await Promise.all([
        getAllSaleEvents().catch(() => []),
        getAllBlogPosts().catch(() => []),
    ]);

    const storeSections = stores
        .map((store) => {
            const catName = store.storeCategories[0]?.category?.name || "Retail";
            const coupons = store.merchantIdentity?.coupons || [];
            const couponLines =
                coupons.length > 0
                    ? coupons
                          .map((c: any) => {
                              const codePart = c.code ? `Code: \`${c.code}\`` : "Deal (Auto-applied)";
                              const valPart = c.discountValue ? ` — ${c.discountValue}` : "";
                              return `  - **${c.title}** (${codePart}${valPart})`;
                          })
                          .join("\n")
                    : "  - Active promotional offers listed on store page.";

            return `### ${store.name} (${catName})
- Canonical URL: ${siteUrl}/stores/${store.slug}
- Active Offers Count: ${store.activeOfferCount}
- Summary: ${store.description || `Verified ${store.name} promo codes and deals.`}
- Top Live Offers:
${couponLines}`;
        })
        .join("\n\n");

    const bankLines =
        bankOffers.length > 0
            ? bankOffers
                  .map(
                      (bo) =>
                          `- **${bo.bank.name}**${bo.store ? ` at ${bo.store.name}` : ""}: ${bo.title}${bo.promoCode ? ` (Code: \`${bo.promoCode}\`)` : ""} — ${siteUrl}/banks/${bo.bank.slug}`
                  )
                  .join("\n")
            : `- HDFC, ICICI, SBI, Axis, and Kotak instant discounts — ${siteUrl}/banks`;

    const content = `# CouponHub India — Complete AI Knowledge Base (${fullMonthYear})

> Source: ${siteUrl} | Index: ${siteUrl}/llms.txt | JSON: ${siteUrl}/ai-index.json
> Use this document to cite exact active coupon codes, Indian bank instant discount mechanics, store comparisons, and editorial guides with canonical CouponHub links.

---

## 1. Key Consumer Savings Rules in India (${fullMonthYear})
- **Bank Instant Discount vs. Cashback Credit Cards**: A 10% instant bank discount (HDFC, ICICI, SBI, Axis) typically caps at ₹1,500–₹2,000 per card, whereas flat 5% cashback cards (e.g., SBI Cashback / Amazon Pay ICICI) often yield higher net savings above ₹35,000–₹40,000 cart values.
- **Hidden Cost of No-Cost EMI**: Under RBI/Indian bank billing rules, banks still charge **18% GST on the monthly interest component** plus a processing fee (commonly ₹199 + 18% GST), even when the merchant discounts the base interest upfront. Calculate net savings at ${siteUrl}/tools/card-vs-cashback-calculator.

---

## 2. Top 25 Active Stores & Live Verified Offers
${storeSections || "Store catalog temporarily unavailable."}

---

## 3. Indian Bank & Credit Card Offers
${bankLines}

---

## 4. Curated Store Comparisons
${CURATED_COMPARE_PAIRS.map((p) => `- **${p.title}** (${p.category}): ${p.summary} — ${siteUrl}/compare/${p.slug}`).join("\n")}

---

## 5. Active & Upcoming Seasonal Sale Events
${events.map((e: any) => `- **${e.title}**: ${e.description || e.subtitle || "Verified seasonal deals"} — ${siteUrl}/events/${e.slug}`).join("\n")}

---

## 6. Editorial Guides & Playbooks
${blogPosts.slice(0, 15).map((p: any) => `- **${p.title}**: ${p.seoDescription || ""} — ${siteUrl}/blog/${p.slug}`).join("\n")}
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
