import { prisma } from "@/lib/db";
import { FALLBACK_CATEGORIES } from "@/lib/fallback-catalog";

export class CategoryRepository {
  async getPopularCategories(limit: number = 5) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }, // Assuming displayOrder is used for popularity
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true
        }
      });
      return categories;
    } catch (err) {
      console.warn("[CategoryRepository] getPopularCategories failed, using fallback:", err);
      return FALLBACK_CATEGORIES.slice(0, limit).map(({ id, name, slug, icon }) => ({
        id,
        name,
        slug,
        icon,
      }));
    }
  }
}

export const categoryRepository = new CategoryRepository();
