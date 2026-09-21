import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  ImagePlus,
  X,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import ProductAddedModal from "../components/ProductAddedModal";
import productService from "../services/product.service";
import categoryService from "../services/category.service";
import type { Category } from "../types/category";
import type { CreateProductDto, UpdateProductDto } from "../types/product";

const UNITS = ["bag", "kg", "crate", "ton", "tuber", "basket", "piece", "bundle"];
const STATES = [
  "Oyo",
  "Lagos",
  "Ogun",
  "Osun",
  "Ondo",
  "Ekiti",
  "Kano",
  "Kaduna",
  "Benue",
  "Plateau",
  "Niger",
  "Edo",
  "Delta",
  "Rivers",
  "Enugu",
  "Abia",
  "Imo",
  "Anambra",
  "FCT - Abuja",
];

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Dynamic categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [unit, setUnit] = useState("bag");
  const [state, setState] = useState("Oyo");
  const [lga, setLga] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [harvestDate, setHarvestDate] = useState<string>("");

  // Images state (URLs)
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [imgInputError, setImgInputError] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load active categories
  useEffect(() => {
    let ignore = false;
    categoryService
      .getCategories({ includeInactive: false })
      .then((catList) => {
        if (!ignore) {
          setCategories(catList);
          setCategory((prev) => (prev ? prev : catList[0]?._id || ""));
          setFetchingCategories(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error("Failed to load categories", err);
          setFetchingCategories(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // If in edit mode, fetch existing product details
  useEffect(() => {
    if (!isEditMode || !id) return;

    let ignore = false;
    productService
      .getProductById(id)
      .then((prod) => {
        if (!ignore) {
          setName(prod.name || "");
          setDescription(prod.description || "");

          const catId = typeof prod.category === "object" ? prod.category._id : prod.category;
          setCategory(catId || "");

          setPrice(prod.price ?? "");
          setStock(prod.stock ?? "");
          setUnit(prod.unit || "bag");
          setState(prod.state || "Oyo");
          setLga(prod.lga || "");
          setStatus(prod.status || "active");
          setIsFeatured(Boolean(prod.isFeatured));
          if (prod.harvestDate) {
            setHarvestDate(new Date(prod.harvestDate).toISOString().split("T")[0]);
          }
          if (Array.isArray(prod.images)) {
            setImages(prod.images);
          }
          setPageLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          let msg = "Failed to load product details for editing.";
          if (typeof err === "object" && err !== null && "response" in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            if (axiosErr.response?.data?.message) {
              msg = axiosErr.response.data.message;
            }
          } else if (err instanceof Error) {
            msg = err.message;
          }
          setError(msg);
          setPageLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, isEditMode]);

  // Image helpers
  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
    setImgInputError(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (price === "" || Number(price) <= 0) {
      setError("Please specify a valid price.");
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      setError("Please specify valid stock quantity.");
      return;
    }
    if (!unit.trim()) {
      setError("Unit of measure is required (e.g. bag, kg).");
      return;
    }
    if (!state.trim()) {
      setError("State is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && id) {
        const updatePayload: UpdateProductDto = {
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          stock: Number(stock),
          unit: unit.trim(),
          images,
          state: state.trim(),
          lga: lga.trim() || undefined,
          status,
          isFeatured,
          harvestDate: harvestDate || undefined,
        };
        await productService.updateProduct(id, updatePayload);
      } else {
        const createPayload: CreateProductDto = {
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          stock: Number(stock),
          unit: unit.trim(),
          images,
          state: state.trim(),
          lga: lga.trim() || undefined,
          status,
          isFeatured,
          harvestDate: harvestDate || undefined,
        };
        await productService.createProduct(createPayload);
      }

      setShowSuccess(true);
    } catch (err: unknown) {
      let msg = "Failed to save product. Please verify all fields and your permissions.";
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

  if (pageLoading) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="animate-spin text-[#2F7A3D] mb-3" />
          <p className="text-sm text-gray-500">Loading product information...</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <section className="w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            type="button"
            onClick={() => navigate("/product")}
            className="text-[#2F7A3D] font-medium hover:underline cursor-pointer"
          >
            Product List
          </button>
          <ChevronRight size={15} className="text-[#B5B5B5]" />
          <span className="text-[#8A8A8A]">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-6 py-7"
        >
          {/* Product Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#444] mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Yellow Maize (Corn), White Garri, Yam Tubers"
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#444] mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail produce harvest quality, moisture content, packaging, and sorting..."
              className="w-full px-4 py-2.5 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors resize-none"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#444]">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="text-xs text-[#2F7A3D] hover:underline"
                >
                  Manage Categories
                </button>
              </div>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={fetchingCategories}
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer disabled:bg-gray-100"
              >
                {fetchingCategories ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="45000"
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>
          </div>

          {/* Stock + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="100"
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location: State + LGA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                State (Location) <span className="text-red-500">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                LGA / Town (Optional)
              </label>
              <input
                type="text"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="e.g. Ibadan North, Ikeja, Zaria"
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>
          </div>

          {/* Status + Featured + Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
              >
                <option value="active">Active (Available for purchase)</option>
                <option value="draft">Draft (Private / Not listed)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#444] mb-2">
                Harvest Date (Optional)
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-sm font-medium text-[#444] mb-2">
                Featured Product
              </label>
              <label className="flex items-center gap-2 cursor-pointer h-11">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#2F7A3D] rounded border-gray-300 focus:ring-[#2F7A3D]"
                />
                <span className="text-xs text-gray-600">Feature this product on homepage</span>
              </label>
            </div>
          </div>

          {/* Product Images (URLs with live preview) */}
          <div className="mb-7">
            <label className="block text-sm font-medium text-[#444] mb-1.5">
              Product Images
            </label>
            <p className="text-xs text-[#2F7A3D] mb-3">
              Add image URLs from Unsplash, Cloudinary, or your hosting CDN.
            </p>

            {/* Add Image URL Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  setImgInputError(false);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 h-10 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#2F7A3D] text-white text-xs font-medium rounded-lg hover:bg-[#256331] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                Add Image
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
                >
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => setImgInputError(true)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center cursor-pointer transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={12} className="text-white" />
                  </button>
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-white">
                    {i === 0 ? "Primary" : `#${i + 1}`}
                  </span>
                </div>
              ))}

              {images.length === 0 && (
                <div className="col-span-full border border-dashed border-gray-300 rounded-lg p-6 text-center text-xs text-gray-400">
                  <ImagePlus size={24} className="mx-auto mb-1 text-gray-300" />
                  <span>No images added yet. Add at least one image URL above.</span>
                </div>
              )}
            </div>
            {imgInputError && (
              <p className="text-[11px] text-amber-600 mt-2">
                One or more image links could not be loaded. Please verify the URL.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/product")}
              disabled={loading}
              className="
                flex-1 sm:flex-none sm:w-32
                bg-[#EAEAEA] hover:bg-[#DEDEDE]
                text-[#555] text-sm font-medium
                rounded-md
                py-2.5
                transition-colors
                cursor-pointer disabled:opacity-50
              "
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 sm:flex-none sm:w-44
                bg-[#2F7A3D] hover:bg-[#256331]
                text-white text-sm font-medium
                rounded-md
                py-2.5
                transition-colors
                cursor-pointer shadow-xs
                flex items-center justify-center gap-2
                disabled:opacity-50
              "
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Product"
                  : "Save Product"}
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* Success Modal */}
      <ProductAddedModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/product");
        }}
      />
    </Wrapper>
  );
};

export default AddProduct;