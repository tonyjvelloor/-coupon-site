import { prisma } from "../src/lib/db";

async function main() {
    const store = await prisma.store.findFirst({
        where: { slug: { contains: 'envato' } }
    });
    console.log("Envato store:", store);
    
    const store2 = await prisma.store.findFirst({
        where: { slug: { contains: 'xtusimple' } }
    });
    console.log("Xtusimple store:", store2);
}
main().finally(() => prisma.$disconnect());
