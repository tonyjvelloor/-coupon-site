
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const data = await request.json();
        const banner = await prisma.banner.update({
            where: { id: params.id },
            data: {
                imageUrl: data.imageUrl,
                link: data.link,
                title: data.title,
                isActive: data.isActive,
                order: data.order,
            },
        });
        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.banner.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
    }
}
