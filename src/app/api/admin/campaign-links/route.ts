import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

// GET - List all campaign links
export async function GET() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const campaignLinks = await prisma.campaignLink.findMany({
            include: { store: { select: { id: true, name: true, logo: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(campaignLinks);
    } catch (error) {
        console.error("Error fetching campaign links:", error);
        return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
    }
}

// POST - Create new campaign link
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await request.json();

        // Validate required fields
        if (!data.name || !data.slug || !data.destinationUrl) {
            return NextResponse.json(
                { error: "Name, slug, and destination URL are required" },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existing = await prisma.campaignLink.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: "A link with this slug already exists" },
                { status: 400 }
            );
        }

        const campaignLink = await prisma.campaignLink.create({
            data: {
                name: data.name,
                slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                destinationUrl: data.destinationUrl,
                description: data.description || null,
                storeId: data.storeId || null,
                utmSource: data.utmSource || null,
                utmMedium: data.utmMedium || null,
                utmCampaign: data.utmCampaign || null,
                isActive: data.isActive ?? true,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });

        return NextResponse.json(campaignLink, { status: 201 });
    } catch (error) {
        console.error("Error creating campaign link:", error);
        return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }
}
