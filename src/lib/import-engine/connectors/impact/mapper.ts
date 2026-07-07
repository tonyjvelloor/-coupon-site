import { NormalizedOffer } from "../../types";

export class ImpactMapper {
  static mapToCanonical(raw: any): NormalizedOffer {
    // Impact uses various fields, we abstract them here.
    // E.g., Impact Ads endpoint
    // { "Id": "123", "CampaignName": "Nike", "Name": "10% off Shoes", "Description": "...", "PromoCode": "NIKE10", "TrackingLink": "http...", "LandingPageUrl": "...", "EndDate": "..." }

    const isCoupon = !!raw.PromoCode;

    return {
      merchantName: raw.CampaignName || "Unknown Merchant",
      title: raw.Name || "Special Offer",
      description: raw.Description || "",
      code: raw.PromoCode || undefined,
      destinationUrl: raw.LandingPageUrl || raw.TrackingLink || "",
      affiliateUrl: raw.TrackingLink || "",
      discountType: isCoupon ? "percentage" : "flat", // Simplification; a real mapper might regex the description
      expiry: raw.EndDate ? new Date(raw.EndDate) : undefined,
      source: "impact",
      externalId: raw.Id
    };
  }
}
