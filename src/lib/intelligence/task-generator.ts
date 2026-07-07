import { prisma } from "@/lib/db";
import { IntelligenceEvent } from "@prisma/client";
import { workerRegistry } from "./registry";

export class TaskGenerator {
  /**
   * Translates a domain event into an asynchronous IntelligenceTask
   * for every subscribed worker.
   */
  static async publish(event: IntelligenceEvent, entityType: string, entityId: string) {
    const workers = workerRegistry.getWorkersForEvent(event);
    
    if (workers.length === 0) return;

    // Create a task for each worker
    await prisma.$transaction(
      workers.map(worker => 
        prisma.intelligenceTask.create({
          data: {
            event,
            entityType,
            entityId,
            workerName: worker.name,
            status: "PENDING",
            // Dummy initial values, will be overwritten by worker
            promptVersion: "pending",
            workerVersion: worker.version,
            model: "pending",
            inputSnapshot: {}
          }
        })
      )
    );
  }
}
