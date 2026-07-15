import { CuelinksService } from "./src/lib/affiliate/cuelinks.service";
import "dotenv/config";

async function run() {
    const API_KEY = process.env.CUELINKS_API_KEY || "00xGIxPkze5qGciR2Dd6cO8z20-SiM-lTOPGsp0N2N4";
    const res = await fetch(`https://developers.cuelinks.com/pub_api/v3/offers`, {
        headers: { Authorization: `Token ${API_KEY}` }
    });
    if (!res.ok) {
        console.error("Failed to fetch offers:", res.statusText);
        // Maybe try coupons?
        const res2 = await fetch(`https://developers.cuelinks.com/pub_api/v3/coupons`, {
            headers: { Authorization: `Token ${API_KEY}` }
        });
        if (!res2.ok) {
            console.error("Failed to fetch coupons either:", res2.statusText);
            return;
        }
        const json = await res2.json();
        console.log("Coupons:", JSON.stringify(json.data?.slice(0, 2), null, 2));
        return;
    }
    const json = await res.json();
    console.log("Offers:", JSON.stringify(json.data?.slice(0, 2), null, 2));
}
run();
