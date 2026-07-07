import { describe, it, expect } from 'vitest';
import { ImpactMapper } from './mapper';

describe('ImpactMapper', () => {
  it('maps a coupon correctly', () => {
    const raw = {
      Id: "123",
      CampaignName: "Nike",
      Name: "10% off Shoes",
      Description: "Save big",
      PromoCode: "NIKE10",
      TrackingLink: "http://track.com",
      LandingPageUrl: "http://nike.com",
      EndDate: "2027-12-31T00:00:00Z"
    };

    const normalized = ImpactMapper.mapToCanonical(raw);

    expect(normalized.merchantName).toBe("Nike");
    expect(normalized.title).toBe("10% off Shoes");
    expect(normalized.code).toBe("NIKE10");
    expect(normalized.discountType).toBe("percentage");
    expect(normalized.source).toBe("impact");
    expect(normalized.externalId).toBe("123");
  });

  it('maps a deal correctly (no promo code)', () => {
    const raw = {
      Id: "456",
      CampaignName: "Target",
      Name: "Clearance Sale",
      TrackingLink: "http://track.com",
    };

    const normalized = ImpactMapper.mapToCanonical(raw);

    expect(normalized.code).toBeUndefined();
    expect(normalized.discountType).toBe("flat");
    expect(normalized.destinationUrl).toBe("http://track.com"); // Fallback
  });
});
