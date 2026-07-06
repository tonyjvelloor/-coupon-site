import { prisma } from "@/lib/db";
import Link from "next/link";
import {
    ExternalLink,
    Plus,
    Link2,
    MousePointer,
    Copy,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Edit,
    Clock,
    AlertCircle
} from "lucide-react";
import CopyButton from "@/components/admin/CopyButton";

export const dynamic = "force-dynamic";

export default async function CampaignLinksPage() {
    const campaignLinks = await prisma.campaignLink.findMany({
        include: { store: { select: { id: true, name: true, logo: true } } },
        orderBy: { createdAt: "desc" },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://couponhub.store";

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Link2 className="w-8 h-8 text-violet-600" />
                        Campaign Links
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Create masked links for ads. Show your domain, redirect to affiliate URLs.
                    </p>
                </div>
                <Link
                    href="/admin/campaign-links/new"
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign Link
                </Link>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">How it works:</p>
                        <p>
                            Create a masked link like <code className="bg-blue-100 px-1 rounded">{baseUrl}/go/flipkart-sale</code>.
                            Use this link in your ads. Visitors will be redirected to your affiliate URL.
                        </p>
                    </div>
                </div>
            </div>

            {/* Links Table */}
            {campaignLinks.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No campaign links yet</h3>
                    <p className="text-gray-500 mb-6">Create your first masked link for running ads</p>
                    <Link
                        href="/admin/campaign-links/new"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Campaign Link
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Campaign Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Masked URL</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Clicks</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaignLinks.map((link) => {
                                    const isExpired = link.expiresAt && new Date() > link.expiresAt;
                                    const maskedUrl = `${baseUrl}/go/${link.slug}`;

                                    return (
                                        <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium text-gray-900">{link.name}</p>
                                                    {link.store && (
                                                        <p className="text-sm text-gray-500">Store: {link.store.name}</p>
                                                    )}
                                                    {link.description && (
                                                        <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-violet-700 max-w-xs truncate">
                                                        /go/{link.slug}
                                                    </code>
                                                    <CopyButton text={maskedUrl} />
                                                    <a
                                                        href={maskedUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                        title="Test link"
                                                    >
                                                        <ExternalLink className="w-4 h-4 text-gray-500" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <MousePointer className="w-4 h-4 text-gray-400" />
                                                    <span className="font-semibold text-gray-900">{link.clicks.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {isExpired ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Expired
                                                    </span>
                                                ) : link.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        <ToggleRight className="w-3.5 h-3.5" />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                        <ToggleLeft className="w-3.5 h-3.5" />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/campaign-links/${link.id}`}
                                                        className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-violet-600" />
                                                    </Link>
                                                    <form action={`/api/admin/campaign-links/${link.id}`} method="DELETE">
                                                        <button
                                                            type="button"
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stats Summary */}
            {campaignLinks.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Total Links</p>
                        <p className="text-2xl font-bold text-gray-900">{campaignLinks.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Total Clicks</p>
                        <p className="text-2xl font-bold text-violet-600">
                            {campaignLinks.reduce((sum, l) => sum + l.clicks, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-500">Active Campaigns</p>
                        <p className="text-2xl font-bold text-green-600">
                            {campaignLinks.filter((l) => l.isActive && (!l.expiresAt || new Date() < l.expiresAt)).length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
