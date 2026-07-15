import { prisma } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Calendar, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";

export const revalidate = 3600;

export const metadata = {
  title: "Shopping Hub | CouponHub",
  description: "Expert buying guides, sale calendars, and smart shopping tips to help you maximize your savings.",
};

export default async function KnowledgeHubPage() {
  // Fetch data in parallel
  const [articles, storeGuides, saleEvents] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: { author: { select: { name: true } } }
    }),
    prisma.storeContent.findMany({
      where: { type: 'BUYING_GUIDE' },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      include: { store: { select: { name: true, slug: true, logo: true } } }
    }),
    prisma.collection.findMany({
      where: { 
        OR: [
          { type: 'SALE' },
          { type: 'EVENT' }
        ],
        isIndexable: true 
      },
      orderBy: { priority: 'desc' },
      take: 4
    })
  ]);

  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1);

  return (
    <div className="bg-surface-50 dark:bg-surface-950 min-h-screen pb-20">
      {/* Editorial Hero */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              The Shopping Hub
            </h1>
            <p className="text-xl text-surface-500 dark:text-surface-400">
              Expert advice, deep-dive buying guides, and comprehensive sale calendars. Never overpay again.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area (8 columns) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Featured Article */}
            {featuredArticle && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-primary w-6 h-6" /> Featured Story
                  </h2>
                </div>
                <Link href={`/knowledge/articles/${featuredArticle.slug}`} className="group block bg-white dark:bg-surface-900 rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md transition-all">
                  {featuredArticle.coverImage && (
                    <div className="aspect-[2/1] relative w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                      <Image 
                        src={featuredArticle.coverImage} 
                        alt={featuredArticle.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Strategy</span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      {featuredArticle.title}
                    </h3>
                    {featuredArticle.excerpt && (
                      <p className="text-surface-600 dark:text-surface-400 text-lg mb-6 line-clamp-2">
                        {featuredArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-sm font-medium text-surface-500">
                      <span>By {featuredArticle.author?.name || 'CouponHub Editors'}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredArticle.publishedAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Recent Articles Grid */}
            {recentArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Latest Tips & News</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recentArticles.map(article => (
                    <Link key={article.id} href={`/knowledge/articles/${article.slug}`} className="group block bg-white dark:bg-surface-900 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md transition-all">
                      {article.coverImage && (
                        <div className="aspect-[16/9] relative w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                          <Image 
                            src={article.coverImage} 
                            alt={article.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="text-xs font-medium text-surface-500 mt-4">
                          {article.publishedAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar (4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Buying Guides */}
            {storeGuides.length > 0 && (
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="text-primary w-5 h-5" /> Store Buying Guides
                </h3>
                <div className="space-y-4">
                  {storeGuides.map(guide => (
                    <Link key={guide.id} href={`/stores/${guide.store.slug}/buying-guide`} className="group flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 border border-surface-200 dark:border-surface-700 overflow-hidden relative">
                        {guide.store.logo ? (
                          <Image src={guide.store.logo} alt={guide.store.name} fill className="object-contain p-1" />
                        ) : (
                          <span className="text-sm font-bold">{guide.store.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors line-clamp-2">
                          How to save at {guide.store.name}
                        </h4>
                        <p className="text-xs text-surface-500 mt-1">Definitive Guide</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1">
                  View all guides <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Sale Calendars */}
            {saleEvents.length > 0 && (
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-primary w-5 h-5" /> Sale Calendars
                </h3>
                <div className="space-y-3">
                  {saleEvents.map(event => (
                    <Link key={event.id} href={`/collections/${event.slug}`} className="group block p-3 -mx-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                        {event.name}
                      </h4>
                      {event.seoDescription && (
                        <p className="text-xs text-surface-500 mt-1 line-clamp-1">{event.seoDescription}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="gradient-primary rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Never Miss a Loophole</h3>
              <p className="text-sm text-white/80 mb-4">Join 50,000+ smart shoppers getting our weekly strategy email.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Email address" className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
                <button type="button" className="w-full px-4 py-2.5 bg-white text-primary font-bold rounded-lg text-sm hover:bg-surface-50 transition-colors shadow-lg">
                  Subscribe
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
