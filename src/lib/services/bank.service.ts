import { prisma } from "@/lib/db";

export interface IndianBankDefinition {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  logo?: string;
}

export const INDIAN_BANKS: IndianBankDefinition[] = [
  {
    name: "HDFC Bank",
    slug: "hdfc",
    description: "Verified HDFC Bank credit and debit card offers, Millennia and Regalia card discounts, and no-cost EMI deals across India's top retailers.",
    seoTitle: "HDFC Bank Credit & Debit Card Offers, Coupons & Instant Discounts",
  },
  {
    name: "ICICI Bank",
    slug: "icici",
    description: "Exclusive ICICI Bank credit card discounts, Amazon Pay ICICI card 5% cashback, net banking promotions, and instant checkout vouchers.",
    seoTitle: "ICICI Bank Credit Card Offers, Instant Discounts & Coupons",
  },
  {
    name: "SBI Card",
    slug: "sbi",
    description: "State Bank of India (SBI) credit card deals, SimplyCLICK and Cashback card offers, festive shopping savings, and electronics discounts.",
    seoTitle: "SBI Credit Card Offers, Coupons & Instant Discounts",
  },
  {
    name: "Axis Bank",
    slug: "axis",
    description: "Axis Bank credit and debit card instant discounts, Flipkart Axis Bank 5% unlimited cashback, dining delights, and flight booking vouchers.",
    seoTitle: "Axis Bank Card Offers, Coupons & Cashback Deals",
  },
  {
    name: "Kotak Mahindra Bank",
    slug: "kotak",
    description: "Kotak Mahindra Bank credit card discounts, 811 account deals, and seasonal sale promotions across fashion, electronics, and dining.",
    seoTitle: "Kotak Bank Credit Card Offers, Coupons & Instant Discounts",
  },
  {
    name: "AU Small Finance Bank",
    slug: "au-bank",
    description: "AU Small Finance Bank credit and debit card offers, monthly dining cashbacks, and instant percentage discounts on top Indian shopping apps.",
    seoTitle: "AU Bank Card Offers, Coupons & Promo Codes",
  },
];

