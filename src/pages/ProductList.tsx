import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  PackageCheck,
  AlertTriangle,
  PackageX,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ShoppingBag,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import FilterDropdown from "../components/FilterDropdown";
import ConfirmActionModal from "../components/ConfirmActionModal";
import productService from "../services/product.service";
import categoryService from "../services/category.service";
import type { Product } from "../types/product";
import type { Category } from "../types/category";

const STATUS_OPTIONS = ["All", "Active", "Draft"];

const ProductList: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDocs, setTotalDocs] = useState<number>(0);

  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch categories once for filter
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await categoryService.getCategories();
        setCategories(catList);
      } catch (err) {
        console.error("Failed to load categories for filter", err);
      }
    };
    loadCategories();
  }, []);

  // Refresh products on demand (e.g. refresh button or after delete)
  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let categoryId: string | undefined;
      if (selectedCategoryName && selectedCategoryName !== "All Categories") {
        const matched = categories.find((c) => c.name === selectedCategoryName);
        if (matched) categoryId = matched._id;
      }

      const statusQuery =
        selectedStatus && selectedStatus !== "All"
          ? selectedStatus.toLowerCase()
          : undefined;

      const res = await productService.getProducts({
        page,
        limit,
        category: categoryId,
        search: searchTerm.trim() || undefined,
        ...(statusQuery ? { sortBy: "newest" } : {}),
      });

      let docs = res.docs;
      if (statusQuery) {
        docs = docs.filter((p) => p.status?.toLowerCase() === statusQuery);
      }

      setProducts(docs);
      setTotalDocs(res.totalDocs);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      let msg = "Failed to load products. Please check connection or API key.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCategoryName, selectedStatus, searchTerm, categories]);

  // Synchronize products on query/filter changes
  useEffect(() => {
    let ignore = false;
    let categoryId: string | undefined;
    if (selectedCategoryName && selectedCategoryName !== "All Categories") {
      const matched = categories.find((c) => c.name === selectedCategoryName);
      if (matched) categoryId = matched._id;
    }

    const statusQuery =
      selectedStatus && selectedStatus !== "All"
        ? selectedStatus.toLowerCase()
        : undefined;

    productService
      .getProducts({
        page,
        limit,
        category: categoryId,
        search: searchTerm.trim() || undefined,
        ...(statusQuery ? { sortBy: "newest" } : {}),
      })
      .then((res) => {
        if (!ignore) {
          let docs = res.docs;
          if (statusQuery) {
            docs = docs.filter((p) => p.status?.toLowerCase() === statusQuery);
          }
          setProducts(docs);
          setTotalDocs(res.totalDocs);
          setTotalPages(res.totalPages || 1);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          let msg = "Failed to load products. Please check connection or API key.";
          if (typeof err === "object" && err !== null && "response" in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            if (axiosErr.response?.data?.message) {
              msg = axiosErr.response.data.message;
            }
          } else if (err instanceof Error) {
            msg = err.message;
          }
          setError(msg);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, selectedCategoryName, selectedStatus, searchTerm, categories]);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      setProductToDelete(null);
      refreshProducts();
    } catch (err: unknown) {
      let msg = "Failed to delete product.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for category label
  const getCategoryName = (cat: Category | string | undefined | null): string => {
    if (!cat) return "Uncategorized";
    if (typeof cat === "object" && "name" in cat && cat.name) return cat.name;
    const found = categories.find((c) => c._id === cat);
    return found ? found.name : String(cat);
  };

  // Quick stat computations
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const categoryOptions = categories.map((c) => c.name);

  return (
    <Wrapper>
      <section className="w-full">
        {/* Breadcrumb + Add Product */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-[#2F7A3D] font-medium hover:underline cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight size={15} className="text-[#B5B5B5]" />
            <span className="text-[#8A8A8A]">Product List</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshProducts}
              disabled={loading}
              title="Refresh products"
              className="p-2.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-[#2F7A3D]" : ""} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/product/add")}
              className="
                flex items-center gap-2
                bg-[#2F7A3D] hover:bg-[#256331]
                text-white text-sm font-medium
                rounded-md
                px-4 py-2.5
                transition-colors
                cursor-pointer shadow-xs
              "
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#2F7A3D]/40 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Total Products</p>
              <span className="w-7 h-7 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center">
                <PackageCheck size={14} className="text-[#2F7A3D]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">
              {totalDocs} {totalDocs === 1 ? "product" : "products"}
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Available across all categories</p>
          </div>

          <div className="bg-white rounded-lg border border-[#D98A00]/40 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Low Stock</p>
              <span className="w-7 h-7 rounded-full bg-[#D98A00]/10 flex items-center justify-center">
                <AlertTriangle size={14} className="text-[#D98A00]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">
              {lowStockCount} {lowStockCount === 1 ? "product" : "products"}
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Stock under 10 units</p>
          </div>

          <div className="bg-white rounded-lg border border-[#E23434]/40 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Out of Stock</p>
              <span className="w-7 h-7 rounded-full bg-[#E23434]/10 flex items-center justify-center">
                <PackageX size={14} className="text-[#E23434]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">
              {outOfStockCount} {outOfStockCount === 1 ? "product" : "products"}
            </h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Stock depleted</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search products by name or description..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={selectedCategoryName}
              onChange={(val) => {
                setSelectedCategoryName(val);
                setPage(1);
              }}
            />
            <FilterDropdown
              label="Status"
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={refreshProducts}
              className="text-xs font-semibold text-red-700 hover:underline ml-3"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-[#F0F0F0] bg-gray-50/70">
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Product Name</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Category</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Price</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Stock</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Location</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#888]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={22} className="animate-spin text-[#2F7A3D]" />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && products.map((product) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= 10;
                const statusBadgeColor =
                  product.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-700 border-gray-200";

                const mainImage = product.images?.[0];

                return (
                  <tr key={product._id} className="border-b border-[#F5F5F5] last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    {/* Name + Image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#F3F3F3] shrink-0 border border-gray-200">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#2F7A3D] bg-emerald-50">
                              <ShoppingBag size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#2B2B2B] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#8A8A8A] line-clamp-1 max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-sm text-[#555]">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-700">
                        {getCategoryName(product.category)}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-sm font-semibold text-[#2B2B2B]">
                      ₦{Number(product.price).toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-sm text-[#555]">
                      <span className="font-medium text-gray-800">{product.stock}</span>{" "}
                      <span className="text-xs text-gray-500">{product.unit || "units"}</span>
                      {isOutOfStock ? (
                        <p className="text-[10px] font-semibold text-red-600">Out of stock</p>
                      ) : isLowStock ? (
                        <p className="text-[10px] font-semibold text-amber-600">Low stock</p>
                      ) : null}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-xs text-[#666]">
                      {product.state ? `${product.state}${product.lga ? `, ${product.lga}` : ""}` : "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-xs font-medium">
                      <span className={`inline-block px-2.5 py-1 rounded-full border uppercase text-[10px] font-bold tracking-wider ${statusBadgeColor}`}>
                        {product.status || "active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/product/edit/${product._id}`)}
                          className="text-[#2F7A3D] hover:text-[#256331] transition-colors cursor-pointer p-1 rounded hover:bg-emerald-50"
                          title="Edit product"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="text-[#E23434] hover:text-[#C22525] transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#999]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag size={28} className="text-gray-300" />
                      <p className="text-gray-600 font-medium">No products match these filters.</p>
                      <button
                        onClick={() => navigate("/product/add")}
                        className="text-xs text-[#2F7A3D] hover:underline mt-1"
                      >
                        + Add your first product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {!loading && products.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 bg-white border-t border-gray-100 text-xs text-gray-500">
              <div>
                Showing page <span className="font-semibold text-gray-800">{page}</span> of{" "}
                <span className="font-semibold text-gray-800">{totalPages}</span> ({totalDocs} total)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Modal for Delete */}
      <ConfirmActionModal
        open={!!productToDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This product will be archived.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Wrapper>
  );
};

export default ProductList;