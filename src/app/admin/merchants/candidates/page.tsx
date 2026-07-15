import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function CandidatesPage() {
    const candidates = await prisma.merchantCandidate.findMany({
        where: { status: "DISCOVERED" },
        orderBy: { confidence: "desc" },
        include: { identity: true }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Merchant Candidate Inbox</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Confidence</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{candidate.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{candidate.source}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {candidate.confidence}% ({candidate.confidenceSource || "Unknown"})
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{candidate.status}</td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Enrich</button>
                                    <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                                    <button className="text-red-600 hover:text-red-900">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {candidates.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-white shadow rounded-lg mt-4">
                    No new merchant candidates to review.
                </div>
            )}
        </div>
    );
}
