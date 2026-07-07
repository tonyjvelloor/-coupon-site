import { AffiliateConnector, ConnectorCapability, NormalizedOffer, ValidationError } from "../../types";
import { HttpClient } from "../../http-client";
import { ImpactMapper } from "./mapper";
import path from "path";

export class ImpactConnector implements AffiliateConnector {
  public readonly sourceId = "impact";
  public readonly name = "Impact Radius";
  public readonly capabilities: ConnectorCapability[] = ["coupons", "deals", "merchantMetadata"];
  public readonly connectorVersion = "1.0.0";
  public readonly apiVersion = "REST v1";
  
  private client: HttpClient;

  constructor(useMock: boolean = false) {
    this.client = new HttpClient({
      baseURL: "https://api.impact.com",
      useMock
    });

    if (useMock) {
      // Register mock fixtures
      const fixturePath = path.join(process.cwd(), "src/lib/import-engine/connectors/impact/fixtures/page1.json");
      this.client.registerMockFixture("/Mediapartners/TEST_SID/Ads.json", fixturePath);
    }
  }

  async connect(): Promise<void> {
    if (!this.client.useMock) {
      const sid = process.env.IMPACT_SID;
      const token = process.env.IMPACT_TOKEN;
      if (!sid || !token) {
        throw new Error("Missing IMPACT_SID or IMPACT_TOKEN in environment variables");
      }
      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      this.client.setHeader("Authorization", `Basic ${auth}`);
      this.client.setHeader("Accept", "application/json");
    }
  }

  async *fetch(): AsyncGenerator<any, void, unknown> {
    const sid = process.env.IMPACT_SID || "TEST_SID";
    
    // Impact uses cursor-based or page-based pagination. For simplicity, we just fetch one page.
    // In a full implementation, we'd loop until `nextPageUri` is null.
    const response = await this.client.get<{ Ads: any[] }>(`/Mediapartners/${sid}/Ads.json`);
    
    if (response && response.Ads) {
      for (const ad of response.Ads) {
        yield ad;
      }
    }
  }

  normalize(rawData: any): NormalizedOffer {
    return ImpactMapper.mapToCanonical(rawData);
  }

  validate(normalized: NormalizedOffer): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!normalized.affiliateUrl) {
      errors.push({ field: "affiliateUrl", severity: "error", code: "MISSING_URL", message: "Affiliate URL is required" });
    }
    if (!normalized.merchantName || normalized.merchantName === "Unknown Merchant") {
      errors.push({ field: "merchantName", severity: "error", code: "MISSING_MERCHANT", message: "Merchant name could not be resolved from payload" });
    }
    return errors;
  }

  async disconnect(): Promise<void> {
    // No cleanup needed for stateless HTTP
  }
}
