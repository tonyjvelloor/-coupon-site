"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface StoreContent {
    type: string;
    content: string;
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
        categoryIds?: string[];
        storeContents?: StoreContent[];
    };
}

type Tab = 'general' | 'content' | 'policies' | 'faq' | 'seo';

export default function StoreForm({ categories, initialData }: StoreFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>('general');

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
        categoryIds: initialData?.categoryIds || [],
    });

    const [storeContents, setStoreContents] = useState<Record<string, string>>({
        ABOUT: initialData?.storeContents?.find(c => c.type === 'ABOUT')?.content || "",
        BUYING_GUIDE: initialData?.storeContents?.find(c => c.type === 'BUYING_GUIDE')?.content || "",
        SHIPPING: initialData?.storeContents?.find(c => c.type === 'SHIPPING')?.content || "",
        RETURNS: initialData?.storeContents?.find(c => c.type === 'RETURNS')?.content || "",
        REFUND: initialData?.storeContents?.find(c => c.type === 'REFUND')?.content || "",
        WARRANTY: initialData?.storeContents?.find(c => c.type === 'WARRANTY')?.content || "",
        STUDENT: initialData?.storeContents?.find(c => c.type === 'STUDENT')?.content || "",
    });

    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(() => {
        const faqContent = initialData?.storeContents?.find(c => c.type === 'FAQ')?.content;
        if (faqContent) {
            try { return JSON.parse(faqContent); } catch { return []; }
        }
        return [];
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (name === "name" && !initialData) {
            const slug = value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStoreContents(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId: string) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        }));
    };

    const handleAddFaq = () => setFaqs(prev => [...prev, { question: "", answer: "" }]);
    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index][field] = value;
        setFaqs(newFaqs);
    };
    const handleRemoveFaq = (index: number) => setFaqs(prev => prev.filter((_, i) => i !== index));

    const calculateScore = () => {
        let score = 0;
        if (storeContents.ABOUT?.trim()) score += 10;
        if (storeContents.BUYING_GUIDE?.trim()) score += 20;
        if (storeContents.SHIPPING?.trim()) score += 10;
        if (storeContents.RETURNS?.trim()) score += 10;
        if (storeContents.REFUND?.trim()) score += 5;
        if (storeContents.WARRANTY?.trim()) score += 5;
        if (storeContents.STUDENT?.trim()) score += 5;
        if (faqs.length > 0) score += 15;
        if (formData.logo?.trim()) score += 5;
        if (formData.seoTitle?.trim()) score += 10;
        if (formData.seoDescription?.trim()) score += 10;
        return Math.min(100, score);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const payloadStoreContents = Object.entries(storeContents).map(([type, content]) => ({ type, content }));
        if (faqs.length > 0) {
            payloadStoreContents.push({ type: 'FAQ', content: JSON.stringify(faqs) });
        }

        try {
            const url = initialData ? `/api/admin/stores/${initialData.id}` : "/api/admin/stores";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, storeContents: payloadStoreContents }),
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

    const score = calculateScore();

    return (
        <div>
            {/* Header & Progress Bar */}
            <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <Link href="/admin/stores" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Stores
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {initialData ? "Edit Store Knowledge" : "Add New Store"}
                    </h1>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-gray-200 min-w-[250px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Knowledge Score</span>
                        <span className="font-bold text-violet-600">{score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-violet-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${score}%` }}></div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {['general', 'content', 'policies', 'faq', 'seo'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {/* General Tab */}
                    <div className={activeTab === 'general' ? 'block space-y-6' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                <input type="url" name="logo" value={formData.logo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Short summary)</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                        </div>

                        <h3 className="text-md font-semibold mt-8 mb-4 border-t pt-6">Affiliate Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate URL</label>
                                <input type="url" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cashback Rate</label>
                                <input type="text" name="cashbackRate" value={formData.cashbackRate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="e.g. Upto 10%" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cashback Type</label>
                                <select name="cashbackType" value={formData.cashbackType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat Amount</option>
                                    <option value="voucher">Voucher</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="text-md font-semibold mt-8 mb-4 border-t pt-6">Visibility</h3>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
                                <span className="text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
                                <span className="text-gray-700">Featured</span>
                            </label>
                        </div>
                    </div>

                    {/* Content Tab */}
                    <div className={activeTab === 'content' ? 'block space-y-6' : 'hidden'}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">About Content (Markdown)</label>
                            <p className="text-xs text-gray-500 mb-2">Detailed description of the store, history, and offerings.</p>
                            <textarea name="ABOUT" value={storeContents.ABOUT} onChange={handleContentChange} rows={6} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-sm" />
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buying Guide (Markdown)</label>
                            <p className="text-xs text-gray-500 mb-2">A comprehensive guide on how to shop at this store, save money, and find the best deals.</p>
                            <textarea name="BUYING_GUIDE" value={storeContents.BUYING_GUIDE} onChange={handleContentChange} rows={12} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none font-mono text-sm" />
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Discount Details</label>
                            <p className="text-xs text-gray-500 mb-2">Instructions for how students can claim discounts.</p>
                            <textarea name="STUDENT" value={storeContents.STUDENT} onChange={handleContentChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                    </div>

                    {/* Policies Tab */}
                    <div className={activeTab === 'policies' ? 'block space-y-6' : 'hidden'}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
                            <textarea name="SHIPPING" value={storeContents.SHIPPING} onChange={handleContentChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Returns Policy</label>
                            <textarea name="RETURNS" value={storeContents.RETURNS} onChange={handleContentChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
                            <textarea name="REFUND" value={storeContents.REFUND} onChange={handleContentChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Details</label>
                            <textarea name="WARRANTY" value={storeContents.WARRANTY} onChange={handleContentChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                    </div>

                    {/* FAQ Tab */}
                    <div className={activeTab === 'faq' ? 'block space-y-6' : 'hidden'}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
                                <p className="text-sm text-gray-500">Automatically generates FAQ schema for search engines.</p>
                            </div>
                            <button type="button" onClick={handleAddFaq} className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors font-medium text-sm">
                                <Plus className="w-4 h-4" /> Add Question
                            </button>
                        </div>
                        
                        {faqs.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-500 mb-2">No FAQs added yet.</p>
                                <button type="button" onClick={handleAddFaq} className="text-violet-600 font-medium hover:underline">Add your first question</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
                                        <button type="button" onClick={() => handleRemoveFaq(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="space-y-4 pr-8">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                                <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="e.g. Does this store offer free shipping?" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                                                <textarea value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Yes, they offer free shipping on orders over $50." />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SEO Tab */}
                    <div className={activeTab === 'seo' ? 'block space-y-6' : 'hidden'}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                        </div>
                        
                        <h3 className="text-md font-semibold mt-8 mb-4 border-t pt-6">Categories</h3>
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <label key={category.id} className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.categoryIds.includes(category.id) ? "bg-violet-100 border-violet-500 text-violet-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                                    <input type="checkbox" checked={formData.categoryIds.includes(category.id)} onChange={() => handleCategoryChange(category.id)} className="sr-only" />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4 border-t pt-6">
                    <Link href="/admin/stores" className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> {initialData ? "Save Knowledge" : "Create Store"}</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
