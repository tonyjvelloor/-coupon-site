import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query || query.length < 1) {
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

    const coupons = await prisma.coupon.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } }
        ],
        status: 'ACTIVE',
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        discountValue: true,
        store: {
          select: {
            name: true,
            logo: true,
            slug: true
          }
        }
      },
      take: 5,
    });

    return NextResponse.json({ stores, categories, coupons });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
