import { saleRepository, SaleEventDTO } from "../repositories/sale.repository";

export class SaleService {
  async getUpcomingSales(limit: number = 3): Promise<SaleEventDTO[]> {
    // If the database has no sale events yet (since we haven't seeded them),
    // we can fallback to some static data for the widget demo
    const dbSales = await saleRepository.getUpcomingSales(limit);
    
    if (dbSales.length > 0) {
      return dbSales;
    }

    // Fallback Mock Data for UI presentation
    return [
      {
        id: 'mock1',
        storeName: 'Amazon',
        storeSlug: 'amazon',
        title: 'Prime Day Sale',
        startDate: 'July 18',
        endDate: 'July 19',
        description: 'Biggest discounts on Electronics, Alexa devices, and Fashion.',
        type: 'PRIME_DAY'
      },
      {
        id: 'mock2',
        storeName: 'Flipkart',
        storeSlug: 'flipkart',
        title: 'Big Billion Days',
        startDate: 'September',
        endDate: 'September',
        description: 'The ultimate Flipkart sale of the year. Expect massive iPhone drops.',
        type: 'SALE'
      },
      {
        id: 'mock3',
        storeName: 'Amazon',
        storeSlug: 'amazon',
        title: 'Great Indian Festival',
        startDate: 'October',
        endDate: 'October',
        description: "Amazon's festive season sale. Huge card discounts expected.",
        type: 'SALE'
      }
    ].slice(0, limit);
  }
}

export const saleService = new SaleService();
