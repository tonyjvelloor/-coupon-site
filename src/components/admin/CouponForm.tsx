"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface Store {
    id: string;
    name: string;
}

interface CouponFormProps {
    stores: Store[];
    initialData?: {
        id: string;
        title: string;
        description: string | null;
        code: string | null;
        type: string;
        discountType: string;
        image: string | null;
        discountValue: string | null;
        affiliateUrl: string;
        bank: string | null;
        termsConditions: string | null;
        expiresAt: Date | null;
        isVerified: boolean;
        isExclusive: boolean;
        isFeatured: boolean;
        storeId: string;
    };
}

export default function CouponForm({ stores, initialData }: CouponFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        code: initialData?.code || "",
        type: initialData?.type || "coupon",
        discountType: initialData?.discountType || "percentage",
        discountValue: initialData?.discountValue || "",
        image: initialData?.image || "",
        affiliateUrl: initialData?.affiliateUrl || "",
        bank: initialData?.bank || "",
        termsConditions: initialData?.termsConditions || "",
        expiresAt: initialData?.expiresAt
            ? new Date(initialData.expiresAt).toISOString().split("T")[0]
            : "",
        isVerified: initialData?.isVerified ?? true,
        isExclusive: initialData?.isExclusive ?? false,
        isFeatured: initialData?.isFeatured ?? false,
        storeId: initialData?.storeId || "",
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
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setError("");

        try {
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("folder", "coupons");

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Failed to upload image");

            const data = await res.json();
            setFormData((prev) => ({ ...prev, image: data.url }));
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
                ? `/api/admin/coupons/${initialData.id}`
                : "/api/admin/coupons";
            const method = initialData ? "PUT" : "POST";

            const payload = {
                ...formData,
                code: formData.code || null,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save coupon");
            }

            router.push("/admin/coupons");
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
                    href="/admin/coupons"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Coupons
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {initialData ? "Edit Coupon" : "Add New Coupon"}
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
                    <h2 className="text-lg font-semibold mb-4">Coupon Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Store *
                            </label>
                            <select
                                name="storeId"
                                value={formData.storeId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            >
                                <option value="">Select a store</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="e.g., Get 50% Off on Fashion"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="Brief description of the offer..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                >
                                    <option value="coupon">Coupon (has code)</option>
                                    <option value="deal">Deal (no code)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Coupon Code {formData.type === "coupon" && "*"}
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required={formData.type === "coupon"}
                                    disabled={formData.type === "deal"}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none disabled:bg-gray-50"
                                    placeholder="e.g., SAVE50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Type
                                </label>
                                <select
                                    name="discountType"
                                    value={formData.discountType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                >
                                    <option value="percentage">Percentage Off</option>
                                    <option value="flat">Flat Amount Off</option>
                                    <option value="freebie">Freebie/Gift</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount Value
                                </label>
                                <input
                                    type="text"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                    placeholder="e.g., 50% Off or ₹500 Off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banner Image
                            </label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
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
                                        className="btn-secondary px-4 py-2.5 flex items-center gap-2 whitespace-nowrap bg-surface-100 hover:bg-surface-200 text-surface-900 border border-surface-200 rounded-lg transition-colors"
                                    >
                                        {isUploadingImage ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Upload Image"
                                        )}
                                    </button>
                                </div>
                            </div>
                            {formData.image && (
                                <div className="mt-4 relative w-full h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Offer (Optional)
                            </label>
                            <input
                                type="text"
                                name="bank"
                                value={formData.bank}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="e.g., HDFC, SBI, ICICI"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Specify if this is a bank-specific offer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Affiliate Link */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Affiliate Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Affiliate URL *
                            </label>
                            <input
                                type="url"
                                name="affiliateUrl"
                                value={formData.affiliateUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="https://www.store.com/?affid=..."
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                This is where users will be redirected when they click the coupon
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Terms & Conditions
                            </label>
                            <textarea
                                name="termsConditions"
                                value={formData.termsConditions}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                                placeholder="Enter terms and conditions..."
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Status & Visibility</h2>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isVerified"
                                checked={formData.isVerified}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700">Verified</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isExclusive"
                                checked={formData.isExclusive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700">Exclusive</span>
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
                                {initialData ? "Update Coupon" : "Create Coupon"}
                            </>
                        )}
                    </button>
                    <Link
                        href="/admin/coupons"
                        className="px-6 py-3 text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
