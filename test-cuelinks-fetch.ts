import { CuelinksService } from "./src/lib/affiliate/cuelinks.service.ts";
import "dotenv/config";

async function run() {
    const svc = new CuelinksService();
    const campaigns = await svc.getTopCampaigns(2);
    console.log(JSON.stringify(campaigns, null, 2));
}
run();
