
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json(banners);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.imageUrl || !data.link) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const banner = await prisma.banner.create({
            data: {
                imageUrl: data.imageUrl,
                link: data.link,
                title: data.title || null,
                isActive: data.isActive ?? true,
                order: data.order || 0,
            },
        });

        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
    }
}
