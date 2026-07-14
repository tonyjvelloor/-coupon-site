"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface BannerFormProps {
    initialData?: {
        id: string;
        imageUrl: string;
        link: string;
        title: string | null;
        isActive: boolean;
        order: number;
    };
}

export default function BannerForm({ initialData }: BannerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        imageUrl: initialData?.imageUrl || "",
        link: initialData?.link || "",
        title: initialData?.title || "",
        isActive: initialData?.isActive ?? true,
        order: initialData?.order || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setError("");

        try {
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("folder", "banners");

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Failed to upload image");

            const data = await res.json();
            setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const url = initialData
                ? `/api/admin/banners/${initialData.id}`
                : "/api/admin/banners";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    order: Number(formData.order),
                }),
            });

            if (!res.ok) throw new Error("Failed to save banner");

            router.push("/admin/banners");
            router.refresh();
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/banners"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Banners
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {initialData ? "Edit Banner" : "Add New Banner"}
                </h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banner Image *
                    </label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                                placeholder="https://example.com/banner.jpg"
                            />
                            <p className="text-sm text-gray-500">
                                Provide a URL or upload an image
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploadingImage}
                            />
                            <button
                                type="button"
                                disabled={isUploadingImage}
                                className="btn-secondary px-4 py-2 flex items-center gap-2 whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 rounded-lg transition-colors"
                            >
                                {isUploadingImage ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Upload Image"
                                )}
                            </button>
                        </div>
                    </div>
                    {formData.imageUrl && (
                        <div className="mt-4 relative w-full h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link URL *
                    </label>
                    <input
                        type="url"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title (Optional)
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Order
                        </label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center mt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700 font-medium">Active</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Banner
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
