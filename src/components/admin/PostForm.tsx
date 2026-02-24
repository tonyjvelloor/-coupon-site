"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

interface PostFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        content: string;
        seoTitle: string | null;
        seoDescription: string | null;
        keywords: string | null;
        isPublished: boolean;
    };
}

export default function PostForm({ initialData }: PostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        seoTitle: initialData?.seoTitle || "",
        seoDescription: initialData?.seoDescription || "",
        keywords: initialData?.keywords || "",
        isPublished: initialData?.isPublished ?? false,
        aiTone: "professional", // For generation only, not saved to DB
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Auto-generate slug from title
        if (name === "title" && !initialData) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleGenerateAI = async () => {
        if (!formData.title) {
            setError("Please enter a title first to generate content.");
            return;
        }

        setGenerating(true);
        setError("");

        try {
            const res = await fetch("/api/admin/posts/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: formData.title,
                    tone: formData.aiTone
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setFormData((prev) => ({
                ...prev,
                content: data.content,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                keywords: data.keywords,
            }));
        } catch (err) {
            setError("Failed to generate content. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const url = initialData
                ? `/api/admin/posts/${initialData.id}`
                : "/api/admin/posts";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save post");
            }

            router.push("/admin/posts");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link
                        href="/admin/posts"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Posts
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {initialData ? "Edit Post" : "New Blog Post"}
                    </h1>
                </div>
                {!initialData && (
                    <div className="flex items-center gap-3">
                        <select
                            name="aiTone"
                            value={formData.aiTone}
                            onChange={handleChange}
                            disabled={generating}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                        >
                            <option value="professional">Professional</option>
                            <option value="casual">Casual & Friendly</option>
                            <option value="urgent">Urgent/FOMO</option>
                            <option value="persuasive">Persuasive</option>
                            <option value="humorous">Humorous</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={generating}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-70"
                        >
                            {generating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Auto-Write with AI
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Article Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none text-lg font-medium"
                                placeholder="e.g., Top 10 Ways to Save on Amazon"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content (Markdown Supported) *
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={20}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none font-mono text-sm leading-relaxed"
                                placeholder="# Introduction&#10;&#10;Write your article here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Publishing</h3>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="font-medium text-gray-700">Publish Article</span>
                        </label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {initialData ? "Update Post" : "Save Post"}
                        </button>
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none text-sm text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keywords (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
