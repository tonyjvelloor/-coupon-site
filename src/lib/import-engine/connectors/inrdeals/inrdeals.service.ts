export class InrdealsService {
    private readonly BASE_URL = process.env.INRDEALS_BASE_URL || "https://inrdeals.com";
    private readonly API_TOKEN = process.env.INRDEALS_API_TOKEN;
    private readonly USERNAME = process.env.INRDEALS_USERNAME;

    private async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<any> {
        let attempt = 0;
        let delay = 1000;

        while (attempt < maxRetries) {
            try {
                const response = await fetch(url, options);

                if (response.ok) {
                    // INRDeals returns 200, 202, 204
                    if (response.status === 204) return null;
                    return await response.json();
                }

                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Transient error: ${response.status}`);
                }

                // Client error (400, 404, etc.) - don't retry
                throw new Error(`Client error: ${response.status} ${response.statusText}`);
            } catch (error: any) {
                attempt++;
                if (attempt >= maxRetries || error.message.startsWith("Client error")) {
                    throw error;
                }
                
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }

    private getBaseParams() {
        if (!this.API_TOKEN || !this.USERNAME) {
            throw new Error("INRDEALS_API_TOKEN or INRDEALS_USERNAME is not configured.");
        }
        return {
            token: this.API_TOKEN,
            id: this.USERNAME
        };
    }

    /**
     * Authenticate by making a lightweight request.
     */
    async ping() {
        // Fetch 1 page as a ping test
        const qs = new URLSearchParams({ ...this.getBaseParams() });
        const data = await this.fetchWithRetry(`${this.BASE_URL}/fetch/stores?${qs}`);
        return true;
    }

    /**
     * Get coupons feed.
     */
    async getCouponsFeed(page: number = 1) {
        const qs = new URLSearchParams({
            ...this.getBaseParams(),
            page: page.toString()
        });
        const res = await this.fetchWithRetry(`${this.BASE_URL}/api/v1/coupon-feed?${qs}`);
        return res?.result || { data: [], current_page: 1, last_page: 1 };
    }
}
