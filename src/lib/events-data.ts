import { prisma } from "@/lib/db";

export interface SaleEventData {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    description?: string | null;
    seoTitle?: string | null;
    date: Date;
    icon: string;
    isActive: boolean;
    store?: {
        name: string;
        slug: string;
        logo?: string | null;
    } | null;
}

export const FALLBACK_SALE_EVENTS: SaleEventData[] = [
    {
        id: "event-diwali-2026",
        slug: "diwali-sale-2026",
        title: "Diwali Sale 2026",
        subtitle: "India's Biggest Festival Shopping Season",
        description: "The Diwali Sale is India's largest shopping event — bigger than Black Friday in India. Get the deepest discounts on fashion, electronics, home decor, and beauty from Amazon, Flipkart, Myntra, Ajio, Nykaa, and 200+ brands. CouponHub curates every verified coupon code and cashback offer so you stack maximum savings this festive season.",
        seoTitle: "Diwali Sale 2026: Best Coupon Codes, Deals & Bank Offers | CouponHub",
        date: new Date("2026-10-20T00:00:00.000Z"),
        icon: "celebration",
        isActive: true,
        store: null
    },
    {
        id: "event-gif-2026",
        slug: "great-indian-festival-2026",
        title: "Amazon Great Indian Festival 2026",
        subtitle: "Amazon's Biggest Annual Sale in India",
        description: "Amazon Great Indian Festival is India's largest online shopping event. Get verified coupon codes, bank card discounts, and exclusive cashback offers on mobiles, laptops, TVs, fashion, kitchen appliances and more. Stack Amazon promo codes with HDFC, SBI, and ICICI card offers for maximum savings.",
        seoTitle: "Amazon Great Indian Festival 2026: Coupon Codes & Bank Offers | CouponHub",
        date: new Date("2026-10-10T00:00:00.000Z"),
        icon: "local_fire_department",
        isActive: true,
        store: {
            name: "Amazon",
            slug: "amazon",
            logo: "/images/stores/amazon.png"
        }
    },
    {
        id: "event-bbd-2026",
        slug: "big-billion-days-2026",
        title: "Flipkart Big Billion Days 2026",
        subtitle: "Flipkart's Annual Mega Sale Event",
        description: "Flipkart Big Billion Days is the most anticipated sale of the year. Grab verified Flipkart coupon codes, SuperCoin offers, and bank card deals on smartphones, electronics, fashion, and home appliances. CouponHub updates every live Big Billion Days promo code in real time.",
        seoTitle: "Flipkart Big Billion Days 2026: Coupon Codes & Offers | CouponHub",
        date: new Date("2026-10-08T00:00:00.000Z"),
        icon: "shopping_bag",
        isActive: true,
        store: {
            name: "Flipkart",
            slug: "flipkart",
            logo: "/images/stores/flipkart.png"
        }
    },
    {
        id: "event-eors-2026",
        slug: "end-of-reason-sale-2026",
        title: "Myntra End of Reason Sale 2026",
        subtitle: "Myntra's Twice-a-Year Fashion Sale",
        description: "Myntra's End of Reason Sale (EORS) is India's biggest fashion sale. Get verified Myntra coupon codes, cashback offers, and bank discounts on clothing, shoes, accessories and beauty from 5,000+ brands.",
        seoTitle: "Myntra End of Reason Sale 2026: Coupon Codes & Cashback | CouponHub",
        date: new Date("2026-12-05T00:00:00.000Z"),
        icon: "style",
        isActive: true,
        store: {
            name: "Myntra",
            slug: "myntra",
            logo: "/images/stores/myntra.png"
        }
    }
];

export async function getSaleEventBySlug(slug: string): Promise<SaleEventData | null> {
    try {
        const event = await prisma.saleEvent.findUnique({
            where: { slug, isActive: true },
            include: { store: { select: { name: true, slug: true, logo: true } } },
        });
        if (event) {
            return event as any;
        }
    } catch (e) {
        console.warn(`[events-data] DB lookup failed for "${slug}", using static fallback`);
    }

    return FALLBACK_SALE_EVENTS.find(e => e.slug === slug) || null;
}

export async function getAllSaleEvents(): Promise<SaleEventData[]> {
    try {
        const events = await prisma.saleEvent.findMany({
            where: { isActive: true },
            orderBy: { date: "asc" },
            include: { store: { select: { name: true, slug: true, logo: true } } },
        });
        if (events && events.length > 0) {
            return events as any;
        }
    } catch (e) {
        console.warn("[events-data] DB query failed, using static fallback");
    }

    return FALLBACK_SALE_EVENTS;
}
