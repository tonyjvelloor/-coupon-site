import { prisma } from "@/lib/db";

export class CategoryRepository {
  async getPopularCategories(limit: number = 5) {
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
  }
}

export const categoryRepository = new CategoryRepository();
