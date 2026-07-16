import { CJConnector } from "./index";
import { CJMapper } from "./mapper";
import { CJClient } from "./client";
import { describe, expect, test, vi } from "vitest";

// Mock the Client to avoid real network requests during contract tests
vi.mock("./client", () => {
  return {
    CJClient: vi.fn().mockImplementation(() => {
      return {
        fetchLinks: vi.fn().mockResolvedValue({
          "cj-api": {
            links: {
              "$": { "total-matched": "2", "records-returned": "2" },
              link: [
                {
                  "advertiser-name": "Test Advertiser",
                  "link-name": "10% Off Sitewide",
                  "description": "Get 10% off on all items",
                  "click-url": "https://www.cj.com/click-1234567-987654",
                  "promotion-end-date": "2026-12-31T23:59:59Z",
                  "coupon-code": "SAVE10",
                  "link-id": "987654"
                },
                {
                  "advertiser-name": "Another Advertiser",
                  "link-name": "Free Shipping",
                  "click-url": "https://www.cj.com/click-1234567-111111",
                  "link-id": "111111"
                }
              ]
            }
          }
        })
      };
    })
  };
});

describe("CJ Connector Contract", () => {
  test("authenticates and requires website id", async () => {
    process.env.CJ_WEBSITE_ID = ""; // Temporarily clear
    const connector = new CJConnector();
    await expect(connector.authenticate()).rejects.toThrow(/CJ_WEBSITE_ID is missing/);
    process.env.CJ_WEBSITE_ID = "1234567"; // Restore
  });

  test("fetches and paginates data correctly", async () => {
    process.env.CJ_WEBSITE_ID = "1234567";
    const connector = new CJConnector();
    const iter = connector.fetch();
    
    const results = [];
    for await (const record of iter) {
      results.push(record);
    }
    
    expect(results.length).toBe(2);
    expect(results[0]["link-name"]).toBe("10% Off Sitewide");
    expect(results[0]._metadata).toBeDefined();
    expect(results[0]._metadata.page).toBe(1);
  });

  test("mapper normalizes payload and preserves provenance", async () => {
    const rawData = {
      "advertiser-name": "Test Advertiser",
      "link-name": "10% Off Sitewide",
      "click-url": "https://www.cj.com/click",
      "coupon-code": "SAVE10",
      _metadata: {
        apiVersion: "REST v2",
        requestTimestamp: "2026-07-16T12:00:00Z",
        responseTimestamp: "2026-07-16T12:00:01Z",
        page: 1
      }
    };
    
    const normalized = CJMapper.toCanonical(rawData);
    expect(normalized.merchantName).toBe("Test Advertiser");
    expect(normalized.title).toBe("10% Off Sitewide");
    expect(normalized.code).toBe("SAVE10");
    expect(normalized.discountType).toBe("percentage");
    expect(normalized.discountValue).toBe("10% Off");
    expect(normalized.provenance).toBeDefined();
    expect(normalized.provenance?.connector).toBe("cj");
    expect(normalized.provenance?.page).toBe(1);
    expect(normalized.provenance?.rawPayload).toBe(rawData);
  });
});
