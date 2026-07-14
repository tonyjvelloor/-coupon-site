import { prisma } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Store as StoreIcon, Tags, Layers, Zap, Calendar } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour
export const metadata = {
  title: "Knowledge Index | CouponHub",
  description: "Explore our complete Commerce Intelligence Knowledge Graph. Browse merchants, categories, collections, and buying guides.",
};

export default async function KnowledgeIndexPage() {
  const [stores, categories, collections] = await Promise.all([
    prisma.store.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, offerCount: true },
      orderBy: { name: 'asc' }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    }),
    prisma.collection.findMany({
      where: { isIndexable: true },
      select: { name: true, slug: true, type: true },
      orderBy: { name: 'asc' }
    })
  ]);

  // We can group collections by type to simulate Banks, Events, etc. if they are modeled as collections
  const collectionsByType = collections.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, typeof collections>);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          Commerce Knowledge Graph
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Welcome to the CouponHub Knowledge Index. This directory contains every verified node in our intelligence graph, mapped and cross-linked for seamless discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Merchants */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <StoreIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Merchants</h2>
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
              {stores.length}
            </span>
          </div>
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {stores.map(store => (
              <li key={store.slug}>
                <Link 
                  href={`/stores/${store.slug}`} 
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{store.name}</span>
                  <span className="text-xs text-muted-foreground">{store.offerCount} offers</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Tags className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Categories</h2>
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
              {categories.length}
            </span>
          </div>
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map(category => (
              <li key={category.slug}>
                <Link 
                  href={`/categories/${category.slug}`} 
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Collection Types (Banks, Events, Guides) */}
        {Object.entries(collectionsByType).map(([type, items]) => {
          // Choose an icon based on the type
          let Icon = Zap;
          let title = type;
          if (type.toLowerCase().includes('bank')) { Icon = Zap; title = "Banks & Payments"; }
          if (type.toLowerCase().includes('event') || type.toLowerCase().includes('festival')) { Icon = Calendar; title = "Shopping Events"; }
          if (type.toLowerCase().includes('guide')) { Icon = BookOpen; title = "Buying Guides"; }

          return (
            <div key={type} className="border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold capitalize">{title}</h2>
                <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                  {items.length}
                </span>
              </div>
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <li key={item.slug}>
                    <Link 
                      href={`/collections/${item.slug}`} 
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="font-medium group-hover:text-primary transition-colors">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {/* Hardcoded Buying Guides cluster for demonstration, since they are usually StoreContent, 
            but for the Knowledge Graph we want to expose them as a distinct entity cluster */}
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Buying Guides</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            In-depth guides to help you make the best purchasing decisions.
          </p>
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {stores.slice(0, 5).map(store => (
              <li key={`guide-${store.slug}`}>
                <Link 
                  href={`/stores/${store.slug}/buying-guide`} 
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">{store.name} Buying Guide</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
