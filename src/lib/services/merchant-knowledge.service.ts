import { prisma } from "@/lib/db";
import { StoreContentType } from "@prisma/client";

export interface CategoryKnowledgeProfile {
  categorySlug: string;
  buyingGuide: string[];
  shippingPolicy: string;
  returnPolicy: string;
  nextMajorSale: string;
  faqs: { question: string; answer: string }[];
}

const CATEGORY_KNOWLEDGE_PROFILES: Record<string, CategoryKnowledgeProfile> = {
  fashion: {
    categorySlug: "fashion",
    buyingGuide: [
      "Stack seasonal clearance discounts with new-user welcome codes (typically 10–15% off).",
      "Shop during End of Season Sales (EOSS) in January and July for peak clearance discounts of up to 70%.",
      "Check bank card offers (HDFC, ICICI, SBI, Axis) at checkout for extra 10% instant savings.",
      "Join loyalty programs to unlock free express delivery and member-exclusive early sale access."
    ],
    shippingPolicy: "Standard delivery within 3–5 business days. Free shipping generally available on orders above ₹499–₹799. Express metro delivery available in select cities.",
    returnPolicy: "Easy 7 to 14-day return and exchange window for unworn clothing and footwear with original tags intact. Doorstep pickup available across most Indian pin codes.",
    nextMajorSale: "End of Season Sale & Festive Fashion Week",
    faqs: [
      {
        question: "How can I get the best discount on apparel and footwear?",
        answer: "Look for first-order welcome vouchers, combine them with active clearance codes, and pay with eligible credit cards for additional 10% instant discounts."
      },
      {
        question: "Are returns free for fashion items?",
        answer: "Most fashion retailers offer free doorstep reverse pickup for exchanges and returns within 7 to 14 days of delivery."
      }
    ]
  },
  electronics: {
    categorySlug: "electronics",
    buyingGuide: [
      "Compare coupon discounts with exchange bonuses on old phones or laptops to maximize total savings.",
      "Peak gadget discounts occur during Republic Day (Jan), Independence Day (Aug), and Diwali sales.",
      "High-value electronics orders usually qualify for no-cost EMI and instant credit card rebates.",
      "Always verify brand warranty registration and tax invoice details upon delivery."
    ],
    shippingPolicy: "Secure, insured transit within 2–4 business days across India. Free shipping on high-value gadgets with open-box verification on eligible pin codes.",
    returnPolicy: "7-day replacement or brand technician inspection for defective or transit-damaged units. Manufacturer warranty covers all functional repairs.",
    nextMajorSale: "Diwali Mega Electronics Fest & Independence Day Tech Sale",
    faqs: [
      {
        question: "Can I get no-cost EMI using electronics coupons?",
        answer: "Yes, many electronics offers support no-cost EMI across leading credit cards (HDFC, ICICI, Axis, SBI) alongside coupon discounts."
      },
      {
        question: "How do exchange offers work on electronics?",
        answer: "You can trade in old devices during checkout for an instant value deduction, which stacks on top of select promotional coupons."
      }
    ]
  },
  "food-dining": {
    categorySlug: "food-dining",
    buyingGuide: [
      "Look for promo codes tailored for weekday lunch and late-night dining hours.",
      "Pay with UPI (Google Pay, PhonePe, Paytm) or co-branded cards for instant cashback credits.",
      "Subscribe to dining or delivery memberships if you place more than 3 orders per month to save on delivery fees.",
      "Combine restaurant-level dish discounts with platform-wide bank coupons."
    ],
    shippingPolicy: "Fast delivery within 30–45 minutes for hot meals, and scheduled 1-2 hour delivery for grocery essentials. Live GPS order tracking included.",
    returnPolicy: "Immediate in-app customer support assistance for incorrect or spilled orders. Instant refunds or wallet balance credits processed directly.",
    nextMajorSale: "Weekend Food Carnival & Festive Feasts",
    faqs: [
      {
        question: "Can I stack restaurant deals with payment coupons?",
        answer: "Yes, platform vouchers can generally be combined with bank offers or digital wallet cashback during checkout."
      },
      {
        question: "Is there a minimum order value for free food delivery?",
        answer: "Orders meeting specified restaurant minimums or placed under premium membership programs qualify for zero delivery fee."
      }
    ]
  },
  travel: {
    categorySlug: "travel",
    buyingGuide: [
      "Book domestic flights 3–4 weeks ahead and international flights 6–8 weeks in advance for lowest base fares.",
      "Check for zero-convenience-fee promo codes and bank discounts on Mondays and Fridays.",
      "Bundle flight tickets and hotel bookings together to unlock package savings.",
      "Choose flexible cancellation fares if travel dates are tentative to avoid cancellation deductions."
    ],
    shippingPolicy: "Instant digital e-ticket and booking voucher delivery via email, SMS, and WhatsApp immediately upon successful payment.",
    returnPolicy: "Cancellations subject to airline and hotel partner policies. Seamless cancellation portal with direct refunds to payment source.",
    nextMajorSale: "Great Indian Travel Sale & Long Weekend Escapes",
    faqs: [
      {
        question: "How do I redeem travel promo codes on flights or hotels?",
        answer: "Enter your coupon code in the 'Promo Code' or 'Bank Offer' box on the payment screen before finalizing your booking."
      },
      {
        question: "Are flight convenience fees waiver coupons available?",
        answer: "Yes, special bank and wallet promotions regularly waive standard convenience fees on domestic flight bookings."
      }
    ]
  },
  "health-beauty": {
    categorySlug: "health-beauty",
    buyingGuide: [
      "Purchase value bundles and skincare kits instead of individual units for better unit economics.",
      "Look for free deluxe travel samples and gift-with-purchase (GWP) thresholds at checkout.",
      "Stock up on daily personal care essentials during seasonal sales (summer skincare, monsoon defense, festive glam).",
      "Sign up for brand loyalty rewards to earn redeemable points on every routine order."
    ],
    shippingPolicy: "Carefully packed, temperature-stable shipment delivered within 3–5 business days across India. Free shipping on qualifying order totals.",
    returnPolicy: "Strict hygiene standard: intact, sealed items eligible for replacement if damaged in transit. Unsealed personal care items non-returnable.",
    nextMajorSale: "Festive Beauty Festival & Mid-Year Self-Care Days",
    faqs: [
      {
        question: "Are beauty and cosmetic products guaranteed authentic?",
        answer: "All products sourced through verified merchant partners carry official manufacturer batch numbers and authentic brand seals."
      },
      {
        question: "How do I get free samples with my beauty order?",
        answer: "Many beauty merchants add complimentary sample miniatures when your order reaches designated cart thresholds."
      }
    ]
  },
  "home-living": {
    categorySlug: "home-living",
    buyingGuide: [
      "Always measure room dimensions and doorway clearance before purchasing large furniture pieces.",
      "Peak clearance discounts on furniture and decor occur during festive seasons (Diwali, Dussehra, New Year).",
      "Utilize no-cost EMI payment plans for high-ticket furniture and home appliance investments.",
      "Look for first-time customer app vouchers offering flat ₹500–₹1,000 discounts."
    ],
    shippingPolicy: "Home decor items ship in 4–7 business days. Large furniture deliveries include scheduled logistics and complimentary on-site assembly.",
    returnPolicy: "7-day return policy for home decor and furnishings. Furniture covered by transit damage inspection and direct part-replacement guarantees.",
    nextMajorSale: "Diwali Home Makeover Sale & New Year Living Fest",
    faqs: [
      {
        question: "Is furniture assembly included with delivery?",
        answer: "Most furniture merchants provide free carpenter assembly within 24–48 hours of doorstep delivery."
      },
      {
        question: "What happens if a home decor item arrives damaged?",
        answer: "Report any transit damage with photos within 48 hours for immediate replacement or full refund processing."
      }
    ]
  },
  entertainment: {
    categorySlug: "entertainment",
    buyingGuide: [
      "Annual subscription plans typically save 20% to 40% compared to monthly recurring charges.",
      "Check whether your telecom provider or credit card bundles free streaming subscriptions before buying.",
      "Look for family plans or multi-screen passes to share subscription costs economically.",
      "Take advantage of festive promo passes and flash discounts during major sports tournaments."
    ],
    shippingPolicy: "Instant digital activation. Subscriptions and digital movie/event tickets are accessible immediately upon checkout.",
    returnPolicy: "Digital passes and subscription tokens are generally non-refundable once activated. Auto-renewal can be disabled anytime in settings.",
    nextMajorSale: "Festive Streaming Extravaganza & Holiday Binge Days",
    faqs: [
      {
        question: "Can I cancel an entertainment subscription at any time?",
        answer: "Yes, you can turn off recurring billing anytime. You will retain access until the end of your current paid billing period."
      },
      {
        question: "Are there student discounts for streaming and media apps?",
        answer: "Many streaming and entertainment platforms offer verified student discounts of 30–50% off regular subscription rates."
      }
    ]
  },
  "sports-fitness": {
    categorySlug: "sports-fitness",
    buyingGuide: [
      "Find the deepest discounts on fitness equipment and activewear during New Year fitness campaigns (January).",
      "Verify batch codes and authenticity seals when purchasing health and protein supplements.",
      "Combine active footwear vouchers with seasonal sports gear clearance events.",
      "Subscribe to brand newsletters for early-bird access to limited edition marathon and training gear."
    ],
    shippingPolicy: "Dispatched in heavy-duty packaging within 24–48 hours. Express transit across Tier-1 and Tier-2 Indian cities.",
    returnPolicy: "7-day exchange window for sizing on sports apparel and footwear. Sealed packaging mandatory for nutritional products.",
    nextMajorSale: "New Year Fitness Revolution & Monsoon Training Sale",
    faqs: [
      {
        question: "How do I ensure nutrition supplements are 100% genuine?",
        answer: "Always order from authorized brand distributors and verify the scratch-code or QR seal on the packaging upon receipt."
      },
      {
        question: "Can I exchange sports shoes if the size doesn't fit?",
        answer: "Yes, 7-day hassle-free size exchanges are supported on unworn sports footwear with intact tags and box."
      }
    ]
  },
  general: {
    categorySlug: "general",
    buyingGuide: [
      "Check CouponHub before completing your purchase to find freshly verified discount codes and deal activations.",
      "Meet minimum purchase thresholds to qualify for free doorstep shipping.",
      "Combine store promo codes with bank card discounts or UPI cashback for maximum savings.",
      "Review cancellation and return guidelines before placing your order."
    ],
    shippingPolicy: "Reliable, tracked shipping across India. Most orders qualify for free standard delivery on meeting minimum cart thresholds.",
    returnPolicy: "Standard merchant return and refund policies apply. Ensure original tags and undamaged packaging are kept intact.",
    nextMajorSale: "Festive Clearance & Big Savings Days",
    faqs: [
      {
        question: "How do I use a promo code during checkout?",
        answer: "Copy the code from CouponHub, proceed to the merchant's checkout screen, and paste it into the 'Promo Code' or 'Voucher' field."
      },
      {
        question: "Why did a coupon code not apply to my cart?",
        answer: "Some promo codes require a minimum cart value or apply only to select product lines. Check the offer terms for specific eligibility details."
      }
    ]
  }
};

