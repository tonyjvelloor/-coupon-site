import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);
        const { success } = rateLimit(ip, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes

        if (!success) {
            console.warn(`Blocked brute-force login attempt from IP: ${ip}`);
            return NextResponse.json(
                { error: "Too many login attempts. Please try again later." },
                { status: 429 }
            );
        }

        console.log("👉 Login API hit");
        const body = await request.json();
        console.log("👉 Request body received", { email: body.email });
        const { email, password } = body;

        if (!email || !password) {
            console.log("❌ Missing credentials");
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        console.log("👉 Calling createSession...");
        const result = await createSession(email, password);
        console.log("👉 createSession result:", result.success ? "Success" : result.error);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 401 });
        }

        return NextResponse.json({ success: true, admin: result.admin });
    } catch (error) {
        console.error("❌ Login error caught in route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
