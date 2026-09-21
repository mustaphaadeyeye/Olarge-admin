import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Layers,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import categoryService from "../services/category.service";
import type { Category } from "../types/category";

interface CategoryDetailsModalProps {
  categoryId: string | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (categoryId: string) => void;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  categoryId,
  open,
  onClose,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !categoryId) return;

    let ignore = false;

    categoryService
      .getCategoryById(categoryId)
      .then((data) => {
        if (!ignore) {
          setCategory(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          let msg = "Failed to load category details.";
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
  }, [categoryId, open]);

  if (!open) return null;

  const handleViewProducts = () => {
    if (!category) return;
    onClose();
    navigate(`/product`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="
          bg-white rounded-xl shadow-xl w-full max-w-lg
          overflow-hidden border border-gray-100 flex flex-col
          max-h-[90vh] animate-fadeIn
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#2F7A3D]">
              <Layers size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Category Details</h2>
              <p className="text-[11px] text-gray-500">GET /products/categories/:id</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={30} className="animate-spin text-[#2F7A3D] mb-2" />
              <p className="text-xs text-gray-500">Loading category from backend...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {!loading && category && (
            <>
              {/* Image banner */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 text-[#2F7A3D]">
                    <Layers size={36} className="opacity-40 mb-1" />
                    <span className="text-xs font-medium opacity-60">No image assigned</span>
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    category.isActive
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-gray-700 text-white shadow-xs"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Title & Slug */}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <span className="inline-block mt-1 text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#2F7A3D] border border-emerald-200">
                  slug: #{category.slug}
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-1">Description</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {category.description || "No description provided for this category."}
                </p>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase">
                    <Calendar size={12} /> Created At
                  </span>
                  <span className="text-xs text-gray-800 mt-1 block">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 uppercase">
                    <Calendar size={12} /> Last Updated
                  </span>
                  <span className="text-xs text-gray-800 mt-1 block">
                    {category.updatedAt
                      ? new Date(category.updatedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {category && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(category._id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleViewProducts}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#2F7A3D] hover:bg-[#256331] transition-colors shadow-xs"
          >
            <span>View Products</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;
