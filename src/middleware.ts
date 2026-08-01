import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EXPERIMENTS } from './lib/ab-testing';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    
    // 1. Assign or read device ID
    let deviceId = request.cookies.get('ch_device_id')?.value;
    if (!deviceId) {
        deviceId = uuidv4();
        response.cookies.set('ch_device_id', deviceId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });
    }

    // 2. Assign A/B test groups for active experiments if not already assigned
    for (const [key, experiment] of Object.entries(EXPERIMENTS)) {
        const cookieName = `ch_exp_${experiment.id}`;
        if (!request.cookies.has(cookieName)) {
            // Assign based on deterministic hash of deviceId + experiment.id
            let hash = 0;
            const str = `${deviceId}:${experiment.id}`;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            const normalizedHash = Math.abs(hash) / 2147483647;
            
            let cumulative = 0;
            let variant = experiment.variants[0];
            for (let i = 0; i < experiment.weights.length; i++) {
                cumulative += experiment.weights[i];
                if (normalizedHash < cumulative) {
                    variant = experiment.variants[i];
                    break;
                }
            }

            response.cookies.set(cookieName, variant, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                sameSite: 'lax',
            });
        }
    }

    return response;
}

export const config = {
    // Apply middleware to pages, exclude api/static files
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ],
};
