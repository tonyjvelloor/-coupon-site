import { prisma } from "../src/lib/db";

async function main() {
    const store = await prisma.store.findFirst();
    if (!store) {
        console.log("No store found");
        return;
    }
    console.log("Store ID:", store.id);

    // Now, we could optionally fire 100 requests to localhost:3000 here
    // We will do that with a bash command after getting the ID.
}

main().catch(console.error).finally(() => prisma.$disconnect());
