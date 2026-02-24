import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
    try {
        await destroySession();
        return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
    }
}
