import { prisma } from "@/lib/db";

export interface GeneratedStoreSeo {
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export class StoreSeoGeneratorService {
  /**
   * Generates category-aware, human-readable SEO copy for a store.
   */
  generateSeo(storeName: string, categorySlug?: string | null): GeneratedStoreSeo {
    const cleanName = storeName.trim();
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

    switch (categorySlug) {
      case "fashion":
        return {
          description: `${cleanName} is a premier fashion and lifestyle destination offering trendy apparel, footwear, and accessories. Shop the latest collections and save more on your order with 100% verified ${cleanName} coupons, discount codes, and exclusive festive deals on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Promo Codes – ${monthYear}`,
          seoDescription: `Find verified ${cleanName} coupons, discount codes & sale offers for ${monthYear}. Save big on trending fashion, clothing & accessories on CouponHub India.`
        };

      case "electronics":
        return {
          description: `${cleanName} is a trusted destination for modern electronics, smart gadgets, and cutting-edge tech accessories. Get the best value on your purchases with active ${cleanName} promo codes, limited-time discount vouchers, and verified deals on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Discount Codes – ${monthYear}`,
          seoDescription: `Discover active ${cleanName} coupons, tech deals & promo codes for ${monthYear}. Save on electronics, gadgets & accessories today with CouponHub India.`
        };

      case "travel":
        return {
          description: `${cleanName} offers seamless travel bookings, holiday packages, and convenient transportation solutions across India and worldwide. Plan your next journey and cut travel expenses using verified ${cleanName} coupons, flight & hotel discount codes on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Travel Offers – ${monthYear}`,
          seoDescription: `Book and save with verified ${cleanName} coupons, flight deals & promo codes for ${monthYear}. Get the best travel discounts on CouponHub India.`
        };

      case "food-dining":
        return {
          description: `${cleanName} delivers mouth-watering meals, gourmet cuisines, and convenient online food ordering from top eateries. Satisfy your cravings for less with working ${cleanName} coupons, flat discount vouchers, and special meal deals on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Food Deals – ${monthYear}`,
          seoDescription: `Order your favorites and save with active ${cleanName} coupons, promo codes & deals for ${monthYear}. Enjoy verified food discounts on CouponHub India.`
        };

      case "health-beauty":
        return {
          description: `${cleanName} specializes in premium skincare, beauty essentials, cosmetics, and wellness products. Enhance your personal care regimen with verified ${cleanName} discount codes, gift offers, and exclusive seasonal coupons curated on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Beauty Deals – ${monthYear}`,
          seoDescription: `Get the best ${cleanName} coupons, promo codes & beauty discounts for ${monthYear}. Save on authentic skincare, wellness & cosmetics on CouponHub India.`
        };

      case "home-living":
        return {
          description: `${cleanName} offers curated home decor, elegant furnishings, kitchenware, and lifestyle essentials to elevate your living space. Redesign your home for less with working ${cleanName} coupons, clearance deals, and promo codes on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Home Deals – ${monthYear}`,
          seoDescription: `Refresh your space with verified ${cleanName} coupons, promo codes & home deals for ${monthYear}. Find top decor discounts on CouponHub India.`
        };

      case "sports-fitness":
        return {
          description: `${cleanName} provides high-performance activewear, gym gear, fitness accessories, and sports nutrition for an active lifestyle. Power your workouts and save with verified ${cleanName} coupons, promo codes, and discount offers on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Fitness Offers – ${monthYear}`,
          seoDescription: `Achieve your fitness goals with verified ${cleanName} coupons & promo codes for ${monthYear}. Save on sports gear, gym wear & nutrition on CouponHub India.`
        };

      case "entertainment":
        return {
          description: `${cleanName} offers top-tier entertainment, digital gaming, streaming subscriptions, and fun experiences. Unlock premium entertainment for less with verified ${cleanName} discount codes, special promo passes, and bundle deals on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Entertainment Deals – ${monthYear}`,
          seoDescription: `Enjoy your favorite games & shows with verified ${cleanName} coupons for ${monthYear}. Save on digital subscriptions & tickets on CouponHub India.`
        };

      default:
        return {
          description: `${cleanName} is a leading online shopping destination known for quality products and dependable service. Maximize your savings on every order with 100% verified ${cleanName} coupons, promotional discount codes, and daily updated deals on CouponHub India.`,
          seoTitle: `${cleanName} Coupons & Promo Codes – ${monthYear}`,
          seoDescription: `Find 100% verified ${cleanName} coupons, promo codes & deals for ${monthYear}. Save more on your orders with working discounts on CouponHub India.`
        };
    }
  }

  /**
   * Backfills missing descriptions, seoTitle, and seoDescription in chunked batches.
   */
  async backfillMissing(options?: { overwrite?: boolean; batchSize?: number }) {
    const overwrite = options?.overwrite ?? false;
    const batchSize = options?.batchSize ?? 100;

    const whereClause: any = overwrite
      ? { isActive: true }
      : {
          isActive: true,
          OR: [
            { description: null },
            { description: "" },
            { seoTitle: null },
            { seoTitle: "" },
            { seoDescription: null },
            { seoDescription: "" }
          ]
        };

    const storesToUpdate = await prisma.store.findMany({
      where: whereClause,
      include: {
        storeCategories: {
          include: { category: true }
        }
      }
    });

    let updatedCount = 0;

    for (let i = 0; i < storesToUpdate.length; i += batchSize) {
      const chunk = storesToUpdate.slice(i, i + batchSize);
      
      await prisma.$transaction(
        chunk.map((store) => {
          const primaryCategory = store.storeCategories[0]?.category.slug || null;
          const generated = this.generateSeo(store.name, primaryCategory);

          const dataToUpdate: any = {};

          if (overwrite || !store.description || store.description.trim() === "") {
            dataToUpdate.description = generated.description;
          }
          if (overwrite || !store.seoTitle || store.seoTitle.trim() === "") {
            dataToUpdate.seoTitle = generated.seoTitle;
          }
          if (overwrite || !store.seoDescription || store.seoDescription.trim() === "") {
            dataToUpdate.seoDescription = generated.seoDescription;
          }

          return prisma.store.update({
            where: { id: store.id },
            data: dataToUpdate
          });
        })
      );

      updatedCount += chunk.length;
    }

    const remainingMissing = await prisma.store.count({
      where: {
        isActive: true,
        OR: [{ description: null }, { description: "" }]
      }
    });

    return {
      totalFound: storesToUpdate.length,
      updatedCount,
      remainingMissing
    };
  }
}

export const storeSeoGeneratorService = new StoreSeoGeneratorService();
