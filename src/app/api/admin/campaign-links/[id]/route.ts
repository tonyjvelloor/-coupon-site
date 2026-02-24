import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ id: string }>;
}

// GET - Get single campaign link
export async function GET(request: NextRequest, { params }: Props) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const campaignLink = await prisma.campaignLink.findUnique({
            where: { id },
            include: { store: { select: { id: true, name: true, logo: true } } },
        });

        if (!campaignLink) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json(campaignLink);
    } catch (error) {
        console.error("Error fetching campaign link:", error);
        return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
    }
}

// PUT - Update campaign link
export async function PUT(request: NextRequest, { params }: Props) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const data = await request.json();

        const campaignLink = await prisma.campaignLink.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                destinationUrl: data.destinationUrl,
                description: data.description || null,
                storeId: data.storeId || null,
                utmSource: data.utmSource || null,
                utmMedium: data.utmMedium || null,
                utmCampaign: data.utmCampaign || null,
                isActive: data.isActive,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });

        return NextResponse.json(campaignLink);
    } catch (error) {
        console.error("Error updating campaign link:", error);
        return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
    }
}

// DELETE - Delete campaign link
export async function DELETE(request: NextRequest, { params }: Props) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.campaignLink.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting campaign link:", error);
        return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
    }
}
