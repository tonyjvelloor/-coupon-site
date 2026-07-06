import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Test database connectivity by querying the latest migration
        const latestMigration = await prisma.$queryRaw`SELECT migration_name FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 1`;
        
        const migrationName = Array.isArray(latestMigration) && latestMigration.length > 0 
            ? latestMigration[0].migration_name 
            : 'unknown';

        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            migration: migrationName,
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        }, { status: 200 });
        
    } catch (error) {
        console.error("Health check failed:", error);
        return NextResponse.json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
}
