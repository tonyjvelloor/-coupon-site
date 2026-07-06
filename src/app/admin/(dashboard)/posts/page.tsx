import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, FileText, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPostsPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-violet-600" />
                        Blog Posts
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your SEO articles and AI-generated content.
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Post
                </Link>
            </div>

            {/* Posts Table */}
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">Create your first article to boost SEO</p>
                    <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Post
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Title</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Author</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-1">
                                                    {post.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    /{post.slug}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {post.isPublished ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {post.author.name || "Admin"}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/posts/${post.id}`}
                                                    className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-violet-600" />
                                                </Link>
                                                <form action={`/api/admin/posts/${post.id}`} method="DELETE">
                                                    <button
                                                        type="button" // Use client component/dialog for delete in future
                                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
