import api from "./api";
import type { Category, CreateCategoryDto, CategoryQueryParams } from "../types/category";

export const categoryService = {
  /**
   * Fetch all active (or all if includeInactive=true) categories
   * GET /products/categories
   */
  async getCategories(params?: CategoryQueryParams): Promise<Category[]> {
    const response = await api.get("/products/categories", {
      params: {
        includeInactive: params?.includeInactive ?? false,
      },
    });

    const resData = response.data?.data ?? response.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (resData && Array.isArray(resData.categories)) {
      return resData.categories;
    }
    return [];
  },

  /**
   * Fetch a single category by ID
   * GET /products/categories/:id
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/products/categories/${id}`);
    const resData = response.data?.data ?? response.data;
    return resData?.category ?? resData;
  },

  /**
   * Create a new category
   * POST /products/categories
   */
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const response = await api.post("/products/categories", dto);
    const resData = response.data?.data ?? response.data;
    return resData?.category ?? resData;
  },

  /**
   * Delete a category
   * DELETE /products/categories/:id
   */
  async deleteCategory(id: string): Promise<boolean> {
    const response = await api.delete(`/products/categories/${id}`);
    return response.data?.status ?? true;
  },
};

export default categoryService;
