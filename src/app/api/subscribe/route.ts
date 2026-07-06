import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const subscribeSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const { success } = rateLimit(ip, 3, 60 * 1000); // 3 attempts per minute

        if (!success) {
            console.warn(`Blocked newsletter spam from IP: ${ip}`);
            return NextResponse.json(
                { error: "Too many subscription attempts. Please try again later." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email } = subscribeSchema.parse(body);

        // Check if subscriber already exists
        const existingSubscriber = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            // If exists but inactive, reactivate
            if (!existingSubscriber.isActive) {
                await prisma.subscriber.update({
                    where: { email },
                    data: { isActive: true },
                });
                return NextResponse.json(
                    { message: "Subscription reactivated successfully!" },
                    { status: 200 }
                );
            }

            // Already subscribed and active
            return NextResponse.json(
                { message: "You are already subscribed to our newsletter!" },
                { status: 200 }
            );
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: {
                email,
                isActive: true,
            },
        });

        return NextResponse.json(
            { message: "Successfully subscribed to the newsletter!" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Newsletter Subscription Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to subscribe to the newsletter. Please try again later." },
            { status: 500 }
        );
    }
}
