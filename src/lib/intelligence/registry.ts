import { IntelligenceEvent } from "@prisma/client";
import { IntelligenceWorker } from "./worker";
import { SeoWorker } from "./workers/seo-worker";
import { MerchantWorker } from "./workers/merchant-worker";
import { InternalLinkingWorker } from "./workers/internal-linking-worker";
import { CollectionWorker } from "./workers/collection-worker";
import { BuyingGuideWorker } from "./workers/buying-guide-worker";
import { FaqWorker } from "./workers/faq-worker";

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
workerRegistry.register(new InternalLinkingWorker());
workerRegistry.register(new CollectionWorker());
workerRegistry.register(new BuyingGuideWorker());
workerRegistry.register(new FaqWorker());
