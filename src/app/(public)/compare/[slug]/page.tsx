import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Star, TrendingUp, HelpCircle, Package, Truck, Wallet, Shield } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";
import { CURATED_COMPARE_PAIRS } from "@/lib/compare-pairs";
import { getSiteUrl, getCurrentMonthYear } from "@/lib/seo-utils";
import { getFallbackCompareStore } from "@/lib/fallback-catalog";

export const revalidate = 86400; // 24h — compare pages are stable

export async function generateStaticParams() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return CURATED_COMPARE_PAIRS.map((pair) => ({ slug: pair.slug }));
  } catch {
    console.warn("DB unavailable during build; deferring /compare/[slug] to ISR on-demand");
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!slug.includes("-vs-")) return { title: "Compare Stores", robots: { index: false, follow: true } };

  const [slug1, slug2] = slug.split("-vs-");
  let store1: any = null;
  let store2: any = null;
  try {
    [store1, store2] = await Promise.all([
      prisma.store.findUnique({ where: { slug: slug1 }, select: { name: true, cashbackRate: true, activeOfferCount: true } }),
      prisma.store.findUnique({ where: { slug: slug2 }, select: { name: true, cashbackRate: true, activeOfferCount: true } }),
    ]);
  } catch (e) {
    store1 = getFallbackCompareStore(slug1);
    store2 = getFallbackCompareStore(slug2);
  }

  if (!store1 || !store2) return { title: "Compare Brands & Coupons", robots: { index: false, follow: true } };

  const siteUrl = getSiteUrl();
  const { shortMonthYear } = getCurrentMonthYear();
  const isCurated = CURATED_COMPARE_PAIRS.some((p) => p.slug === slug);
  const title = `${store1.name} vs ${store2.name}: Coupons & Offers (${shortMonthYear})`;
  const description = `${store1.name} (${store1.activeOfferCount} live offers) vs ${store2.name} (${store2.activeOfferCount} live offers). Compare verified promo codes, shipping, returns, and bank card discounts side-by-side.`;

  return {
    title,
    description,
    robots: { index: isCurated, follow: true },
    alternates: { canonical: `${siteUrl}/compare/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/compare/${slug}`,
      siteName: "CouponHub India",
      type: "website",
    },
  };
}


