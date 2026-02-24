"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, ArrowLeft, Save, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

interface Store {
    id: string;
    name: string;
}

export default function NewCampaignLinkPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stores, setStores] = useState<Store[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        destinationUrl: "",
        description: "",
        storeId: "",
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        isActive: true,
        expiresAt: "",
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://couponhub.store";

    // Fetch stores for dropdown
    useEffect(() => {
        fetch("/api/admin/stores")
            .then((res) => res.json())
            .then((data) => setStores(data || []))
            .catch(() => { });
    }, []);

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 50);
        setFormData({ ...formData, name, slug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/campaign-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create link");
            }

            router.push("/admin/campaign-links");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/campaign-links"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Link2 className="w-6 h-6 text-violet-600" />
                        New Campaign Link
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create a masked URL for your ad campaigns
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Basic Information</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Flipkart Republic Day Sale"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL Slug *
                            </label>
                            <div className="flex items-center">
                                <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                                    /go/
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="flipkart-sale"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Your masked URL: <code className="bg-gray-100 px-1 rounded">{baseUrl}/go/{formData.slug || "your-slug"}</code>
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destination URL (Affiliate Link) *
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://www.flipkart.com/?affid=your_affiliate_id"
                            value={formData.destinationUrl}
                            onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            The actual affiliate URL users will be redirected to
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Associated Store (Optional)
                            </label>
                            <select
                                value={formData.storeId}
                                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            >
                                <option value="">Select a store...</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expires At (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Internal Notes
                        </label>
                        <textarea
                            placeholder="Notes about this campaign (not shown publicly)"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* UTM Parameters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-semibold text-gray-900">UTM Parameters (Optional)</h2>
                    </div>
                    <p className="text-sm text-gray-500">
                        These are automatically appended to your destination URL for analytics tracking
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UTM Source
                            </label>
                            <input
                                type="text"
                                placeholder="facebook, google, meta"
                                value={formData.utmSource}
                                onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UTM Medium
                            </label>
                            <input
                                type="text"
                                placeholder="cpc, banner, email"
                                value={formData.utmMedium}
                                onChange={(e) => setFormData({ ...formData, utmMedium: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                UTM Campaign
                            </label>
                            <input
                                type="text"
                                placeholder="jan-sale, summer2024"
                                value={formData.utmCampaign}
                                onChange={(e) => setFormData({ ...formData, utmCampaign: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                        />
                        <span className="font-medium text-gray-900">Link is Active</span>
                        <span className="text-sm text-gray-500">(Inactive links will show a 404 page)</span>
                    </label>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/campaign-links"
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Creating..." : "Create Campaign Link"}
                    </button>
                </div>
            </form>
        </div>
    );
}
