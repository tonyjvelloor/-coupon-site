import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Mail, Download, Search, CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
    const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
    });

    const activeCount = subscribers.filter(s => s.isActive).length;
    const totalCount = subscribers.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-violet-500 inline-block transition-colors">Newsletter Subscribers</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your email list for marketing campaigns
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg border border-violet-100 font-medium">
                        <Mail className="w-4 h-4" />
                        <span>{activeCount} Active</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        {/* Search is UI only placeholder for future */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm transition-colors"
                        />
                    </div>
                    {/* Real Export Button would go here in client component */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium w-full md:w-auto justify-center">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subscribed Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Mail className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No subscribers yet</p>
                                            <p className="text-sm">Visitors who sign up will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {subscriber.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {subscriber.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Unsubscribed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(subscriber.createdAt), "MMM d, yyyy h:mm a")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {subscribers.length > 0 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
                        Showing all {totalCount} subscribers
                    </div>
                )}
            </div>
        </div>
    );
}
