import { prisma } from "@/lib/db";
import { StoreContentType } from "@prisma/client";

export interface SaleEventDTO {
  id: string;
  storeName: string;
  storeSlug: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  type: string;
}

export class SaleRepository {
  async getUpcomingSales(limit: number = 3): Promise<SaleEventDTO[]> {
    const saleContents = await prisma.storeContent.findMany({
      where: {
        type: {
          in: [StoreContentType.SALE, StoreContentType.BLACK_FRIDAY, StoreContentType.PRIME_DAY]
        }
      },
      include: {
        store: true
      },
      take: limit * 2, // Take more to allow for filtering
    });

    const parsedSales: SaleEventDTO[] = [];

    for (const sc of saleContents) {
      try {
        const parsed = JSON.parse(sc.content);
        if (parsed.title && parsed.startDate) {
          parsedSales.push({
            id: sc.id,
            storeName: sc.store.name,
            storeSlug: sc.store.slug,
            title: parsed.title,
            startDate: parsed.startDate,
            endDate: parsed.endDate || parsed.startDate,
            description: parsed.description || '',
            type: sc.type,
          });
        }
      } catch (e) {
        // If it's not JSON, maybe it's a pipe-separated string like "Oct 15 - Oct 20|Great Indian Festival|Description"
        const parts = sc.content.split('|');
        if (parts.length >= 2) {
          parsedSales.push({
            id: sc.id,
            storeName: sc.store.name,
            storeSlug: sc.store.slug,
            title: parts[1].trim(),
            startDate: parts[0].trim(),
            endDate: parts[0].trim(),
            description: parts[2] ? parts[2].trim() : '',
            type: sc.type
          });
        }
      }
    }

    // Sort or filter if necessary, then limit
    return parsedSales.slice(0, limit);
  }
}

export const saleRepository = new SaleRepository();
