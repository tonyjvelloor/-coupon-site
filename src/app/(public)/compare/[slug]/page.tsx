import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert, Star, TrendingUp, HelpCircle, Package, Truck, Wallet, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  if (!slug.includes("-vs-")) return { title: "Compare | CouponHub" };

  const [slug1, slug2] = slug.split("-vs-");
  const store1 = await prisma.store.findUnique({ where: { slug: slug1 } });
  const store2 = await prisma.store.findUnique({ where: { slug: slug2 } });

  if (!store1 || !store2) return { title: "Compare | CouponHub" };

  return {
    title: `${store1.name} vs ${store2.name}: Which is better? | CouponHub`,
    description: `Compare ${store1.name} and ${store2.name} offers, cashback, shipping policies, returns, and student discounts side-by-side.`,
  };
}

export default async function ComparePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  if (!slug.includes("-vs-")) {
    notFound();
  }

  const [slug1, slug2] = slug.split("-vs-");

  // Fetch both stores in parallel
  const [store1, store2] = await Promise.all([
    prisma.store.findUnique({
      where: { slug: slug1 },
      include: {
        storeContents: true,
        coupons: { where: { expiresAt: { gt: new Date() } }, take: 3 }
      }
    }),
    prisma.store.findUnique({
      where: { slug: slug2 },
      include: {
        storeContents: true,
        coupons: { where: { expiresAt: { gt: new Date() } }, take: 3 }
      }
    })
  ]);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/" },
          { label: "Knowledge", href: "/knowledge" },
          { label: "Compare", href: "/compare" },
          { label: `${store1.name} vs ${store2.name}`, href: `/compare/${slug}` },
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
              {store1.coupons.map(coupon => (
                <li key={coupon.id} className="text-sm border rounded p-2 bg-background">
                  <div className="font-semibold">{coupon.title}</div>
                  {coupon.code && <div className="text-xs text-muted-foreground mt-1 bg-muted inline-block px-1 rounded">Code: {coupon.code}</div>}
                </li>
              ))}
              {store1.coupons.length === 0 && <span className="text-sm text-muted-foreground">No active offers currently.</span>}
            </ul>
          </div>
          <div className="p-4 md:border-l">
            <ul className="space-y-3">
              {store2.coupons.map(coupon => (
                <li key={coupon.id} className="text-sm border rounded p-2 bg-background">
                  <div className="font-semibold">{coupon.title}</div>
                  {coupon.code && <div className="text-xs text-muted-foreground mt-1 bg-muted inline-block px-1 rounded">Code: {coupon.code}</div>}
                </li>
              ))}
              {store2.coupons.length === 0 && <span className="text-sm text-muted-foreground">No active offers currently.</span>}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Verdict</h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Both <span className="text-primary font-semibold">{store1.name}</span> and <span className="text-primary font-semibold">{store2.name}</span> offer competitive deals. 
          {store1Score > store2Score ? ` However, based on our knowledge graph signals and active offer count, ${store1.name} edges out slightly in terms of overall shopping intelligence score.` : 
           store2Score > store1Score ? ` However, based on our knowledge graph signals and active offer count, ${store2.name} edges out slightly in terms of overall shopping intelligence score.` : 
           ` They are tied in terms of our knowledge graph intelligence scores.`}
        </p>
      </div>

    </div>
  );
}
