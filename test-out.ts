import { prisma } from './src/lib/db';

async function main() {
    try {
        await prisma.outboundEvent.create({
            data: {
                id: crypto.randomUUID(),
                subid: crypto.randomUUID(),
                clickSessionId: null,
                merchantId: null, // we can test without merchantId
                couponId: null,
                redirectMode: 'INSTANT',
                affiliateUrl: 'https://test.com',
                status: 'SUCCESS'
            }
        });
        console.log("Success!");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
