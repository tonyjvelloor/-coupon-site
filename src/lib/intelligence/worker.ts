import { IntelligenceEvent } from "@prisma/client";

export interface WorkerProposal<T = any> {
  confidence: number;
  reasoning: string;
  warnings: string[];
  data: T;
}

export interface IntelligenceWorker {
  name: string;
  version: string;
  supportedEvents: IntelligenceEvent[];

  /**
   * Reads necessary data from DB using entityId, constructs a prompt,
   * invokes LLM, and returns the structured proposal.
   */
  process(event: IntelligenceEvent, entityType: string, entityId: string): Promise<{
    inputSnapshot: any;
    proposal: WorkerProposal;
    promptVersion: string;
    model: string;
    settings: any;
  }>;
}
