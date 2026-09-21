import type { Category } from "./category";

export type ProductStatus = "active" | "draft" | "archived" | string;

export interface ProductSeller {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category | string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  state: string;
  lga?: string;
  sellerId: ProductSeller | string;
  status: ProductStatus;
  isFeatured: boolean;
  harvestDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  images?: string[];
  state: string;
  lga?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  harvestDate?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export type ProductSortOption = "newest" | "oldest" | "price_asc" | "price_desc";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  state?: string;
  unit?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: string;
  search?: string;
  sortBy?: ProductSortOption;
}

export interface PaginatedProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
