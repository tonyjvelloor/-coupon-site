import { prisma } from "@/lib/db";
import { Sparkles, Trash2, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminNewsPage() {
    const newsArticles = await prisma.newsArticle.findMany({
        orderBy: { publishedAt: "desc" },
    });

    async function deleteArticle(id: string) {
        "use server";
        await prisma.newsArticle.delete({ where: { id } });
        revalidatePath("/admin/news");
        revalidatePath("/news");
        revalidatePath("/");
    }

    async function triggerCrawl() {
        "use server";
        // Call the internal absolute route (requires mapping or raw fetch)
        // For server-actions, it's often easier to just fetch the absolute URL
        try {
            const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
            await fetch(`${baseUrl}/api/cron/crawl-news`, {
                headers: {
                    Authorization: `Bearer ${process.env.CRON_SECRET || "local-dev-secret-key"}`
                }
            });
            revalidatePath("/admin/news");
            revalidatePath("/news");
            revalidatePath("/");
        } catch (e) {
            console.error("Manual crawl failed", e);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Viral News Engine</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and manage automated, AI-crawled viral deals.
                    </p>
                </div>

                <form action={triggerCrawl}>
                    <button type="submit" className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                        <RefreshCw className="w-4 h-4" />
                        Trigger Manual Crawl
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Article & Source
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Crawled Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {newsArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 mb-1 leading-tight max-w-md">
                                            {article.title}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>via {article.sourceName || "Unknown"}</span>
                                            <a
                                                href={article.sourceUrl}
                                                target="_blank"
                                                className="text-violet-600 hover:underline flex items-center gap-1"
                                            >
                                                Source <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {article.isVerified ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                <Sparkles className="w-3 h-3" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(article.publishedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/news/${article.slug}`}
                                                target="_blank"
                                                className="text-gray-400 hover:text-violet-600 transition-colors"
                                                title="View Public Page"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>

                                            <form action={deleteArticle.bind(null, article.id)}>
                                                <button
                                                    type="submit"
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {newsArticles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <Sparkles className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                        <p>No viral news detected yet. The crawler will run automatically, or you can trigger it manually.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