export class MerchantKnowledgeService {
  /**
   * Resolves the best knowledge profile for a store given its category associations.
   */
  getKnowledgeProfile(categorySlug?: string | null): CategoryKnowledgeProfile {
    if (categorySlug && CATEGORY_KNOWLEDGE_PROFILES[categorySlug]) {
      return CATEGORY_KNOWLEDGE_PROFILES[categorySlug];
    }
    return CATEGORY_KNOWLEDGE_PROFILES.general;
  }

  /**
   * Generates structured knowledge contents for a single store.
   */
  generateStoreContents(store: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    categorySlug?: string | null;
    bestDiscount?: string | null;
  }) {
    const profile = this.getKnowledgeProfile(store.categorySlug);

    const buyingGuideText = profile.buyingGuide.join("\n");
    const shippingText = profile.shippingPolicy;
    const returnsText = profile.returnPolicy;
    const saleText = profile.nextMajorSale;

    const faqs = [
      {
        question: `How do I redeem a verified ${store.name} coupon on CouponHub?`,
        answer: `Browse active ${store.name} offers on this page. Click 'Activate Deal' or 'Copy Code'. Paste the promo code into the voucher box at checkout on ${store.name}'s official site or app to receive your instant discount.`
      },
      {
        question: `What is the best ${store.name} discount available in India today?`,
        answer: store.bestDiscount
          ? `Today, the highest verified discount available for ${store.name} on CouponHub is ${store.bestDiscount}. Offers are refreshed and tested daily.`
          : `Discounts for ${store.name} change regularly based on active seasonal promotions. Check back daily for new verified codes.`
      },
      {
        question: `Can I combine bank offers with ${store.name} promo codes?`,
        answer: `Yes, many ${store.name} checkout promotions allow stacking instant credit/debit card discounts (e.g., HDFC, ICICI, SBI, Axis Bank) on top of promo codes if your cart meets the minimum purchase threshold.`
      },
      {
        question: `How does CouponHub verify ${store.name} coupons?`,
        answer: `CouponHub verifies ${store.name} promo codes and discounts directly through merchant affiliate feeds, official partnerships, and regular checkout testing. Expired or non-functional codes are promptly removed.`
      },
      ...profile.faqs
    ];

    return [
      { type: StoreContentType.BUYING_GUIDE, content: buyingGuideText },
      { type: StoreContentType.SHIPPING, content: shippingText },
      { type: StoreContentType.RETURNS, content: returnsText },
      { type: StoreContentType.SALE, content: saleText },
      { type: StoreContentType.FAQ, content: JSON.stringify(faqs) }
    ];
  }

  /**
   * Calculates a content quality score (0 to 100) for a store.
   */
  calculateContentQualityScore(store: {
    description?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    activeOfferCount: number;
    categoriesCount: number;
    contentsCount: number;
  }): number {
    let score = 0;
    if (store.activeOfferCount > 0) score += 30;
    if (store.description && store.description.length >= 100) score += 20;
    if (store.seoTitle && store.seoDescription) score += 15;
    if (store.categoriesCount > 0) score += 15;
    if (store.contentsCount >= 4) score += 20;
    return Math.min(100, score);
  }

  /**
   * Batch populates StoreContent for active stores with offers.
   */
  async backfillStoreContent(options: { onlyWithOffers?: boolean; batchSize?: number } = {}) {
    const { onlyWithOffers = true, batchSize = 50 } = options;

    const whereClause: any = { isActive: true };
    if (onlyWithOffers) {
      whereClause.activeOfferCount = { gt: 0 };
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        storeCategories: { include: { category: true } },
        storeContents: true
      },
      orderBy: { activeOfferCount: "desc" }
    });

    let totalCreated = 0;
    let totalUpdatedStores = 0;

    for (const store of stores) {
      const primaryCat = store.storeCategories[0]?.category?.slug || null;
      const contentsToUpsert = this.generateStoreContents({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        categorySlug: primaryCat
      });

      for (const item of contentsToUpsert) {
        await prisma.storeContent.upsert({
          where: {
            storeId_type: {
              storeId: store.id,
              type: item.type
            }
          },
          create: {
            storeId: store.id,
            type: item.type,
            content: item.content,
            lastVerified: new Date()
          },
          update: {
            content: item.content,
            lastVerified: new Date()
          }
        });
        totalCreated++;
      }

      const qualityScore = this.calculateContentQualityScore({
        description: store.description,
        seoTitle: store.seoTitle,
        seoDescription: store.seoDescription,
        activeOfferCount: store.activeOfferCount,
        categoriesCount: store.storeCategories.length,
        contentsCount: contentsToUpsert.length
      });

      await prisma.store.update({
        where: { id: store.id },
        data: {
          knowledgeDensity: 1.0,
          healthScore: {
            qualityScore,
            lastAuditedAt: new Date().toISOString()
          }
        }
      });
      totalUpdatedStores++;
    }

    return { totalStores: stores.length, totalUpdatedStores, totalContentsCreated: totalCreated };
  }
}

export const merchantKnowledgeService = new MerchantKnowledgeService();
