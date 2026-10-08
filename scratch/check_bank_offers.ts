import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function checkBankOffers() {
    const bankOffers = await prisma.bankOffer.findMany({
        where: { isActive: true, storeId: { not: null } },
        include: { bank: true, store: true },
        take: 10
    });
    
    console.log(`Found ${bankOffers.length} bank offers with stores.`);
    if (bankOffers.length > 0) {
        console.log(bankOffers.map(bo => `${bo.bank.slug}/${bo.store!.slug}`));
    }
}

checkBankOffers().finally(() => prisma.$disconnect());
