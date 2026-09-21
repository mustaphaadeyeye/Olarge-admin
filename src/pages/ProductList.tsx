import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Eye,
  LayoutGrid,
  Table as TableIcon,
  X,
  MapPin,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import FilterDropdown from "../components/FilterDropdown";
import ConfirmActionModal from "../components/ConfirmActionModal";
import ProductDetailsModal from "../components/ProductDetailsModal";
import productService from "../services/product.service";
import categoryService from "../services/category.service";
import type { Product } from "../types/product";
import type { Category } from "../types/category";

const STATUS_OPTIONS = ["All", "Active", "Draft"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
];

const ProductList: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode: Table vs Grid
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Pagination & Filters
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDocs, setTotalDocs] = useState<number>(0);

  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price_asc" | "price_desc">("newest");

  // Modals state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fetch categories once
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

  // Fetch products
  const fetchProducts = useCallback(async () => {
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
        sortBy,
      });

      let docs = res.docs;

      // Filter locally for status if backend pagination returned mixed
      if (statusQuery) {
        docs = docs.filter((p) => p.status?.toLowerCase() === statusQuery);
      }

      // Filter locally for stock state if active
      if (stockFilter === "low") {
        docs = docs.filter((p) => p.stock > 0 && p.stock <= 10);
      } else if (stockFilter === "out") {
        docs = docs.filter((p) => p.stock === 0);
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
  }, [page, limit, selectedCategoryName, selectedStatus, stockFilter, searchTerm, sortBy, categories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      setProductToDelete(null);
      fetchProducts();
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

  // Category name helper
  const getCategoryName = (cat: Category | string | undefined | null): string => {
    if (!cat) return "Uncategorized";
    if (typeof cat === "object" && "name" in cat && cat.name) return cat.name;
    const found = categories.find((c) => c._id === cat);
    return found ? found.name : String(cat);
  };

  // Quick stat computations
  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );
  const activeCount = useMemo(
    () => products.filter((p) => p.status === "active").length,
    [products]
  );

  const categoryOptions = categories.map((c) => c.name);

  const hasActiveFilters = Boolean(
    searchTerm ||
      (selectedCategoryName && selectedCategoryName !== "All Categories") ||
      (selectedStatus && selectedStatus !== "All") ||
      stockFilter !== "all"
  );

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategoryName(null);
    setSelectedStatus(null);
    setStockFilter("all");
    setPage(1);
  };

  return (
    <Wrapper>
      <section className="w-full pb-16 max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-[#2F7A3D] font-medium hover:underline cursor-pointer"
              >
                Dashboard
              </button>
              <ChevronRight size={13} className="text-gray-400" />
              <span className="text-gray-600 font-medium">Product Catalog</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Product Catalog
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#2F7A3D] border border-emerald-200">
                {totalDocs} total listings
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* View switcher */}
            <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200 text-gray-600">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[#2F7A3D] shadow-xs"
                    : "hover:text-gray-900"
                }`}
                title="Table View"
              >
                <TableIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#2F7A3D] shadow-xs"
                    : "hover:text-gray-900"
                }`}
                title="Grid / Card View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              title="Refresh product list"
              className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin text-[#2F7A3D]" : ""}
              />
            </button>

            {/* Add Product Button */}
            <button
              type="button"
              onClick={() => navigate("/product/add")}
              className="
                flex items-center gap-2
                bg-[#2F7A3D] hover:bg-[#256331]
                text-white text-xs sm:text-sm font-semibold
                rounded-lg
                px-4 py-2.5
                transition-all
                cursor-pointer shadow-xs hover:shadow-sm
              "
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stat / KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Card 1: Total */}
          <div
            onClick={() => {
              setStockFilter("all");
              setSelectedStatus(null);
            }}
            className={`bg-white rounded-xl border p-4.5 transition-all cursor-pointer ${
              stockFilter === "all" && !selectedStatus
                ? "border-[#2F7A3D] ring-2 ring-[#2F7A3D]/10 shadow-xs"
                : "border-gray-200/80 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Total Products</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2F7A3D] flex items-center justify-center">
                <PackageCheck size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalDocs}</p>
            <p className="text-[11px] text-gray-400 mt-1">Across all categories</p>
          </div>

          {/* Card 2: Active */}
          <div
            onClick={() => {
              setSelectedStatus("Active");
              setStockFilter("all");
            }}
            className={`bg-white rounded-xl border p-4.5 transition-all cursor-pointer ${
              selectedStatus === "Active"
                ? "border-[#2F7A3D] ring-2 ring-[#2F7A3D]/10 shadow-xs"
                : "border-gray-200/80 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Active Listings</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#2F7A3D] flex items-center justify-center">
                <CheckCircle2 size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">Live for marketplace buyers</p>
          </div>

          {/* Card 3: Low Stock */}
          <div
            onClick={() => setStockFilter(stockFilter === "low" ? "all" : "low")}
            className={`bg-white rounded-xl border p-4.5 transition-all cursor-pointer ${
              stockFilter === "low"
                ? "border-amber-500 ring-2 ring-amber-500/10 shadow-xs"
                : "border-gray-200/80 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Low Stock Alert</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Stock under 10 units</p>
          </div>

          {/* Card 4: Out of Stock */}
          <div
            onClick={() => setStockFilter(stockFilter === "out" ? "all" : "out")}
            className={`bg-white rounded-xl border p-4.5 transition-all cursor-pointer ${
              stockFilter === "out"
                ? "border-red-500 ring-2 ring-red-500/10 shadow-xs"
                : "border-gray-200/80 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Out of Stock</span>
              <span className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <PackageX size={16} />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            <p className="text-[11px] text-red-600 font-medium mt-1">Inventory depleted</p>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Sorters */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by produce title or origin..."
              className="w-full h-10 pl-10 pr-9 rounded-lg border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters & Sorters */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            {/* Category Dropdown */}
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={selectedCategoryName}
              onChange={(val) => {
                setSelectedCategoryName(val);
                setPage(1);
              }}
            />

            {/* Status Dropdown */}
            <FilterDropdown
              label="Status"
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setPage(1);
              }}
            />

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "newest" | "oldest" | "price_asc" | "price_desc"
                  )
                }
                className="h-9.5 px-3 pr-8 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-[#2F7A3D] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-4 text-xs">
            <span className="text-gray-400 font-medium">Applied filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2F7A3D] border border-emerald-200 font-medium">
                Keyword: "{searchTerm}"
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="cursor-pointer hover:text-emerald-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategoryName && selectedCategoryName !== "All Categories" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2F7A3D] border border-emerald-200 font-medium">
                Category: {selectedCategoryName}
                <button
                  type="button"
                  onClick={() => setSelectedCategoryName(null)}
                  className="cursor-pointer hover:text-emerald-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedStatus && selectedStatus !== "All" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[#2F7A3D] border border-emerald-200 font-medium">
                Status: {selectedStatus}
                <button
                  type="button"
                  onClick={() => setSelectedStatus(null)}
                  className="cursor-pointer hover:text-emerald-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {stockFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Stock: {stockFilter === "low" ? "Low Stock" : "Out of Stock"}
                <button
                  type="button"
                  onClick={() => setStockFilter("all")}
                  className="cursor-pointer hover:text-amber-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Global Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="text-xs font-semibold text-red-700 hover:underline ml-3 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Content: Table View */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    <th className="text-left px-5 py-3.5">Produce Item</th>
                    <th className="text-left px-5 py-3.5">Category</th>
                    <th className="text-left px-5 py-3.5">Price</th>
                    <th className="text-left px-5 py-3.5">Inventory</th>
                    <th className="text-left px-5 py-3.5">Farm Origin</th>
                    <th className="text-left px-5 py-3.5">Status</th>
                    <th className="text-right px-5 py-3.5">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw size={24} className="animate-spin text-[#2F7A3D]" />
                          <span className="font-medium text-gray-700">Loading catalog items...</span>
                          <span className="text-xs text-gray-400">Fetching latest agricultural records</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    products.map((product) => {
                      const isOutOfStock = product.stock === 0;
                      const isLowStock = product.stock > 0 && product.stock <= 10;
                      const mainImage = product.images?.[0];

                      return (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50/60 transition-colors group cursor-pointer"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          {/* Produce Item */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                                {mainImage ? (
                                  <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#2F7A3D] bg-emerald-50">
                                    <ShoppingBag size={18} />
                                  </div>
                                )}
                                {product.isFeatured && (
                                  <span className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-500 text-white shadow-xs" title="Featured">
                                    <Star size={9} className="fill-white" />
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-[240px]">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#2F7A3D] transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                  {product.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-3.5 text-xs text-gray-600">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                              <Layers size={11} className="text-[#2F7A3D]" />
                              {getCategoryName(product.category)}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-5 py-3.5">
                            <div className="text-sm font-extrabold text-[#2F7A3D]">
                              ₦{Number(product.price).toLocaleString()}
                            </div>
                            <span className="text-[11px] text-gray-400">per {product.unit || "unit"}</span>
                          </td>

                          {/* Inventory */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-900">{product.stock}</span>
                              <span className="text-xs text-gray-500">{product.unit || "units"}</span>
                            </div>
                            {isOutOfStock ? (
                              <span className="inline-block text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md mt-0.5">
                                Out of stock
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md mt-0.5">
                                Low stock
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] font-semibold text-emerald-700 mt-0.5">
                                Healthy stock
                              </span>
                            )}
                          </td>

                          {/* Farm Origin */}
                          <td className="px-5 py-3.5 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-gray-400 shrink-0" />
                              <span className="font-medium text-gray-800">{product.state || "Nigeria"}</span>
                            </div>
                            {product.lga && (
                              <span className="text-[11px] text-gray-400 pl-4 block">{product.lga}</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 text-xs">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                product.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  product.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                                }`}
                              />
                              {product.status || "active"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td
                            className="px-5 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setQuickViewProduct(product)}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Quick View"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate(`/product/edit/${product._id}`)}
                                className="p-2 rounded-lg text-gray-400 hover:text-[#2F7A3D] hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductToDelete(product)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {!loading && products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-1">
                            <ShoppingBag size={28} />
                          </div>
                          <p className="font-bold text-gray-800">No products match criteria</p>
                          <p className="text-xs text-gray-400">
                            Try adjusting your search keywords, clearing status filters, or adding a new produce listing.
                          </p>
                          {hasActiveFilters ? (
                            <button
                              type="button"
                              onClick={clearAllFilters}
                              className="mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Clear all filters
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => navigate("/product/add")}
                              className="mt-2 px-4 py-2 bg-[#2F7A3D] hover:bg-[#256331] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              + Add First Product
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!loading && products.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 bg-white border-t border-gray-100 text-xs text-gray-500 gap-3">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-8 px-2 rounded-md border border-gray-200 text-xs text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-[#2F7A3D]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>
                    entries • Page <strong className="text-gray-800">{page}</strong> of{" "}
                    <strong className="text-gray-800">{totalPages}</strong> ({totalDocs} total)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          page === pageNum
                            ? "bg-[#2F7A3D] text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRightIcon size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Products Content: Grid / Card View */
          <div>
            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw size={28} className="animate-spin text-[#2F7A3D] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Loading catalog items...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center">
                <ShoppingBag size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="font-bold text-gray-800">No products found</p>
                <p className="text-xs text-gray-400 mt-1">Try clearing filters or search terms.</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded-lg cursor-pointer"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => {
                  const mainImage = product.images?.[0];
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 10;

                  return (
                    <div
                      key={product._id}
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer"
                    >
                      {/* Card Cover Photo */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                            <ShoppingBag size={28} />
                            <span className="text-[10px] text-gray-400 mt-1">No Image</span>
                          </div>
                        )}

                        {/* Badges Overlay */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-gray-800 shadow-xs flex items-center gap-1">
                            <Layers size={10} className="text-[#2F7A3D]" />
                            {getCategoryName(product.category)}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          {product.isFeatured && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                              ★
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              product.status === "active"
                                ? "bg-emerald-600/90 text-white"
                                : "bg-gray-800/80 text-white"
                            }`}
                          >
                            {product.status || "active"}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#2F7A3D] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {product.description || "Agricultural produce listing"}
                          </p>

                          <div className="mt-3 flex items-baseline justify-between">
                            <div>
                              <span className="text-base font-extrabold text-[#2F7A3D]">
                                ₦{Number(product.price).toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">/ {product.unit || "unit"}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOutOfStock
                                  ? "bg-red-50 text-red-600"
                                  : isLowStock
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {isOutOfStock ? "Out of Stock" : `${product.stock} ${product.unit}s`}
                            </span>
                          </div>
                        </div>

                        {/* Origin & Action Bar */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1 text-[11px] truncate max-w-[130px]">
                            <MapPin size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate">{product.state}</span>
                          </span>

                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(product)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Quick View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/product/edit/${product._id}`)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-[#2F7A3D] hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(product)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick View Details Modal */}
      <ProductDetailsModal
        open={!!quickViewProduct}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        categories={categories}
        onEdit={(prod) => {
          setQuickViewProduct(null);
          navigate(`/product/edit/${prod._id}`);
        }}
        onDelete={(prod) => {
          setQuickViewProduct(null);
          setProductToDelete(prod);
        }}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmActionModal
        open={!!productToDelete}
        title="Delete Agricultural Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? It will be removed from marketplace catalog searches.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Wrapper>
  );
};

export default ProductList;