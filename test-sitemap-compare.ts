import { prisma } from "./src/lib/db";

async function run() {
    const topStores = await prisma.store.findMany({
        where: { isActive: true, activeOfferCount: { gt: 10 } },
        select: { slug: true, updatedAt: true, storeCategories: { select: { categoryId: true } } }
    });

    console.log(`Found ${topStores.length} top stores.`);

    let pairs = 0;
    for (let i = 0; i < topStores.length; i++) {
        for (let j = i + 1; j < topStores.length; j++) {
            // Check if they share a category
            const sharesCategory = topStores[i].storeCategories.some(c1 => 
                topStores[j].storeCategories.some(c2 => c1.categoryId === c2.categoryId)
            );
            if (sharesCategory) {
                pairs++;
            }
        }
    }
    console.log(`Generated ${pairs} valid comparison pairs.`);
}

run().catch(console.error).finally(() => process.exit());
