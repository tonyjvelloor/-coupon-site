import { HttpClient } from "../../http-client";

export class CJCommissionClient {
  private client: HttpClient;
  private publisherIds: string[];

  constructor(token?: string, publisherId?: string) {
    const apiToken = token || process.env.CJ_API_TOKEN;
    const cid = publisherId || process.env.CJ_COMPANY_ID || "8015859"; // Fallback to provided CID
    
    if (!apiToken) {
      console.warn("[CJCommissionClient] CJ_API_TOKEN is missing");
    }
    
    this.publisherIds = [cid];

    this.client = new HttpClient({
      baseURL: "https://commissions.api.cj.com",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      maxRetries: 3,
      retryDelayMs: 2000,
    });
  }

  /**
   * Fetch commissions using the CJ GraphQL API.
   * Dates should be ISO-8601 strings (e.g. 2018-08-08T00:00:00Z)
   */
  async fetchCommissions(sincePostingDate: string, beforePostingDate: string): Promise<any> {
    const query = `
      query PublisherCommissions($forPublishers: [String!]!, $sincePostingDate: String, $beforePostingDate: String) {
        publisherCommissions(forPublishers: $forPublishers, sincePostingDate: $sincePostingDate, beforePostingDate: $beforePostingDate) {
          count
          payloadComplete
          records {
            originalActionId
            actionStatus
            actionTrackerName
            actionTrackerId
            websiteName
            advertiserName
            postingDate
            pubCommissionAmountUsd
            saleAmountPubCurrency
            items {
              quantity
              perItemSaleAmountPubCurrency
              totalCommissionPubCurrency
            }
          }
        }
      }
    `;

    const variables = {
      forPublishers: this.publisherIds,
      sincePostingDate,
      beforePostingDate
    };

    const responseData = await this.client.post<any>("/query", {
      query,
      variables
    });

    // GraphQL typically returns errors inside the 200 OK payload
    if (responseData.errors && responseData.errors.length > 0) {
      throw new Error("CJ GraphQL Error: " + JSON.stringify(responseData.errors));
    }

    return responseData.data?.publisherCommissions;
  }
}