export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug.includes("-vs-")) {
    notFound();
  }

  const [slug1, slug2] = slug.split("-vs-");

  let store1: any = null;
  let store2: any = null;

  try {
    // Fetch both stores in a single query to avoid connection-pool contention during build/SSR
    const stores = await prisma.store.findMany({
      where: { slug: { in: [slug1, slug2] } },
      include: {
        storeContents: true,
        merchantIdentity: {
          include: {
            coupons: {
              where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
              take: 3
            }
          }
        }
      }
    });
    store1 = stores.find((s) => s.slug === slug1) ?? null;
    store2 = stores.find((s) => s.slug === slug2) ?? null;
  } catch (err) {
    console.warn(`[compare/${slug}] DB query failed, using fallback stores:`, err);
    store1 = getFallbackCompareStore(slug1);
    store2 = getFallbackCompareStore(slug2);
  }

  if (!store1 || !store2) {
    notFound();
  }

  // Helper to extract content snippet
  const getContentSnippet = (store: any, type: string) => {
    const content = store.storeContents.find((c: any) => c.type === type);
    if (!content) return "Not specified";
    // take first 100 chars and strip HTML tags (basic)
    const stripped = content.content.replace(/<[^>]*>?/gm, '');
    return stripped.substring(0, 100) + (stripped.length > 100 ? '...' : '');
  };

  const getEvidenceScore = (store: any) => {
    let score = 50; // base score
    if (store.offerCount > 10) score += 10;
    if (store.storeContents.length > 2) score += 20;
    if (store.cashbackRate) score += 10;
    if (store.knowledgeDensity > 0.5) score += 10;
    return Math.min(100, score);
  };

  const store1Score = getEvidenceScore(store1);
  const store2Score = getEvidenceScore(store2);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.couponhub.store";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs 
        items={[
          { name: "Home", href: "/" },
          { name: "Knowledge", href: "/knowledge" },
          { name: "Compare", href: "/compare" },
          { name: `${store1.name} vs ${store2.name}`, href: `/compare/${slug}` },
        ]} 
      />

      <div className="mt-8 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-primary">{store1.name}</span> vs <span className="text-primary">{store2.name}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A definitive, side-by-side comparison of policies, active offers, and overall shopping experience based on verified data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Store 1 Header */}
        <div className="bg-card border rounded-2xl p-8 text-center relative overflow-hidden">
          {store1Score > store2Score && (
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" /> Winner
            </div>
          )}
          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden">
             {store1.logo ? <img src={store1.logo} alt={store1.name} className="w-full h-full object-cover" /> : store1.name.substring(0, 1)}
          </div>
          <h2 className="text-3xl font-bold mb-2">{store1.name}</h2>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> {store1Score}% Trust Score</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> {store1.offerCount} Offers</span>
          </div>
          <Link href={`/stores/${store1.slug}`}>
            <Button variant="outline" className="w-full">View Store Profile</Button>
          </Link>
        </div>

        {/* Store 2 Header */}
        <div className="bg-card border rounded-2xl p-8 text-center relative overflow-hidden">
           {store2Score > store1Score && (
            <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" /> Winner
            </div>
          )}
          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden">
             {store2.logo ? <img src={store2.logo} alt={store2.name} className="w-full h-full object-cover" /> : store2.name.substring(0, 1)}
          </div>
          <h2 className="text-3xl font-bold mb-2">{store2.name}</h2>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> {store2Score}% Trust Score</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> {store2.offerCount} Offers</span>
          </div>
          <Link href={`/stores/${store2.slug}`}>
            <Button variant="outline" className="w-full">View Store Profile</Button>
          </Link>
        </div>
      </div>

      {/* Structured Comparison Data */}
      <div className="bg-card border rounded-2xl overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 border-b bg-muted/30">
          <div className="p-4 font-semibold text-muted-foreground hidden md:block">Comparison Criteria</div>
          <div className="p-4 font-bold text-center border-l border-r md:border-r-0 md:border-l">{store1.name}</div>
          <div className="p-4 font-bold text-center border-l">{store2.name}</div>
        </div>

        {/* Cashback */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b hover:bg-muted/30 transition-colors">
          <div className="p-4 font-medium flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> Cashback</div>
          <div className="p-4 md:border-l md:border-r text-center">{store1.cashbackRate ? `${store1.cashbackRate} ${store1.cashbackType || ''}` : 'No standard cashback'}</div>
          <div className="p-4 md:border-l text-center">{store2.cashbackRate ? `${store2.cashbackRate} ${store2.cashbackType || ''}` : 'No standard cashback'}</div>
        </div>

        {/* Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b hover:bg-muted/30 transition-colors">
          <div className="p-4 font-medium flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Shipping Policy</div>
          <div className="p-4 md:border-l md:border-r text-sm text-center">{getContentSnippet(store1, 'SHIPPING')}</div>
          <div className="p-4 md:border-l text-sm text-center">{getContentSnippet(store2, 'SHIPPING')}</div>
        </div>

        {/* Returns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b hover:bg-muted/30 transition-colors">
          <div className="p-4 font-medium flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Returns & Refunds</div>
          <div className="p-4 md:border-l md:border-r text-sm text-center">{getContentSnippet(store1, 'RETURNS')}</div>
          <div className="p-4 md:border-l text-sm text-center">{getContentSnippet(store2, 'RETURNS')}</div>
        </div>

        {/* Student Discount */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b hover:bg-muted/30 transition-colors">
          <div className="p-4 font-medium flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" /> Student Discount</div>
          <div className="p-4 md:border-l md:border-r text-sm text-center">{getContentSnippet(store1, 'STUDENT')}</div>
          <div className="p-4 md:border-l text-sm text-center">{getContentSnippet(store2, 'STUDENT')}</div>
        </div>

        {/* Top Offers */}
        <div className="grid grid-cols-1 md:grid-cols-3 hover:bg-muted/30 transition-colors">
          <div className="p-4 font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Active Offers</div>
          <div className="p-4 md:border-l md:border-r">
            <ul className="space-y-3">
              {(store1.merchantIdentity?.coupons || []).map((coupon: any) => (
                <li key={coupon.id} className="text-sm border rounded-lg p-2.5 bg-background flex flex-col gap-1.5">
                  <div className="font-semibold">{coupon.title}</div>
                  <div className="flex items-center justify-between gap-2">
                    {coupon.code ? (
                      <span className="text-xs font-mono font-bold text-primary bg-muted px-1.5 py-0.5 rounded">Code: {coupon.code}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto-applied deal</span>
                    )}
                    <a
                      href={`/out?url=${encodeURIComponent(coupon.affiliateUrl || store1.website)}&storeId=${encodeURIComponent(store1.slug)}&couponId=${encodeURIComponent(coupon.id)}&source=compare-table`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline shrink-0"
                    >
                      Claim →
                    </a>
                  </div>
                </li>
              ))}
              {(store1.merchantIdentity?.coupons || []).length === 0 && <span className="text-sm text-muted-foreground">No active offers currently.</span>}
            </ul>
          </div>
          <div className="p-4 md:border-l">
            <ul className="space-y-3">
              {(store2.merchantIdentity?.coupons || []).map((coupon: any) => (
                <li key={coupon.id} className="text-sm border rounded-lg p-2.5 bg-background flex flex-col gap-1.5">
                  <div className="font-semibold">{coupon.title}</div>
                  <div className="flex items-center justify-between gap-2">
                    {coupon.code ? (
                      <span className="text-xs font-mono font-bold text-primary bg-muted px-1.5 py-0.5 rounded">Code: {coupon.code}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto-applied deal</span>
                    )}
                    <a
                      href={`/out?url=${encodeURIComponent(coupon.affiliateUrl || store2.website)}&storeId=${encodeURIComponent(store2.slug)}&couponId=${encodeURIComponent(coupon.id)}&source=compare-table`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline shrink-0"
                    >
                      Claim →
                    </a>
                  </div>
                </li>
              ))}
              {(store2.merchantIdentity?.coupons || []).length === 0 && <span className="text-sm text-muted-foreground">No active offers currently.</span>}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold mb-4">Editorial Verdict &amp; How to Pick</h3>
        <p className="text-base text-muted-foreground leading-relaxed mb-4">
          Both <span className="text-primary font-semibold">{store1.name}</span> and <span className="text-primary font-semibold">{store2.name}</span> run frequent seasonal campaigns in India.{" "}
          {store1Score > store2Score
            ? `${store1.name} currently holds a slight edge in active deal coverage (${store1.activeOfferCount || store1.offerCount} verified offers) and policy documentation.`
            : store2Score > store1Score
            ? `${store2.name} currently holds a slight edge in active deal coverage (${store2.activeOfferCount || store2.offerCount} verified offers) and policy documentation.`
            : `Both platforms score closely on active offer availability and published shopping policies.`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
          <div className="p-4 rounded-xl bg-muted/40 border">
            <strong className="text-foreground block mb-1">1. Check Bank Card Instant Discounts</strong>
            Before finalizing your cart on either {store1.name} or {store2.name}, compare whether a 10% instant discount cap from HDFC, ICICI, SBI, or Axis Bank beats an uncapped cashback card.
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border">
            <strong className="text-foreground block mb-1">2. Factor Return Windows &amp; Shipping Minimums</strong>
            On high-ticket purchases, an extra few days of return coverage or free shipping threshold can outweigh a small flat coupon difference. Check live{" "}
            <Link href="/tools/card-vs-cashback-calculator" className="text-primary font-semibold underline">
              net checkout totals with our Card vs. Cashback Calculator
            </Link>.
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/stores/${store1.slug}`}>
            <Button>Browse {store1.name} Coupons</Button>
          </Link>
          <Link href={`/stores/${store2.slug}`}>
            <Button variant="outline">Browse {store2.name} Coupons</Button>
          </Link>
          <Link href="/compare">
            <Button variant="outline">All Store Comparisons</Button>
          </Link>
        </div>
      </div>

      {/* Structured Data: Comparison Breadcrumbs & FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Knowledge",
                item: `${siteUrl}/knowledge`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Compare",
                item: `${siteUrl}/compare`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: `${store1.name} vs ${store2.name}`,
                item: `${siteUrl}/compare/${slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `Which is better, ${store1.name} or ${store2.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${store1.name} has ${store1.activeOfferCount || 0} active offers and verified deals, while ${store2.name} has ${store2.activeOfferCount || 0} active offers. Both platforms have verified shipping, return policies, and promo codes tracked on CouponHub.`,
                },
              },
              {
                "@type": "Question",
                name: `Does ${store1.name} or ${store2.name} offer better cashback in India?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${store1.name} offers ${store1.cashbackRate || "exclusive deals"} on CouponHub, whereas ${store2.name} offers ${store2.cashbackRate || "exclusive deals"}. Users can also combine bank cards for instant discounts.`,
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
