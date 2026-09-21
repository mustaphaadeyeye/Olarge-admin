import React, { useState, useEffect } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import categoryService from "../services/category.service";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../types/category";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onCategoryCreated?: (category: Category) => void;
  onCategorySaved?: (category: Category) => void;
  categoryToEdit?: Category | null;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose,
  onCategoryCreated,
  onCategorySaved,
  categoryToEdit,
}) => {
  const isEditing = Boolean(categoryToEdit);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Sync state when editing or opening
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      setImage(categoryToEdit.image || "");
      setIsActive(categoryToEdit.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setImage("");
      setIsActive(true);
    }
    setError(null);
    setImgError(false);
  }, [categoryToEdit, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && categoryToEdit) {
        const updatePayload: UpdateCategoryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          image: image.trim() || undefined,
          isActive,
        };

        const updatedCategory = await categoryService.updateCategory(
          categoryToEdit._id,
          updatePayload
        );

        if (onCategorySaved) onCategorySaved(updatedCategory);
        if (onCategoryCreated) onCategoryCreated(updatedCategory);
        onClose();
      } else {
        const createPayload: CreateCategoryDto = {
          name: name.trim(),
          description: description.trim() || undefined,
          image: image.trim() || undefined,
          isActive,
        };

        const newCategory = await categoryService.createCategory(createPayload);

        // Reset form
        setName("");
        setDescription("");
        setImage("");
        setIsActive(true);
        setImgError(false);

        if (onCategorySaved) onCategorySaved(newCategory);
        if (onCategoryCreated) onCategoryCreated(newCategory);
        onClose();
      }
    } catch (err: unknown) {
      let msg = isEditing
        ? "Failed to update category. Please try again."
        : "Failed to create category. Please try again.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        } else if (axiosErr.response?.status === 409) {
          msg = "Category with this name already exists.";
        } else if (axiosErr.response?.status === 403) {
          msg = "Forbidden - Admin role required or invalid API key.";
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="
          bg-white rounded-xl shadow-xl w-full max-w-lg
          overflow-hidden border border-gray-100
          transition-all transform duration-200
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-[#2B2B2B]">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-xs text-[#8A8A8A]">
              {isEditing
                ? "Update agricultural produce category details"
                : "Create an agricultural produce category"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grains & Cereals, Tubers, Fruits"
              className="w-full h-10 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-1 focus:ring-[#2F7A3D] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief summary of produce types included..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-1 focus:ring-[#2F7A3D] transition-colors resize-none"
            />
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category Image URL (Optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setImgError(false);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full h-10 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-1 focus:ring-[#2F7A3D] transition-colors"
            />

            {/* Thumbnail preview */}
            {image && !imgError && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200/70">
                <img
                  src={image}
                  alt="Preview"
                  onError={() => setImgError(true)}
                  className="w-12 h-12 rounded-md object-cover border border-gray-200"
                />
                <div className="text-xs text-gray-500 overflow-hidden">
                  <p className="font-medium text-gray-700">Image Preview</p>
                  <p className="truncate">{image}</p>
                </div>
              </div>
            )}
            {imgError && (
              <p className="text-[11px] text-amber-600 mt-1">
                Unable to load image preview from this URL. Please check the link.
              </p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200/80">
            <div>
              <p className="text-xs font-semibold text-gray-800">Active Status</p>
              <p className="text-[11px] text-gray-500">
                Active categories are immediately available for product listing.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2F7A3D]"></div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#2F7A3D] hover:bg-[#256331] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>
                {loading
                  ? "Saving..."
                  : isEditing
                  ? "Update Category"
                  : "Create Category"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
