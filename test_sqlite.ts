import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

async function run() {
    console.log("Testing with adapter as object:");
    try {
        const adapter = new PrismaBetterSqlite3({
            url: 'file:./prisma/dev.db',
        } as any);
        const prisma1 = new PrismaClient({ adapter });
        const users = await prisma1.store.findMany();
        console.log("Adapter created successfully", users.length);
    } catch(e) {
        console.error("Error creating adapter with object:", e);
    }

    console.log("Testing with better-sqlite3 Database:");
    try {
        const db = new Database('./prisma/dev.db');
        const adapter = new PrismaBetterSqlite3(db);
        const prisma2 = new PrismaClient({ adapter });
        const users = await prisma2.store.findMany();
        console.log("Adapter created successfully with Database", users.length);
    } catch(e) {
        console.error("Error creating adapter with Database:", e);
    }
}
run();
