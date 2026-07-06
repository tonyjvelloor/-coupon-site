import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
    // Ensure directory exists for Vercel deployment
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        const prismaDir = path.join(process.cwd(), 'prisma');
        if (!fs.existsSync(prismaDir)) {
            fs.mkdirSync(prismaDir, { recursive: true });
        }
        dbUrl = `file:${path.join(prismaDir, 'dev.db')}`;
    }

    const adapter = new PrismaBetterSqlite3({
        url: dbUrl,
    });

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
