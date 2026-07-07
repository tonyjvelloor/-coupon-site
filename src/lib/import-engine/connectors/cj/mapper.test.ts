import { describe, it, expect } from "vitest";
import { CJMapper } from "./mapper";

describe("CJMapper", () => {
  it("should parse percentage discounts correctly", () => {
    const raw = {
      link_id: "123",
      advertiser_name: "Nike",
      link_name: "20% Off Shoes",
      coupon_code: "SHOES20",
      click_url: "http://cj.com/track",
      destination: "http://nike.com"
    };

    const normalized = CJMapper.toCanonical(raw);

    expect(normalized.merchantName).toBe("Nike");
    expect(normalized.title).toBe("20% Off Shoes");
    expect(normalized.discountType).toBe("percentage");
    expect(normalized.discountValue).toBe("20% Off");
    expect(normalized.code).toBe("SHOES20");
    expect(normalized.externalId).toBe("123");
  });

  it("should parse flat discounts correctly", () => {
    const raw = {
      link_id: "456",
      advertiser_name: "Best Buy",
      link_name: "$50 Off Laptops",
      click_url: "http://cj.com/track",
      destination: "http://bestbuy.com"
    };

    const normalized = CJMapper.toCanonical(raw);

    expect(normalized.merchantName).toBe("Best Buy");
    expect(normalized.discountType).toBe("flat");
    expect(normalized.discountValue).toBe("$50 Off");
  });

  it("should parse freebies correctly", () => {
    const raw = {
      link_id: "789",
      advertiser_name: "Target",
      link_name: "Free Shipping on Everything",
      click_url: "http://cj.com/track",
      destination: "http://target.com"
    };

    const normalized = CJMapper.toCanonical(raw);

    expect(normalized.discountType).toBe("freebie");
    expect(normalized.discountValue).toBe("Free");
  });
});
