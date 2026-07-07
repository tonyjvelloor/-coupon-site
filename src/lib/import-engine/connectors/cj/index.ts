import { AffiliateConnector, ConnectorCapability, NormalizedOffer, ValidationError } from "../../types";
import { HttpClient } from "../../http-client";
import { CJMapper } from "./mapper";
import path from "path";

export class CJConnector implements AffiliateConnector {
  public readonly sourceId = "cj";
  public readonly name = "CJ Affiliate";
  public readonly capabilities: ConnectorCapability[] = ["coupons", "merchantMetadata"];
  public readonly connectorVersion = "1.0.0";
  public readonly apiVersion = "REST v3"; // CJ Affiliate Link Search API v3 (GraphQL/REST)
  
  private client: HttpClient;

  constructor(useMock: boolean = false) {
    if (useMock) {
      const fixturePath = path.join(process.cwd(), "src/lib/import-engine/connectors/cj/fixtures");
      this.client = new HttpClient(undefined, fixturePath);
    } else {
      this.client = new HttpClient({
        baseURL: "https://linksearch.api.cj.com/v3",
        headers: {
          "Authorization": `Bearer ${process.env.CJ_API_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
    }
  }

  async connect(): Promise<void> {
    // In a real integration, we might validate the token here.
    return Promise.resolve();
  }

  async *fetch(): AsyncGenerator<any, void, unknown> {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      // Simulate CJ Affiliate pagination payload structure (mocked)
      const data = await this.client.get<{ links: { link: any[] }, page: number, total_pages: number }>(`/links?page=${page}`, `page${page}.json`);
      
      const records = data.links?.link || [];
      
      for (const record of records) {
        yield record;
      }

      if (page >= data.total_pages) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  normalize(rawData: any): NormalizedOffer {
    return CJMapper.toCanonical(rawData);
  }

  validate(normalized: NormalizedOffer): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!normalized.title) {
      errors.push({ field: "title", code: "MISSING_TITLE", message: "CJ offer missing title", severity: "error" });
    }
    if (!normalized.destinationUrl) {
      errors.push({ field: "destinationUrl", code: "MISSING_URL", message: "CJ offer missing destinationUrl", severity: "error" });
    }
    return errors;
  }

  async disconnect(): Promise<void> {
    // Cleanup if needed
    return Promise.resolve();
  }
}
