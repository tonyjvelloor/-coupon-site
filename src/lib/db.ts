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
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel || !dbUrl) {
        if (isVercel) {
            const tmpDbPath = '/tmp/dev.db';
            const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
            if (!fs.existsSync(tmpDbPath)) {
                try {
                    console.log("Attempting to setup DB in /tmp. bundledDbPath:", bundledDbPath, "exists:", fs.existsSync(bundledDbPath));
                    if (fs.existsSync(bundledDbPath)) {
                        fs.copyFileSync(bundledDbPath, tmpDbPath);
                        console.log("Successfully copied DB to /tmp");
                    } else {
                        // Create an empty file if bundled DB doesn't exist
                        fs.writeFileSync(tmpDbPath, '');
                        console.log("Created empty DB in /tmp");
                    }
                } catch (e) {
                    console.error("Failed to setup sqlite DB in /tmp:", e);
                }
            }
            dbUrl = `file:${tmpDbPath}`;
            console.log("Using DB URL:", dbUrl);
        } else {
            const prismaDir = path.join(process.cwd(), 'prisma');
            if (!fs.existsSync(prismaDir)) {
                fs.mkdirSync(prismaDir, { recursive: true });
            }
            dbUrl = `file:${path.join(prismaDir, 'dev.db')}`;
        }
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
