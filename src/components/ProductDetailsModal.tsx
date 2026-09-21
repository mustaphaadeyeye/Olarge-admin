import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Package,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import type { Product } from "../types/product";
import type { Category } from "../types/category";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  categories?: Category[];
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  open,
  onClose,
  onEdit,
  onDelete,
  categories = [],
}) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!open || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || images[0];

  const getCategoryName = () => {
    if (!product.category) return "Uncategorized";
    if (typeof product.category === "object" && "name" in product.category) {
      return product.category.name;
    }
    const found = categories.find((c) => c._id === product.category);
    return found ? found.name : String(product.category);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="
          bg-white rounded-2xl shadow-2xl w-full max-w-2xl
          overflow-hidden border border-gray-100 flex flex-col
          max-h-[90vh]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2F7A3D]">
              <Package size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-xs text-gray-500">Produce Listing Overview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">
          {/* Main Visual & Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Package size={40} className="text-gray-300 mb-1" />
                  <span className="text-xs">No image available</span>
                </div>
              )}

              {/* Status & Featured Pills */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                    product.status === "active"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800/80 text-white"
                  }`}
                >
                  {product.status || "active"}
                </span>

                {product.isFeatured && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                    <Star size={12} className="fill-white" />
                    Featured
                  </span>
                )}
              </div>

              {/* Category Pill */}
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 rounded-md bg-white/95 text-gray-800 text-xs font-semibold shadow-sm flex items-center gap-1.5">
                  <Layers size={12} className="text-[#2F7A3D]" />
                  {getCategoryName()}
                </span>
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-[#2F7A3D] ring-2 ring-[#2F7A3D]/20 scale-105"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Price</p>
              <p className="text-lg font-black text-[#2F7A3D] mt-0.5">
                ₦{Number(product.price).toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500">per {product.unit || "unit"}</p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Stock Volume</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                {product.stock} {product.unit || "units"}
              </p>
              <p
                className={`text-[11px] font-medium mt-0.5 flex items-center gap-1 ${
                  isOutOfStock
                    ? "text-red-600"
                    : isLowStock
                    ? "text-amber-600"
                    : "text-emerald-700"
                }`}
              >
                {isOutOfStock ? (
                  <>
                    <AlertTriangle size={11} />
                    Depleted
                  </>
                ) : isLowStock ? (
                  <>
                    <AlertTriangle size={11} />
                    Low stock
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={11} />
                    In stock
                  </>
                )}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Origin</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{product.state || "Nigeria"}</span>
              </p>
              <p className="text-[11px] text-gray-500 truncate">{product.lga || "Statewide"}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Produce Description & Quality
            </h4>
            <div className="p-4 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || "No description provided for this produce."}
            </div>
          </div>

          {/* Harvest & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
            {product.harvestDate && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                <Calendar size={15} className="text-gray-400" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Harvest Date</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(product.harvestDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            {product.createdAt && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/60">
                <Calendar size={15} className="text-gray-400" />
                <div>
                  <span className="text-gray-400 block text-[10px]">Date Listed</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(product.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onDelete) onDelete(product);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Listing</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) {
                  onEdit(product);
                } else {
                  navigate(`/product/edit/${product._id}`);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2F7A3D] hover:bg-[#256331] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Pencil size={13} />
              <span>Edit Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
