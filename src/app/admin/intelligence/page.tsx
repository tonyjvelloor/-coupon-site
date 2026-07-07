import { prisma } from "@/lib/db";
import Link from "next/link";
import { IntelligenceTaskStatus } from "@prisma/client";

export default async function IntelligenceDashboard() {
  const tasks = await prisma.intelligenceTask.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  const pendingReview = tasks.filter(t => t.status === "PENDING_REVIEW").length;
  const applied = tasks.filter(t => t.status === "APPLIED").length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Intelligence Editorial Review</h1>
          <p className="text-sm text-gray-500">Review and apply AI-generated proposals to production.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded">
            <span className="font-bold">{pendingReview}</span> Pending Review
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
            <span className="font-bold">{applied}</span> Applied
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{task.workerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.event}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.entityType} ({task.entityId.substring(0,8)})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.status === "PENDING_REVIEW" ? "bg-orange-100 text-orange-800" : ""}
                    ${task.status === "APPLIED" ? "bg-green-100 text-green-800" : ""}
                    ${task.status === "PENDING" ? "bg-gray-100 text-gray-800" : ""}
                  `}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {task.status === "PENDING_REVIEW" ? (
                    <Link href={`/admin/intelligence/${task.id}`} className="text-blue-600 hover:text-blue-900">
                      Review Proposal
                    </Link>
                  ) : (
                    <Link href={`/admin/intelligence/${task.id}`} className="text-gray-400 hover:text-gray-600">
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
