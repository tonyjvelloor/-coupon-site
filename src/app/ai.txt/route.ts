import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    const content = `Knowledge Graph

Merchant
Coupon
Buying Guide
FAQ
Shipping
Returns
Student Discount
Policy
Timeline
Collections
`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
