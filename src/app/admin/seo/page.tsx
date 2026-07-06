import { prisma } from "@/lib/db";
import { 
    AlertTriangle, 
    CheckCircle2, 
    Search, 
    Link as LinkIcon, 
    Image as ImageIcon, 
    FileText 
} from "lucide-react";

export default async function SEOHealthDashboard() {
    // Analytics
    const totalStores = await prisma.store.count();
    const missingStoreMeta = await prisma.store.count({
        where: {
            OR: [
                { seoTitle: null },
                { seoDescription: null }
            ]
        }
    });

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

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SEO Health Dashboard</h1>
                <p className="text-gray-500">Monitor your site's search engine optimization metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Store Meta Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-500" />
                            Store Metadata
                        </h3>
                        {missingStoreMeta === 0 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStores - missingStoreMeta}</p>
                            <p className="text-sm text-gray-500">Optimized Stores</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold text-orange-500">{missingStoreMeta}</p>
                            <p className="text-sm text-gray-500">Missing Data</p>
                        </div>
                    </div>
                </div>

                {/* Collection Meta Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-violet-500" />
                            Collection Metadata
                        </h3>
                        {missingCollectionMeta === 0 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCollections - missingCollectionMeta}</p>
                            <p className="text-sm text-gray-500">Optimized Collections</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold text-orange-500">{missingCollectionMeta}</p>
                            <p className="text-sm text-gray-500">Missing Data</p>
                        </div>
                    </div>
                </div>

                {/* Blog Meta Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            Blog Metadata
                        </h3>
                        {missingPostMeta === 0 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPosts - missingPostMeta}</p>
                            <p className="text-sm text-gray-500">Optimized Posts</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold text-orange-500">{missingPostMeta}</p>
                            <p className="text-sm text-gray-500">Missing Data</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/50">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">SEO Best Practices</h3>
                <ul className="list-disc pl-5 text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>Ensure every page has a unique SEO Title and Description.</li>
                    <li>Titles should be between 50-60 characters.</li>
                    <li>Descriptions should be between 150-160 characters.</li>
                    <li>Always include a featured image for social sharing (OG Image).</li>
                </ul>
            </div>
        </div>
    );
}
