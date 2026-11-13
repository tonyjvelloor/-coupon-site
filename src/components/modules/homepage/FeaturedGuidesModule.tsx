import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, ShieldCheck, CreditCard } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-data";

export async function FeaturedGuidesModule() {
    let posts: any[] = [];
    try {
        posts = await getAllBlogPosts();
    } catch {
        posts = [];
    }

    const featured = posts.slice(0, 4);

    return (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        Editorial Guides &amp; Consumer Research
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        Latest Shopping Guides &amp; Sale Analysis
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl">
                        Original breakdowns of Indian sale events, credit card discount caps, and checkout stacking strategies.
                    </p>
                </div>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-indigo hover:text-indigo-700 shrink-0"
                >
                    <span>All {posts.length} Guides</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {featured.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {featured.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-brand-indigo/30 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-xs font-semibold text-slate-500 block mb-2">
                                    {post.publishedAt
                                        ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "Editorial Guide"}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors line-clamp-2 mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                    {post.seoDescription || "Read the full savings guide, discount rules, and stacking tips."}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo">
                                Read Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            {/* Consumer Education & Tools Strip */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-brand-indigo flex items-center justify-center mb-3">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Interactive Savings Calculators
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Don&apos;t guess whether a 10% instant bank discount beats a 5% cashback card or No-Cost EMI. Check real post-GST totals before paying.
                        </p>
                        <Link
                            href="/tools/card-vs-cashback-calculator"
                            className="inline-flex items-center gap-1 text-sm font-bold text-brand-indigo hover:underline pt-1"
                        >
                            Open Card vs. Cashback Calculator <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Indian Bank &amp; Store Comparisons
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Compare HDFC, ICICI, SBI, and Axis Bank promotional rules alongside side-by-side platform breakdowns like Amazon vs. Flipkart and Myntra vs. AJIO.
                        </p>
                        <Link
                            href="/compare"
                            className="inline-flex items-center gap-1 text-sm font-bold text-brand-indigo hover:underline pt-1"
                        >
                            Compare Top Stores <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-3">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Transparent Verification &amp; Disclosures
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Learn how we verify merchant feeds, expire stale promo codes, and fund CouponHub via disclosed affiliate links and advertising.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-1">
                            <Link href="/how-we-verify" className="text-sm font-bold text-brand-indigo hover:underline">
                                How We Verify
                            </Link>
                            <Link href="/editorial-policy" className="text-sm font-bold text-brand-indigo hover:underline">
                                Editorial Policy
                            </Link>
                            <Link href="/disclosure" className="text-sm font-bold text-brand-indigo hover:underline">
                                Disclosure
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
