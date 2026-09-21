import api from "./api";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryParams,
  PaginatedProductsResponse,
} from "../types/product";

export const productService = {
  /**
   * Browse & search products with filtering and pagination
   * GET /products
   */
  async getProducts(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
    const response = await api.get("/products", { params });
    const resData = response.data?.data ?? response.data;

    // Normalizing fallback structure if backend returns an array
    if (Array.isArray(resData)) {
      return {
        docs: resData,
        totalDocs: resData.length,
        limit: params?.limit ?? 10,
        page: params?.page ?? 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    // Check if products pagination object is nested under resData.products
    const paginationSource = resData?.products && typeof resData.products === "object" && !Array.isArray(resData.products)
      ? resData.products
      : resData;

    // If products is directly an array
    const docs = Array.isArray(paginationSource?.docs)
      ? paginationSource.docs
      : Array.isArray(paginationSource?.products)
      ? paginationSource.products
      : Array.isArray(resData?.products)
      ? resData.products
      : [];

    const totalDocs = Number(paginationSource?.totalDocs ?? docs.length);
    const limit = Number(paginationSource?.limit ?? params?.limit ?? 10);
    const page = Number(paginationSource?.page ?? params?.page ?? 1);
    const totalPages = Number(paginationSource?.totalPages ?? (Math.ceil(totalDocs / limit) || 1));

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage: paginationSource?.hasNextPage ?? page < totalPages,
      hasPrevPage: paginationSource?.hasPrevPage ?? page > 1,
    };
  },

  /**
   * Get single product by MongoDB ID
   * GET /products/:id
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    const resData = response.data?.data ?? response.data;
    return resData?.product ?? resData;
  },

  /**
   * Create a new agricultural product
   * POST /products
   */
  async createProduct(dto: CreateProductDto): Promise<Product> {
    const response = await api.post("/products", dto);
    const resData = response.data?.data ?? response.data;
    return resData?.product ?? resData;
  },

  /**
   * Update an existing product
   * PATCH /products/:id
   */
  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const response = await api.patch(`/products/${id}`, dto);
    const resData = response.data?.data ?? response.data;
    return resData?.product ?? resData;
  },

  /**
   * Delete or archive a product
   * DELETE /products/:id
   */
  async deleteProduct(id: string): Promise<boolean> {
    const response = await api.delete(`/products/${id}`);
    return response.data?.status ?? true;
  },
};

export default productService;
