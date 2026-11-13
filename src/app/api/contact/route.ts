import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(80),
    lastName: z.string().trim().max(80).optional().default(""),
    email: z.string().trim().email("Please enter a valid email address").max(160),
    topic: z.string().trim().min(1).max(80).optional().default("General Inquiry"),
    message: z.string().trim().min(10, "Please provide at least 10 characters in your message").max(3000),
});

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const { success } = rateLimit(`contact:${ip}`, 5, 60 * 1000);

        if (!success) {
            return NextResponse.json(
                { error: "Too many messages sent. Please wait a minute before trying again." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const data = contactSchema.parse(body);

        // Structured server-side audit log for Vercel runtime logs / alerting
        console.info("[ContactForm] Inquiry received", {
            topic: data.topic,
            email: data.email,
            name: `${data.firstName} ${data.lastName}`.trim(),
            messageLength: data.message.length,
            receivedAt: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                message: "Thank you for contacting CouponHub. Our editorial support team will reply within 1–2 business days.",
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message || "Please check all required fields." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Unable to send your message right now. Please email support@couponhub.store directly." },
            { status: 500 }
        );
    }
}
