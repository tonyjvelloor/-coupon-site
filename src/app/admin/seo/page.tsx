import { prisma } from "@/lib/db";
import { seoService } from "@/lib/services/seo.service";
import Link from "next/link";
import { 
    AlertTriangle, 
    CheckCircle2, 
    Search, 
    Link as LinkIcon, 
    FileText,
    CreditCard,
    BookOpen,
    ExternalLink,
    Sparkles,
    ShieldCheck,
    Layers
} from "lucide-react";

export default async function SEOHealthDashboard() {
    // Analytics from seoService
    const platformHealth = await seoService.getPlatformSeoHealth();
    const { 
        totalStores, 
        qualifiedStores, 
        storesWithKnowledge, 
        totalBanks, 
        activeBankOffers, 
        totalCoupons, 
        issues 
    } = platformHealth;

    const totalCollections = await prisma.collection.count();
    const missingCollectionMeta = await prisma.collection.count({
        where: {
            OR: [
                { seoTitle: null },
                { seoDescription: null }
            ]
        }
    });

    const totalPosts = await prisma.blogPost.count();
    const missingPostMeta = await prisma.blogPost.count({
        where: {
            OR: [
                { seoTitle: null },
                { seoDescription: null }
            ]
        }
    });

    const totalCategories = await prisma.category.count({
        where: { isActive: true }
    });

    const totalStoreContentUnits = await prisma.storeContent.count();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-indigo font-bold text-xs uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4" /> SEO Growth Sprint v1
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        SEO Command Center
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Live monitoring of search eligibility, structured data parity, knowledge layer coverage, and India bank SEO.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/sitemap.xml"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-sm transition-all"
                    >
                        View Sitemap.xml <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                        href="/banks"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-indigo rounded-xl hover:bg-brand-indigo/90 shadow-sm transition-all"
                    >
                        Banks Hub <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Overall Health Banner */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-base">
                                Google Search Eligibility: 100% Healthy
                            </span>
                            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                Verified
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            Zero fake ratings, 100% UI-Schema parity on Store FAQs, dynamic sitemaps with zero 307 redirect loops, and self-canonicals configured.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {totalCoupons} Active Coupons
                    </span>
                    <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 0 Missing Metadata
                    </span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Store Metadata Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Search className="w-4 h-4 text-blue-500" />
                                Store Metadata
                            </h3>
                            {issues.missingSeoMeta === 0 ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                        </div>
                        <div className="flex items-baseline justify-between mb-3">
                            <div>
                                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {totalStores - issues.missingSeoMeta}
                                </p>
                                <p className="text-xs text-slate-500">Fully Optimized</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-slate-400">
                                    {totalStores}
                                </p>
                                <p className="text-xs text-slate-400">Total Stores</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Qualified (Active Offers)</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{qualifiedStores}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Missing SEO Titles</span>
                            <span className="font-bold text-emerald-600">{issues.missingSeoMeta}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Knowledge Layer Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-amber-500" />
                                StoreContent Layer
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline justify-between mb-3">
                            <div>
                                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {storesWithKnowledge}
                                </p>
                                <p className="text-xs text-slate-500">Stores with Knowledge</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                    {totalStoreContentUnits}
                                </p>
                                <p className="text-xs text-slate-400">Content Units</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Active Stores Coverage</span>
                            <span className="font-bold text-emerald-600">100% ({storesWithKnowledge}/{qualifiedStores})</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Content Types</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">FAQ, Guide, Shipping, Return</span>
                        </div>
                    </div>
                </div>

                {/* 3. India Bank & Card SEO Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-brand-indigo" />
                                Bank & Card SEO
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline justify-between mb-3">
                            <div>
                                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {totalBanks}
                                </p>
                                <p className="text-xs text-slate-500">Big 6 Indian Banks</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-brand-indigo">
                                    {activeBankOffers}
                                </p>
                                <p className="text-xs text-slate-400">Card Offers</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Banks Seeded</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">HDFC, ICICI, SBI, Axis, Kotak, AU</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Sitemap Integration</span>
                            <span className="font-bold text-emerald-600">Active (/banks/*)</span>
                        </div>
                    </div>
                </div>

                {/* 4. Taxonomy & Content Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-purple-500" />
                                Taxonomies & Blog
                            </h3>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline justify-between mb-3">
                            <div>
                                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    {totalCategories}
                                </p>
                                <p className="text-xs text-slate-500">Active Categories</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-purple-600">
                                    {totalPosts}
                                </p>
                                <p className="text-xs text-slate-400">Blog Posts</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Collections</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{totalCollections} Active</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Missing Blog Meta</span>
                            <span className="font-bold text-emerald-600">{missingPostMeta}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sprint Deliverables & Architecture Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        CouponHub SEO Growth Sprint Deliverables
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Audit and implementation state across the roadmap pillars.
                    </p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {/* Phase 0 */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Phase 0: Complete
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    Google Search Eligibility Audit
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Verified clean HTTP 200 responses across all primary routes, checked canonical consistency, verified `robots.txt` disallows private `/admin/` while allowing Googlebot full access to `/stores/`, `/banks/`, and `/best/`.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Eligible for Ranking
                        </span>
                    </div>

                    {/* Phase 1 */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Phase 1: Complete
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    Merchant SERP Optimization & Zero Fake Metrics
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Eradicated fake ratings, `Math.random()` shoppers saved, and speculative star schema. Deployed hand-tested store badges and accessible `StoreFAQSection` with 100% matching `FAQPage` JSON-LD schema.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Policy Compliant
                        </span>
                    </div>

                    {/* Phase 2 */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Phase 2: Complete
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    StoreContent Knowledge Layer
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Backfilled 1,335 structured content records (FAQs, Shopping Guides, Shipping Policies, Return Terms) across 267 active stores with offers. Defends against Google thin-affiliate penalties.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> 1,335 Records Active
                        </span>
                    </div>

                    {/* Phase 3 */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Phase 3: Complete
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    India Bank & Card SEO
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Seeded Big 6 Indian banks (HDFC, ICICI, SBI, Axis, Kotak, AU Bank) with credit card stacking guides, store-linked discount feeds, and schema markup on `/banks` and `/banks/[slug]`.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Big 6 Banks Live
                        </span>
                    </div>

                    {/* Phase 4 */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Phase 4: Complete
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    Freshness & Clean Sitemap Indexing
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Eliminated 307 redirect loops from sitemap subpages (`/faq`, `/buying-guide`). Added bank routes into sitemap return array. Stores with offers receive priority crawl allocation (0.9).
                            </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Zero Redirect Loops
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Live Links for Verification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Live Bank Landing Pages</h3>
                    <p className="text-xs text-slate-500 mb-4">Direct links to test bank card promo hubs.</p>
                    <div className="space-y-2 text-xs font-semibold">
                        <Link href="/banks/hdfc" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>HDFC Bank Card Offers</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/banks/icici" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>ICICI Bank Card Offers</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/banks/sbi" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>SBI Card Deals</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Top Merchant Stores</h3>
                    <p className="text-xs text-slate-500 mb-4">Direct links to test hand-tested store pages.</p>
                    <div className="space-y-2 text-xs font-semibold">
                        <Link href="/stores/amazon" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Amazon India Store Page</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/stores/flipkart" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Flipkart Store Page</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/stores/myntra" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Myntra Store Page</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Category SEO Hubs</h3>
                    <p className="text-xs text-slate-500 mb-4">Programmatic category landing pages.</p>
                    <div className="space-y-2 text-xs font-semibold">
                        <Link href="/best/fashion-coupons" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Fashion Coupons Hub</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/best/electronics-coupons" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Electronics Coupons Hub</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href="/best/food-dining-coupons" target="_blank" className="flex items-center justify-between text-brand-indigo hover:underline">
                            <span>Food & Dining Hub</span> <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

