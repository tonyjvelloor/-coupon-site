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
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { code: { contains: query, mode: 'insensitive' } }
            ]
          },
          {
            OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
            ]
          }
        ],
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        discountValue: true,
        merchantIdentity: {
          select: {
            store: {
              select: {
                name: true,
                logo: true,
                slug: true
              }
            }
          }
        }
      },
      take: 5,
    });

    const formattedCoupons = coupons.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      code: c.code,
      discountValue: c.discountValue,
      store: c.merchantIdentity?.store ? {
        name: c.merchantIdentity.store.name,
        logo: c.merchantIdentity.store.logo,
        slug: c.merchantIdentity.store.slug
      } : { name: 'Store', logo: null, slug: '#' }
    }));

    return NextResponse.json({ stores, categories, coupons: formattedCoupons });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
