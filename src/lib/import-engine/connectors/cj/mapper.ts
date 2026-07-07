import { NormalizedOffer } from "../../types";

export class CJMapper {
  /**
   * Maps a raw CJ Affiliate link object to the NormalizedOffer canonical model.
   * Based on CJ Affiliate API v3 Link payload format.
   */
  static toCanonical(raw: any): NormalizedOffer {
    // Parse discount info
    const { discountType, discountValue } = this.parseDiscount(raw.description || raw.link_name);
    
    let expiry: Date | undefined;
    if (raw.promotion_end_date) {
      expiry = new Date(raw.promotion_end_date);
    }

    return {
      merchantName: raw.advertiser_name || "Unknown CJ Merchant",
      title: raw.link_name,
      description: raw.description,
      code: raw.coupon_code || undefined, // CJ uses coupon_code explicitly if it is a coupon
      destinationUrl: raw.destination || raw.click_url,
      affiliateUrl: raw.click_url,
      discountType,
      discountValue,
      expiry,
      category: raw.category || undefined,
      source: "cj",
      externalId: raw.link_id?.toString()
    };
  }

  private static parseDiscount(text: string): { discountType: "percentage" | "flat" | "freebie", discountValue?: string } {
    if (!text) return { discountType: "percentage" }; // Default fallback

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
