import { HttpClient } from "../../http-client";
import { parseStringPromise } from "xml2js";

export class CJClient {
  private client: HttpClient;

  constructor(token?: string) {
    const apiToken = token || process.env.CJ_API_TOKEN;
    if (!apiToken) {
      console.warn("[CJClient] CJ_API_TOKEN is missing");
    }
    
    this.client = new HttpClient({
      baseURL: "https://linksearch.api.cj.com/v2",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Accept": "application/json, application/xml"
      },
      maxRetries: 3,
      retryDelayMs: 2000,
    });
  }

  /**
   * Fetch links from CJ Affiliate API with pagination support
   */
  async fetchLinks(websiteId: string, page: number = 1, recordsPerPage: number = 100): Promise<any> {
    const apiPath = "/link-search";
    
    // According to CJ API v2 Link Search:
    // page-number=1, records-per-page=100
    const queryParams = {
      "website-id": websiteId,
      "page-number": page.toString(),
      "records-per-page": recordsPerPage.toString(),
      // Optionally could add promotion-type=coupon
    };

    // Use HttpClient which already handles exponential backoff, 429 retries, and timeout
    const responseData = await this.client.get<any>(apiPath, queryParams);
    return this.parseResponse(responseData);
  }

  /**
   * Generic ResponseParser: Handles both JSON and XML payload fallback
   */
  private async parseResponse(data: any): Promise<any> {
    if (typeof data === "string") {
      // It might be XML string if HttpClient returned raw text
      if (data.trim().startsWith("<")) {
        try {
          const parsed = await parseStringPromise(data, { explicitArray: false });
          return parsed;
        } catch (err) {
          throw new Error("Failed to parse CJ XML response");
        }
      } else {
        try {
          return JSON.parse(data);
        } catch (e) {
          throw new Error("CJ response is neither valid JSON nor XML");
        }
      }
    }

    // It's already parsed as JSON by HttpClient
    return data;
  }
}
