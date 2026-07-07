import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker } from "./worker";
import { SeoWorker } from "./workers/seo-worker";
import { MerchantWorker } from "./workers/merchant-worker";

class WorkerRegistry {
  private workers: IntelligenceWorker[] = [];

  register(worker: IntelligenceWorker) {
    this.workers.push(worker);
  }

  getWorkersForEvent(event: IntelligenceEvent): IntelligenceWorker[] {
    return this.workers.filter(w => w.supportedEvents.includes(event));
  }
  
  getWorkerByName(name: string): IntelligenceWorker | undefined {
    return this.workers.find(w => w.name === name);
  }
}

export const workerRegistry = new WorkerRegistry();

// Register built-in workers
workerRegistry.register(new SeoWorker());
workerRegistry.register(new MerchantWorker());