export class BankService {
  /**
   * Retrieves all active banks with their live offer counts.
   */
  async getAllActiveBanks() {
    return prisma.bank.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            bankOffers: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Retrieves a single bank by slug with active bank offers and linked stores.
   */
  async getBankBySlug(slug: string) {
    return prisma.bank.findUnique({
      where: { slug, isActive: true },
      include: {
        bankOffers: {
          where: { isActive: true },
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                description: true,
                cashbackRate: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Seeds all major Indian banks and associates authentic offers with top stores.
   */
  async seedIndianBanksAndOffers() {
    const bankMap: Record<string, string> = {};

    // 1. Seed or update banks
    for (const bankDef of INDIAN_BANKS) {
      const bank = await prisma.bank.upsert({
        where: { slug: bankDef.slug },
        create: {
          name: bankDef.name,
          slug: bankDef.slug,
          description: bankDef.description,
          seoTitle: bankDef.seoTitle,
          isActive: true,
        },
        update: {
          name: bankDef.name,
          description: bankDef.description,
          seoTitle: bankDef.seoTitle,
          isActive: true,
        },
      });
      bankMap[bankDef.slug] = bank.id;
    }

    // 2. Fetch target stores
    const targetSlugs = [
      "amazon",
      "flipkart",
      "myntra",
      "swiggy",
      "zomato",
      "croma-retail",
      "tata-cliq",
      "ajio",
      "nykaa-beauty",
      "makemytrip-hotels",
    ];

    const stores = await prisma.store.findMany({
      where: { slug: { in: targetSlugs }, isActive: true },
      select: { id: true, slug: true, name: true },
    });

    const storeMap: Record<string, string> = {};
    for (const s of stores) {
      storeMap[s.slug] = s.id;
    }

    // 3. Define curated, authentic bank offers
    const curatedOffers = [
      // Amazon
      {
        bankSlug: "icici",
        storeSlug: "amazon",
        discountDetails: "5% Unlimited Cashback on Amazon Pay ICICI Card",
        terms: "Directly credited to Amazon Pay balance every month. 5% for Prime, 3% for non-Prime members.",
      },
      {
        bankSlug: "hdfc",
        storeSlug: "amazon",
        discountDetails: "10% Instant Discount up to ₹1,500 on HDFC Credit Cards",
        terms: "Valid on min order value ₹5,000 across electronics, home appliances, and fashion.",
      },
      {
        bankSlug: "sbi",
        storeSlug: "amazon",
        discountDetails: "10% Instant Savings on SBI Credit Cards",
        terms: "Applicable on smartphones and electronics during festive sales with min cart ₹4,999.",
      },

      // Flipkart
      {
        bankSlug: "axis",
        storeSlug: "flipkart",
        discountDetails: "5% Unlimited Cashback with Flipkart Axis Bank Card",
        terms: "No minimum purchase required. Direct credit to monthly card statement.",
      },
      {
        bankSlug: "icici",
        storeSlug: "flipkart",
        discountDetails: "10% Instant Discount on ICICI Bank Cards",
        terms: "On minimum order value of ₹4,999 across appliances and tech accessories.",
      },
      {
        bankSlug: "kotak",
        storeSlug: "flipkart",
        discountDetails: "10% Instant Savings on Kotak Mahindra Bank Cards",
        terms: "Valid on fashion and beauty orders above ₹2,000.",
      },

      // Myntra
      {
        bankSlug: "kotak",
        storeSlug: "myntra",
        discountDetails: "10% Instant Discount up to ₹1,000 on Kotak Cards",
        terms: "Valid on minimum spend of ₹2,500 on top fashion brands.",
      },
      {
        bankSlug: "icici",
        storeSlug: "myntra",
        discountDetails: "Flat 10% Off with ICICI Bank Credit & Debit Cards",
        terms: "Applicable on apparel and footwear with minimum order value of ₹2,999.",
      },
      {
        bankSlug: "hdfc",
        storeSlug: "myntra",
        discountDetails: "10% Instant Off on HDFC Bank Cards",
        terms: "On min order value of ₹3,000. Stackable with select product-level coupons.",
      },

      // Swiggy
      {
        bankSlug: "hdfc",
        storeSlug: "swiggy",
        discountDetails: "10% Cashback on Swiggy HDFC Bank Credit Card",
        terms: "Max cashback ₹1,500 per billing cycle, credited directly as Swiggy Money.",
      },
      {
        bankSlug: "axis",
        storeSlug: "swiggy",
        discountDetails: "15% Off up to ₹100 using Axis Bank Cards",
        terms: "Use coupon AXIS150 during checkout. Minimum order value ₹400.",
      },
      {
        bankSlug: "icici",
        storeSlug: "swiggy",
        discountDetails: "20% Off up to ₹120 on ICICI Bank Net Banking",
        terms: "Valid on food delivery orders above ₹499 on select weekdays.",
      },

      // Zomato
      {
        bankSlug: "icici",
        storeSlug: "zomato",
        discountDetails: "Flat ₹50 Off on orders above ₹299 with ICICI Bank",
        terms: "Valid once per week per customer across all restaurants on Zomato.",
      },
      {
        bankSlug: "hdfc",
        storeSlug: "zomato",
        discountDetails: "15% Off up to ₹150 on Zomato Dining via PayEazy",
        terms: "Pay dining bills with HDFC Bank Credit or Debit Cards.",
      },
      {
        bankSlug: "sbi",
        storeSlug: "zomato",
        discountDetails: "10% Instant Discount on SBI Credit Cards",
        terms: "Applicable on weekend dining bills and food delivery.",
      },

      // Croma
      {
        bankSlug: "hdfc",
        storeSlug: "croma-retail",
        discountDetails: "Up to ₹3,000 Instant Discount + No-Cost EMI on HDFC Cards",
        terms: "Valid on refrigerators, ACs, LED TVs, and laptops above ₹15,000.",
      },
      {
        bankSlug: "icici",
        storeSlug: "croma-retail",
        discountDetails: "10% Instant Off up to ₹2,500 with ICICI Bank Cards",
        terms: "On minimum purchase of ₹12,000 in-store and online at croma.com.",
      },

      // AJIO
      {
        bankSlug: "sbi",
        storeSlug: "ajio",
        discountDetails: "10% Instant Off on SBI Credit Cards",
        terms: "On minimum cart value of ₹2,999 during festive fashion sales.",
      },
      {
        bankSlug: "hdfc",
        storeSlug: "ajio",
        discountDetails: "Flat 10% Instant Discount up to ₹1,000 on HDFC Cards",
        terms: "Valid on premium footwear and apparel collections.",
      },

      // Nykaa Beauty
      {
        bankSlug: "au-bank",
        storeSlug: "nykaa-beauty",
        discountDetails: "10% Instant Discount up to ₹500 on AU Bank Cards",
        terms: "Valid on cosmetics and skincare on minimum order of ₹1,500.",
      },
      {
        bankSlug: "icici",
        storeSlug: "nykaa-beauty",
        discountDetails: "10% Off with ICICI Bank Debit & Credit Cards",
        terms: "On luxury beauty and fragrance brands during seasonal sales.",
      },

      // MakeMyTrip
      {
        bankSlug: "hdfc",
        storeSlug: "makemytrip-hotels",
        discountDetails: "Flat 12% Off on Domestic Flights & Hotel Bookings",
        terms: "Use coupon HDFCDOM with HDFC Bank Credit Cards on minimum booking ₹4,000.",
      },
      {
        bankSlug: "icici",
        storeSlug: "makemytrip-hotels",
        discountDetails: "Up to ₹2,000 Instant Discount on ICICI Bank Cards",
        terms: "Applicable on Monday domestic flight bookings.",
      },
      {
        bankSlug: "sbi",
        storeSlug: "makemytrip-hotels",
        discountDetails: "Flat 10% Off with SBI Credit Cards",
        terms: "Valid on domestic hotel bookings with no blackout dates.",
      },
    ];

    let seededCount = 0;

    for (const offer of curatedOffers) {
      const bankId = bankMap[offer.bankSlug];
      const storeId = storeMap[offer.storeSlug];

      if (!bankId || !storeId) continue;

      // Check if identical offer exists
      const existing = await prisma.bankOffer.findFirst({
        where: {
          bankId,
          storeId,
          discountDetails: offer.discountDetails,
        },
      });

      if (!existing) {
        await prisma.bankOffer.create({
          data: {
            bankId,
            storeId,
            discountDetails: offer.discountDetails,
            terms: offer.terms,
            isActive: true,
          },
        });
        seededCount++;
      }
    }

    // 4. Tag existing coupons with bank names
    const bankKeywords = [
      { name: "HDFC", regex: /hdfc/i },
      { name: "ICICI", regex: /icici/i },
      { name: "SBI", regex: /\bsbi\b/i },
      { name: "Axis", regex: /axis/i },
      { name: "Kotak", regex: /kotak/i },
      { name: "AU Bank", regex: /\bau\s*bank\b/i },
    ];

    const coupons = await prisma.coupon.findMany({
      where: {
        bank: null,
        OR: [
          { title: { contains: "HDFC", mode: "insensitive" } },
          { title: { contains: "ICICI", mode: "insensitive" } },
          { title: { contains: "SBI", mode: "insensitive" } },
          { title: { contains: "Axis", mode: "insensitive" } },
          { title: { contains: "Kotak", mode: "insensitive" } },
          { description: { contains: "HDFC", mode: "insensitive" } },
          { description: { contains: "ICICI", mode: "insensitive" } },
          { description: { contains: "SBI", mode: "insensitive" } },
          { description: { contains: "Axis", mode: "insensitive" } },
          { description: { contains: "Kotak", mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, description: true },
    });

    let taggedCouponsCount = 0;
    for (const coupon of coupons) {
      const text = `${coupon.title} ${coupon.description || ""}`;
      for (const kw of bankKeywords) {
        if (kw.regex.test(text)) {
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { bank: kw.name },
          });
          taggedCouponsCount++;
          break;
        }
      }
    }

    return {
      banksCount: INDIAN_BANKS.length,
      offersSeeded: seededCount,
      couponsTagged: taggedCouponsCount,
    };
  }
}

export const bankService = new BankService();
