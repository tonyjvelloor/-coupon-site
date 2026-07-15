import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Share2 } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true, coverImage: true }
  });

  if (!article) return { title: "Article Not Found" };

  return {
    title: article.seoTitle || `${article.title} | CouponHub`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      images: article.coverImage ? [article.coverImage] : [],
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { author: true }
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-surface-950 min-h-screen">
      
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/knowledge" className="inline-flex items-center gap-2 text-sm font-bold text-surface-500 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
        </Link>
        
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Shopping Strategy</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-lg font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-surface-200 dark:border-surface-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center overflow-hidden relative border border-surface-300 dark:border-surface-700">
                {article.author.profileImage ? (
                  <Image src={article.author.profileImage} alt={article.author.name || 'Author'} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold">{article.author.name?.charAt(0) || 'A'}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{article.author.name || 'CouponHub Editors'}</div>
                <div className="text-xs text-surface-500 flex items-center gap-1">
                  {article.publishedAt?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-sm font-semibold text-surface-600 dark:text-surface-400 hover:text-primary transition-colors bg-surface-100 dark:bg-surface-900 px-4 py-2 rounded-full border border-surface-200 dark:border-surface-800">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
          <div className="aspect-[21/9] w-full relative rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-headline-lg prose-a:text-primary prose-img:rounded-xl">
          {/* Note: In a real implementation, you would parse the markdown/html here. */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Newsletter Footer */}
        <div className="mt-16 bg-surface-50 dark:bg-surface-900 rounded-3xl p-8 sm:p-12 text-center border border-surface-200 dark:border-surface-800">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Smarter shopping, delivered.</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6 max-w-md mx-auto">Get our best tips, loopholes, and exclusive deals sent to your inbox every week. No spam.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-950 focus:ring-2 focus:ring-primary outline-none" required />
            <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
