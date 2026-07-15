export class CuelinksService {
    private readonly BASE_URL = "https://developers.cuelinks.com/pub_api/v3";
    private readonly API_KEY = process.env.CUELINKS_API_KEY;

    private get headers() {
        if (!this.API_KEY) {
            throw new Error("CUELINKS_API_KEY is not configured");
        }
        return { Authorization: `Token ${this.API_KEY}` };
    }

    private async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<any> {
        let attempt = 0;
        let delay = 1000;

        while (attempt < maxRetries) {
            try {
                const response = await fetch(url, options);

                if (response.ok) {
                    if (response.status === 204) return null;
                    return await response.json();
                }

                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Transient error: ${response.status}`);
                }

                throw new Error(`Client error: ${response.status} ${response.statusText}`);
            } catch (error: any) {
                attempt++;
                if (attempt >= maxRetries || error.message.startsWith("Client error")) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }

    /**
     * Pings the Cuelinks API to verify authentication and status.
     */
    async ping() {
        return await this.fetchWithRetry(`${this.BASE_URL}/ping`, { headers: this.headers });
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
        const json = await this.fetchWithRetry(`${this.BASE_URL}/campaigns?${qs}`, { headers: this.headers });
        return json?.data || [];
    }

    /**
     * Fetches live offers (coupons and deals).
     */
    async getOffers(limit = 50) {
        const qs = new URLSearchParams({
            per_page: limit.toString(),
        });
        const json = await this.fetchWithRetry(`${this.BASE_URL}/offers?${qs}`, { headers: this.headers });
        return json?.data || [];
    }

    /**
     * Converts an outbound merchant URL into a monetized Cuelinks tracking URL.
     */
    async convertUrl(url: string, subid?: string, shorten: boolean = true) {
        const body: Record<string, any> = { url, shorten };
        if (subid) body.subid = subid;

        const json = await this.fetchWithRetry(`${this.BASE_URL}/links/convert`, {
            method: "POST",
            headers: { 
                ...this.headers, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(body),
        });
        
        return json?.url;
    }
}
