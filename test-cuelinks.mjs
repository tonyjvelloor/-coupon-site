import fetch from "node-fetch";

async function run() {
    const API_KEY = "00xGIxPkze5qGciR2Dd6cO8z20-SiM-lTOPGsp0N2N4";
    const res = await fetch(`https://developers.cuelinks.com/pub_api/v3/offers`, {
        headers: { Authorization: `Token ${API_KEY}` }
    });
    if (!res.ok) {
        const res2 = await fetch(`https://developers.cuelinks.com/pub_api/v3/coupons`, {
            headers: { Authorization: `Token ${API_KEY}` }
        });
        if (!res2.ok) {
            console.error("Failed to fetch offers or coupons", res2.status, res2.statusText);
            return;
        }
        const json = await res2.json();
        console.log("Coupons:", JSON.stringify(json.data?.slice(0, 1), null, 2));
        return;
    }
    const json = await res.json();
    console.log("Offers:", JSON.stringify(json.data?.slice(0, 1), null, 2));
}
run();
