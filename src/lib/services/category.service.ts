import { categoryRepository } from "../repositories/category.repository";

export class CategoryService {
  async getPopularCategories(limit: number = 5) {
    return await categoryRepository.getPopularCategories(limit);
  }
}

export const categoryService = new CategoryService();
