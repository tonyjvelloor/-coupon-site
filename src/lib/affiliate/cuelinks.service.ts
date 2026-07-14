export class CuelinksService {
    private readonly BASE_URL = "https://developers.cuelinks.com/pub_api/v3";
    private readonly API_KEY = process.env.CUELINKS_API_KEY;

    private get headers() {
        if (!this.API_KEY) {
            throw new Error("CUELINKS_API_KEY is not configured");
        }
        return { Authorization: `Token ${this.API_KEY}` };
    }

    /**
     * Pings the Cuelinks API to verify authentication and status.
     */
    async ping() {
        const res = await fetch(`${this.BASE_URL}/ping`, { headers: this.headers });
        if (!res.ok) {
            throw new Error(`Cuelinks Ping Failed: ${res.statusText}`);
        }
        return await res.json();
    }

    /**
     * Fetches top open campaigns, sorted by 7-day EPC.
     */
    async getTopCampaigns(limit = 20) {
        const qs = new URLSearchParams({
            access_status: "open", 
            sort: "epc_7d", 
            order: "desc", 
            per_page: limit.toString(),
        });
        const res = await fetch(`${this.BASE_URL}/campaigns?${qs}`, { headers: this.headers });
        if (!res.ok) {
            throw new Error(`Failed to fetch Cuelinks campaigns: ${res.statusText}`);
        }
        const json = await res.json();
        return json.data || [];
    }

    /**
     * Converts an outbound merchant URL into a monetized Cuelinks tracking URL.
     */
    async convertUrl(url: string, subid?: string, shorten: boolean = true) {
        const body: Record<string, any> = { url, shorten };
        if (subid) body.subid = subid;

        const res = await fetch(`${this.BASE_URL}/links/convert`, {
            method: "POST",
            headers: { 
                ...this.headers, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(body),
        });
        
        if (!res.ok) {
            throw new Error(`Failed to convert Cuelinks URL: ${res.statusText}`);
        }
        
        const json = await res.json();
        return json.url; // The monetized URL
    }
}
