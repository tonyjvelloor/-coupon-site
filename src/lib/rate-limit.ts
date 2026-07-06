interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export function rateLimit(
    ip: string,
    limit: number,
    windowMs: number
): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();

    // Clean up expired entries occasionally to prevent memory leaks in long-running processes
    if (Math.random() < 0.05) {
        for (const key in store) {
            if (store[key].resetTime < now) {
                delete store[key];
            }
        }
    }

    // Initialize or reset if time window passed
    if (!store[ip] || store[ip].resetTime < now) {
        store[ip] = {
            count: 1,
            resetTime: now + windowMs,
        };
        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: store[ip].resetTime,
        };
    }

    // Increment count
    store[ip].count++;

    // Check if over limit
    if (store[ip].count > limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: store[ip].resetTime,
        };
    }

    return {
        success: true,
        limit,
        remaining: limit - store[ip].count,
        reset: store[ip].resetTime,
    };
}

export function getClientIp(req: Request): string {
    // Try to get IP from x-forwarded-for header (common behind proxies/Cloudflare/Vercel)
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can be a comma-separated list of IPs. The first one is the client.
        return forwardedFor.split(",")[0].trim();
    }

    // Try to get IP from x-real-ip
    const realIp = req.headers.get("x-real-ip");
    if (realIp) {
        return realIp.trim();
    }

    // Fallback if no headers are present (e.g., local development)
    return "127.0.0.1";
}
