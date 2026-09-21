import api from "./api";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryParams,
} from "../types/category";

export const categoryService = {
  /**
   * List all active produce categories (or all if includeInactive=true)
   * GET /products/categories?includeInactive=true|false
   * Requires: x-api-key
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
   * Get single category by MongoDB ID
   * GET /products/categories/:id
   * Requires: x-api-key
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/products/categories/${id}`);
    const resData = response.data?.data ?? response.data;
    return resData?.category ?? resData;
  },

  /**
   * Create a new agricultural product category
   * POST /products/categories
   * Body: { name, description?, image?, isActive? }
   * Requires: Admin JWT token + x-api-key
   */
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const response = await api.post("/products/categories", dto);
    const resData = response.data?.data ?? response.data;
    return resData?.category ?? resData;
  },

  /**
   * Update an existing agricultural product category
   * PATCH /products/categories/:id
   * Body: { name?, description?, image?, isActive? }
   * Requires: Admin JWT token + x-api-key
   */
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch(`/products/categories/${id}`, dto);
    const resData = response.data?.data ?? response.data;
    return resData?.category ?? resData;
  },

  /**
   * Delete an agricultural produce category if no products are linked
   * DELETE /products/categories/:id
   * Requires: Admin JWT token + x-api-key
   */
  async deleteCategory(id: string): Promise<boolean> {
    const response = await api.delete(`/products/categories/${id}`);
    return response.data?.status ?? true;
  },
};

export default categoryService;
