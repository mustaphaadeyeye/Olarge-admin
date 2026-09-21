import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Package,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Eye,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import ProductAddedModal from "../components/ProductAddedModal";
import ProductImageManager from "../components/ProductImageManager";
import productService from "../services/product.service";
import categoryService from "../services/category.service";
import type { Category } from "../types/category";
import type { CreateProductDto, UpdateProductDto } from "../types/product";

const UNITS = [
  { value: "bag", label: "Bag (e.g. 50kg, 100kg)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "crate", label: "Crate" },
  { value: "ton", label: "Ton" },
  { value: "tuber", label: "Tuber" },
  { value: "basket", label: "Basket" },
  { value: "piece", label: "Piece" },
  { value: "bundle", label: "Bundle" },
];

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

  // Images state (URLs or Base64 strings)
  const [images, setImages] = useState<string[]>([]);

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
    setPageLoading(true);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!category) {
      setError("Please select a category.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (price === "" || Number(price) <= 0) {
      setError("Please specify a valid product price.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (stock === "" || Number(stock) < 0) {
      setError("Please specify valid available stock quantity.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!unit.trim()) {
      setError("Unit of measure is required (e.g. bag, kg).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!state.trim()) {
      setError("State is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c._id === category);

  if (pageLoading) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[450px]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
            <Loader2 size={24} className="animate-spin text-[#2F7A3D]" />
          </div>
          <p className="text-sm font-medium text-gray-700">Loading product information...</p>
          <p className="text-xs text-gray-400 mt-0.5">Fetching latest produce catalog data</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <section className="w-full pb-16 max-w-6xl mx-auto">
        {/* Top Bar with Go Back Arrow & Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-3.5 mb-2">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all shadow-xs flex items-center justify-center cursor-pointer group shrink-0"
              title="Go back to product list"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-0.5 text-gray-700 group-hover:text-[#2F7A3D]"
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <button
                  type="button"
                  onClick={() => navigate("/product")}
                  className="text-[#2F7A3D] font-medium hover:underline cursor-pointer"
                >
                  Product Catalog
                </button>
                <ChevronRight size={13} className="text-gray-400" />
                <span className="text-gray-600 font-medium">
                  {isEditMode ? "Edit Product" : "Add New Product"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {isEditMode ? "Edit Product Listing" : "Create New Product Listing"}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 ml-13">
            {isEditMode
              ? "Update produce details, inventory numbers, location logistics, and gallery."
              : "List high quality agricultural produce, grains, vegetables, and farm inventory for buyers."}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-sm flex items-start gap-3 shadow-xs animate-fadeIn">
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Action could not be completed</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left / Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Basic Information */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                  <span className="p-2 rounded-lg bg-emerald-50 text-[#2F7A3D]">
                    <Package size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Basic Information</h2>
                    <p className="text-xs text-gray-500">Provide the title, category, and produce description</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fresh Yellow Maize (Corn), White Garri, Yam Tubers"
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all"
                    />
                  </div>

                  {/* Category Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Product Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="text-xs text-[#2F7A3D] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Layers size={12} />
                        <span>Manage Categories</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={fetchingCategories}
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all bg-white cursor-pointer disabled:bg-gray-100"
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

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Product Description <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {description.length} characters
                      </span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail produce harvest quality, moisture content, packaging, grain purity, grading, and storage condition..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Pricing & Inventory */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                  <span className="p-2 rounded-lg bg-emerald-50 text-[#2F7A3D]">
                    <span className="font-bold text-sm">₦</span>
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Pricing & Inventory</h2>
                    <p className="text-xs text-gray-500">Set wholesale or retail price and available stock volume</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Price per Unit <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 select-none">
                        ₦
                      </div>
                      <input
                        type="number"
                        required
                        min={0}
                        value={price}
                        onChange={(e) =>
                          setPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="45,000"
                        className="w-full h-11 pl-8 pr-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Unit of Measure <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all bg-white cursor-pointer"
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Stock Volume <span className="text-red-500">*</span>
                      </label>
                      {stock !== "" && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            Number(stock) > 0
                              ? "bg-emerald-50 text-[#2F7A3D]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {Number(stock) > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) =>
                        setStock(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="100"
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Product Media (Redesigned Image Manager) */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
                <ProductImageManager
                  images={images}
                  onChange={setImages}
                  maxImages={8}
                />
              </div>

              {/* Card 4: Origin & Harvest Logistics */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                  <span className="p-2 rounded-lg bg-emerald-50 text-[#2F7A3D]">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Farm Origin & Harvest Logistics</h2>
                    <p className="text-xs text-gray-500">Location where produce is stored or harvested</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Origin State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all bg-white cursor-pointer"
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* LGA */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LGA / Farm Town
                    </label>
                    <input
                      type="text"
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Ibadan North, Iseyin, Zaria"
                      className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all"
                    />
                  </div>

                  {/* Harvest Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Harvest Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={harvestDate}
                        onChange={(e) => setHarvestDate(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/15 transition-all bg-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column / Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 5: Status & Visibility */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#2F7A3D]" />
                  Visibility & Status
                </h3>

                {/* Status Switch */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Listing Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStatus("active")}
                      className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        status === "active"
                          ? "bg-white text-[#2F7A3D] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("draft")}
                      className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        status === "draft"
                          ? "bg-white text-gray-800 shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <span>Draft</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    {status === "active"
                      ? "Active products appear in marketplace searches and category catalogs."
                      : "Draft products are saved privately and hidden from buyers."}
                  </p>
                </div>

                {/* Featured Product Checkbox */}
                <div className="pt-3 border-t border-gray-100">
                  <label className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#2F7A3D] rounded border-gray-300 focus:ring-[#2F7A3D] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        Featured Product
                      </span>
                      <span className="text-[11px] text-gray-500 leading-tight block mt-0.5">
                        Highlight this produce on the home and category recommendation carousels.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card 6: Live Buyer Preview Card */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Eye size={13} />
                    Live Marketplace Preview
                  </h3>
                  <span className="text-[10px] text-gray-400">Buyer View</span>
                </div>

                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-xs">
                  {/* Image Preview */}
                  <div className="relative h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <Package size={32} />
                        <span className="text-[11px] text-gray-400 mt-1 font-medium">
                          No cover photo
                        </span>
                      </div>
                    )}
                    {selectedCategoryObj && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-gray-800 shadow-xs">
                        {selectedCategoryObj.name}
                      </span>
                    )}
                    {isFeatured && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-semibold shadow-xs flex items-center gap-1">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Body Preview */}
                  <div className="p-3.5 space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {name || "Untitled Product Name"}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-[#2F7A3D]">
                        ₦{price ? Number(price).toLocaleString() : "0"}
                      </span>
                      <span className="text-xs text-gray-500">/ {unit || "unit"}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-gray-400" />
                        {state} {lga ? `(${lga})` : ""}
                      </span>
                      <span
                        className={`font-medium ${
                          Number(stock) > 0 ? "text-emerald-700" : "text-red-500"
                        }`}
                      >
                        {Number(stock) > 0 ? `${stock} ${unit}s available` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7: Action Buttons */}
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-3 px-4
                    bg-[#2F7A3D] hover:bg-[#256331]
                    text-white text-sm font-semibold
                    rounded-lg
                    transition-all
                    cursor-pointer shadow-sm hover:shadow-md
                    flex items-center justify-center gap-2
                    disabled:opacity-50
                  "
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>
                    {loading
                      ? "Publishing..."
                      : isEditMode
                      ? "Update Product Listing"
                      : "Publish Product Listing"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/product")}
                  disabled={loading}
                  className="
                    w-full py-2.5 px-4
                    bg-gray-100 hover:bg-gray-200
                    text-gray-700 text-xs font-semibold
                    rounded-lg
                    transition-colors
                    cursor-pointer disabled:opacity-50
                  "
                >
                  Cancel & Return to Products
                </button>
              </div>
            </div>
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