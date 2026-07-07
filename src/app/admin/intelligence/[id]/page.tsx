import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ReviewForm } from "./ReviewForm";

export default async function IntelligenceTaskPage({ params }: { params: { id: string } }) {
  const task = await prisma.intelligenceTask.findUnique({
    where: { id: params.id }
  });

  if (!task) return notFound();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Review AI Proposal</h1>
        <p className="text-sm text-gray-500">
          Task ID: {task.id} | Worker: {task.workerName} | Event: {task.event}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Snapshot */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-bold mb-4">Input Snapshot</h2>
          <p className="text-sm text-gray-500 mb-4">What the AI saw when generating this proposal.</p>
          <pre className="text-xs bg-gray-800 text-gray-100 p-4 rounded overflow-auto h-96">
            {JSON.stringify(task.inputSnapshot, null, 2)}
          </pre>
          
          <h3 className="mt-6 font-bold text-sm">Provenance</h3>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>Model: {task.model}</li>
            <li>Worker Ver: {task.workerVersion}</li>
            <li>Prompt Ver: {task.promptVersion}</li>
          </ul>
        </div>

        {/* Output & Approval Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4">AI Generated Proposal</h2>
          
          <ReviewForm task={task} />
        </div>
      </div>
    </div>
  );
}
