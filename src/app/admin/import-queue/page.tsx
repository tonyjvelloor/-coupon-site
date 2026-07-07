import { prisma } from "@/lib/db";
import ImportQueueClient from "./client";

export default async function ImportQueuePage() {
  const pendingOffers = await prisma.importedOffer.findMany({
    where: {
      status: "pending"
    },
    orderBy: {
      finalQualityScore: "desc"
    },
    take: 100
  });

  const allStores = await prisma.store.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  // Map suggestedStoreId to store name inside the offers for easier rendering
  const mappedOffers = pendingOffers.map(offer => {
    const suggestedStore = offer.suggestedStoreId 
      ? allStores.find(s => s.id === offer.suggestedStoreId) 
      : null;
    return {
      ...offer,
      suggestedStoreName: suggestedStore?.name || null
    };
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Import Queue</h1>
        <div className="text-sm text-gray-500">
          Showing top {mappedOffers.length} pending offers sorted by quality
        </div>
      </div>

      <ImportQueueClient offers={mappedOffers} stores={allStores} />
    </div>
  );
}
