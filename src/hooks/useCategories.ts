import { useState, useEffect, useCallback } from "react";
import categoryService from "../services/category.service";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryParams,
} from "../types/category";
import { extractErrorMessage } from "./useAuthActions";

export const useCategories = (initialParams?: CategoryQueryParams) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CategoryQueryParams | undefined>(initialParams);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories(params);
      setCategories(data);
      return data;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to load categories.");
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (dto: CreateCategoryDto) => {
    try {
      const created = await categoryService.createCategory(dto);
      setCategories((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create category.");
      setError(msg);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, dto: UpdateCategoryDto) => {
    try {
      const updated = await categoryService.updateCategory(id, dto);
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...updated } : c))
      );
      return updated;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update category.");
      setError(msg);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const success = await categoryService.deleteCategory(id);
      if (success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
      return success;
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete category.");
      setError(msg);
      throw err;
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    setParams,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
