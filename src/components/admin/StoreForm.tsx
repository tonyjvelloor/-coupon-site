"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface StoreFormProps {
    categories: Category[];
    initialData?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        logo: string | null;
        website: string;
        affiliateUrl: string | null;
        cashbackRate: string | null;
        cashbackType: string | null;
        isActive: boolean;
        isFeatured: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        aboutContent: string | null;
        categoryIds?: string[];
    };
}

export default function StoreForm({ categories, initialData }: StoreFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        logo: initialData?.logo || "",
        website: initialData?.website || "",
        affiliateUrl: initialData?.affiliateUrl || "",
        cashbackRate: initialData?.cashbackRate || "",
        cashbackType: initialData?.cashbackType || "percentage",
        isActive: initialData?.isActive ?? true,
        isFeatured: initialData?.isFeatured ?? false,
        seoTitle: initialData?.seoTitle || "",
        seoDescription: initialData?.seoDescription || "",
        aboutContent: initialData?.aboutContent || "",
        categoryIds: initialData?.categoryIds || [],
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Auto-generate slug from name
        if (name === "name" && !initialData) {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const url = initialData
                ? `/api/admin/stores/${initialData.id}`
                : "/api/admin/stores";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save store");
            }

            router.push("/admin/stores");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <Link
                    href="/admin/stores"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Stores
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {initialData ? "Edit Store" : "Add New Store"}
                </h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="e.g., Amazon"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="e.g., amazon"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="Brief description of the store..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo URL
                            </label>
                            <input
                                type="url"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website URL *
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="https://www.amazon.in"
                            />
                        </div>
                    </div>
                </div>

                {/* Affiliate Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Affiliate Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Affiliate URL
                            </label>
                            <input
                                type="url"
                                name="affiliateUrl"
                                value={formData.affiliateUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="https://www.amazon.in/?tag=youraffid"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashback Rate
                            </label>
                            <input
                                type="text"
                                name="cashbackRate"
                                value={formData.cashbackRate}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="e.g., Upto 10.2%"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cashback Type
                            </label>
                            <select
                                name="cashbackType"
                                value={formData.cashbackType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat Amount</option>
                                <option value="voucher">Voucher Rewards</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.categoryIds.includes(category.id)
                                        ? "bg-violet-100 border-violet-500 text-violet-700"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.categoryIds.includes(category.id)}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className="sr-only"
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Title
                            </label>
                            <input
                                type="text"
                                name="seoTitle"
                                value={formData.seoTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="Amazon Coupons India: 80% OFF Promo Codes"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SEO Description
                            </label>
                            <textarea
                                name="seoDescription"
                                value={formData.seoDescription}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="Verified Amazon coupons help you save big..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                About Content (Rich SEO Text)
                            </label>
                            <textarea
                                name="aboutContent"
                                value={formData.aboutContent}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="About this store... (Markdown supported)"
                            />
                        </div>
                    </div>
                </div>

                {/* Visibility */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Visibility</h2>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700">Active (visible on site)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700">Featured (show on homepage)</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {initialData ? "Update Store" : "Create Store"}
                            </>
                        )}
                    </button>
                    <Link
                        href="/admin/stores"
                        className="px-6 py-3 text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
