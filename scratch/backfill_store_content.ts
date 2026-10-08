import 'dotenv/config';
import { merchantKnowledgeService } from '../src/lib/services/merchant-knowledge.service';

async function main() {
    console.log("Starting store content backfill for ALL stores...");
    const result = await merchantKnowledgeService.backfillStoreContent({ onlyWithOffers: false });
    console.log("Backfill complete:", result);
}

main().catch(console.error);
