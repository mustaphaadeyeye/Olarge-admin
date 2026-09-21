import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Search,
  Layers,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  Eye,
  Trash2,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import AddCategoryModal from "../components/AddCategoryModal";
import CategoryDetailsModal from "../components/CategoryDetailsModal";
import ConfirmActionModal from "../components/ConfirmActionModal";
import categoryService from "../services/category.service";
import type { Category } from "../types/category";

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories({ includeInactive: true });
      setCategories(data);
    } catch (err: unknown) {
      let msg = "Failed to load categories. Please check your network or API configuration.";
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
  };

  useEffect(() => {
    let ignore = false;
    categoryService
      .getCategories({ includeInactive: true })
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          let msg = "Failed to load categories. Please check your network or API configuration.";
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
  }, []);

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev]);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(categoryToDelete._id);
      setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
      setCategoryToDelete(null);
    } catch (err: unknown) {
      let msg = "Failed to delete category.";
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

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "active") return cat.isActive;
      if (statusFilter === "inactive") return !cat.isActive;
      return true;
    });
  }, [categories, searchTerm, statusFilter]);

  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <Wrapper>
      <section className="w-full">
        {/* Breadcrumb + Add Category Button */}
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
            <span className="text-[#8A8A8A]">Categories</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchCategories}
              disabled={loading}
              title="Refresh list"
              className="p-2.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-[#2F7A3D]" : ""} />
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
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
              Add Category
            </button>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#2F7A3D]/30 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Total Categories</p>
              <span className="w-7 h-7 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center">
                <Layers size={14} className="text-[#2F7A3D]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">{totalCount}</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Produce groupings configured</p>
          </div>

          <div className="bg-white rounded-lg border border-emerald-200 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Active Categories</p>
              <span className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-emerald-600" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-emerald-700">{activeCount}</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Available for new products</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Inactive Categories</p>
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <XCircle size={14} className="text-gray-500" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">{inactiveCount}</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Hidden from public listing</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category name or slug..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D]"
            />
          </div>

          {/* Controls: Status filter & View mode */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === "active" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === "inactive" ? "bg-white text-gray-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inactive
              </button>
            </div>

            {/* Grid / Table toggle */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-[#2F7A3D]/10 text-[#2F7A3D]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table view"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table" ? "bg-[#2F7A3D]/10 text-[#2F7A3D]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchCategories}
              className="text-xs font-semibold text-red-700 hover:underline ml-3"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-3">
                <div className="w-full h-36 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded-md w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center text-[#2F7A3D]">
              <FolderOpen size={28} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">No categories found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              {searchTerm
                ? `No categories match "${searchTerm}". Try a different search query or clear the filter.`
                : "Get started by creating your first agricultural produce category."}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-[#2F7A3D] font-medium hover:underline"
              >
                Clear search filter
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#2F7A3D] hover:bg-[#256331] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Create Category
              </button>
            )}
          </div>
        )}

        {/* Content: Grid View */}
        {!loading && filteredCategories.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setSelectedCategoryId(cat._id)}
                className="
                  bg-white rounded-xl border border-gray-200 overflow-hidden
                  shadow-xs hover:shadow-md hover:border-[#2F7A3D]/40
                  transition-all duration-200 flex flex-col cursor-pointer group
                "
              >
                {/* Category Image */}
                <div className="relative h-40 bg-gray-100 w-full overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=60";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 text-[#2F7A3D]">
                      <Layers size={32} className="opacity-40 mb-1" />
                      <span className="text-[11px] font-medium opacity-60">No Image</span>
                    </div>
                  )}

                  {/* Status badge floating */}
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                      cat.isActive
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-gray-700 text-white shadow-xs"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#2F7A3D] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] font-mono text-[#2F7A3D] bg-emerald-50 inline-block px-1.5 py-0.5 rounded mb-2">
                      #{cat.slug}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {cat.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : "Active"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategoryId(cat._id);
                        }}
                        className="flex items-center gap-1 text-[#2F7A3D] font-medium hover:underline p-1 cursor-pointer"
                        title="View details"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryToDelete(cat);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content: Table View */}
        {!loading && filteredCategories.length > 0 && viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#2F7A3D] bg-emerald-50">
                                <Layers size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{cat.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#2F7A3D]">
                        {cat.slug}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600 max-w-xs truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cat.isActive ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {cat.createdAt
                          ? new Date(cat.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryId(cat._id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#2F7A3D] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="View category details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="inline-flex items-center p-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Add Category Modal */}
      <AddCategoryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* View Category Details by ID Modal */}
      <CategoryDetailsModal
        categoryId={selectedCategoryId}
        open={!!selectedCategoryId}
        onClose={() => setSelectedCategoryId(null)}
        onDelete={(id) => {
          const cat = categories.find((c) => c._id === id);
          if (cat) setCategoryToDelete(cat);
        }}
      />

      {/* Confirm Delete Category Modal */}
      <ConfirmActionModal
        open={!!categoryToDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action will remove the category from your catalog.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
      />
    </Wrapper>
  );
};

export default Categories;
