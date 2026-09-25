import { useState, useEffect, useCallback } from "react";
import productService from "../services/product.service";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryParams,
  PaginatedProductsResponse,
} from "../types/product";
import { extractErrorMessage } from "./useAuthActions";

export const useProducts = (initialParams?: ProductQueryParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedProductsResponse, "docs">>({
    totalDocs: 0,
    limit: initialParams?.limit ?? 10,
    page: initialParams?.page ?? 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ProductQueryParams | undefined>(initialParams);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(params);
      setProducts(data.docs);
      setPagination({
        totalDocs: data.totalDocs,
        limit: data.limit,
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
      });
      return data;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to load products.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(async (dto: CreateProductDto) => {
    try {
      const created = await productService.createProduct(dto);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create product.");
      setError(msg);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, dto: UpdateProductDto) => {
    try {
      const updated = await productService.updateProduct(id, dto);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
      );
      return updated;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update product.");
      setError(msg);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const success = await productService.deleteProduct(id);
      if (success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
      return success;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete product.");
      setError(msg);
      throw err;
    }
  }, []);

  return {
    products,
    pagination,
    isLoading,
    error,
    params,
    setParams,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;
