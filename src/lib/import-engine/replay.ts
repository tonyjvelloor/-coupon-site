import { prisma } from "@/lib/db";
import { ImportPipeline } from "./pipeline";
import { ConnectorRegistry } from "./registry";
import { logger } from "@/lib/logger";
import { NormalizedOffer, RawOffer } from "./types";

export class ReplayEngine {
    private pipeline = new ImportPipeline();
    private registry = new ConnectorRegistry();

    async replayJob(importJobId: string): Promise<void> {
        const job = await prisma.importJob.findUnique({
            where: { id: importJobId },
            include: { importedOffers: true }
        });

        if (!job) {
            throw new Error(`ImportJob ${importJobId} not found`);
        }

        const connector = await this.registry.getConnector(job.source);
        if (!connector) {
            throw new Error(`Connector ${job.source} not found`);
        }

        logger.info({ jobId: importJobId, rows: job.importedOffers.length }, "Starting Replay Job");

        // We can create a mock connector that yields the rawData from the DB
        const mockConnector = {
            ...connector,
            async *fetch() {
                for (const offer of job.importedOffers) {
                    yield offer.rawData as RawOffer;
                }
            }
        };

        // Run the pipeline using the mock connector
        // We set publish=false here to avoid double-publishing unless we want to, 
        // but typically a replay is for re-evaluating rules and identity matches.
        await this.pipeline.run(mockConnector, "replay-" + connector.version, false);

        logger.info({ jobId: importJobId }, "Finished Replay Job");
    }
}
