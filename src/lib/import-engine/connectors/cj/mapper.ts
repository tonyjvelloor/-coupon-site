import { NormalizedOffer } from "../../types";

export class CJMapper {
  /**
   * Maps a raw CJ Affiliate link object to the NormalizedOffer canonical model.
   */
  static toCanonical(raw: any): NormalizedOffer {
    const meta = raw._metadata || {};
    
    // Parse discount info
    const { discountType, discountValue } = this.parseDiscount(raw.description || raw["link-name"]);
    
    let expiry: Date | undefined;
    if (raw["promotion-end-date"]) {
      expiry = new Date(raw["promotion-end-date"]);
    }

    return {
      merchantName: raw["advertiser-name"] || "Unknown CJ Merchant",
      title: raw["link-name"] || raw.name,
      description: raw.description,
      code: raw["coupon-code"] || undefined, 
      destinationUrl: raw["click-url"] || raw.destination,
      affiliateUrl: raw["click-url"],
      discountType,
      discountValue,
      expiry,
      category: raw.category || undefined,
      source: "cj",
      externalId: raw["link-id"]?.toString(),
      provenance: {
        connector: "cj",
        connectorVersion: "1.0.0",
        apiVersion: meta.apiVersion || "REST v2",
        requestTimestamp: meta.requestTimestamp,
        responseTimestamp: meta.responseTimestamp,
        page: meta.page,
        rawPayload: raw
      }
    };
  }

  private static parseDiscount(text: string): { discountType: "percentage" | "flat" | "freebie", discountValue?: string } {
    if (!text) return { discountType: "percentage" }; 

    const t = text.toLowerCase();
    
    // Percentage
    const pctMatch = text.match(/(\d+)%/);
    if (pctMatch) {
      return { discountType: "percentage", discountValue: `${pctMatch[1]}% Off` };
    }

    // Flat (currency like $10, ₹500, etc)
    const flatMatch = text.match(/([$₹£]\d+)/);
    if (flatMatch) {
      return { discountType: "flat", discountValue: `${flatMatch[1]} Off` };
    }

    // Freebie
    if (t.includes("free shipping") || t.includes("free gift")) {
      return { discountType: "freebie", discountValue: "Free" };
    }

    return { discountType: "percentage" };
  }
}
