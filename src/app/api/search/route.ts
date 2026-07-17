import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json({ stores: [], categories: [] });
  }

  try {
    const stores = await prisma.store.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        isActive: true,
      },
      select: {
        name: true,
        slug: true,
        logo: true,
      },
      take: 8,
    });

    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
        isActive: true,
      },
      select: {
        name: true,
        slug: true,
      },
      take: 5,
    });

    return NextResponse.json({ stores, categories });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
