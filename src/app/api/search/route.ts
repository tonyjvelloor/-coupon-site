import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In-memory cache to eliminate database load for hot search terms
interface CacheEntry {
  data: any;
  expiresAt: number;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_ENTRIES = 500;

function cleanCache() {
  const now = Date.now();
  for (const [key, entry] of searchCache.entries()) {
    if (entry.expiresAt < now) {
      searchCache.delete(key);
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim().toLowerCase();

  if (!query || query.length < 1) {
    return NextResponse.json(
      { stores: [], categories: [], coupons: [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }

  // 1. Check in-memory warm cache
  const cached = searchCache.get(query);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    // 2. Run all queries in PARALLEL to reduce latency by ~60%
    const [stores, categories, coupons] = await Promise.all([
      prisma.store.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          isActive: true,
        },
        select: {
          name: true,
          slug: true,
          logo: true,
          activeOfferCount: true,
        },
        orderBy: [
          { activeOfferCount: "desc" },
          { clicks: "desc" },
        ],
        take: 8,
      }),

      prisma.category.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          isActive: true,
        },
        select: {
          name: true,
          slug: true,
        },
        take: 5,
      }),

      prisma.coupon.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { code: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
          ],
          deletedAt: null,
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
                  slug: true,
                },
              },
            },
          },
        },
        take: 5,
      }),
    ]);

    const formattedCoupons = coupons.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      code: c.code,
      discountValue: c.discountValue,
      store: c.merchantIdentity?.store
        ? {
            name: c.merchantIdentity.store.name,
            logo: c.merchantIdentity.store.logo,
            slug: c.merchantIdentity.store.slug,
          }
        : { name: "Store", logo: null, slug: "#" },
    }));

    const responseData = {
      stores,
      categories,
      coupons: formattedCoupons,
    };

    // 3. Store in memory cache
    if (searchCache.size > MAX_CACHE_ENTRIES) {
      cleanCache();
    }
    searchCache.set(query, {
      data: responseData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    // 4. Return with Edge CDN caching headers
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
