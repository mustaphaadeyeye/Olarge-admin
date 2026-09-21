import React, { useState, useRef } from "react";
import {
  Upload,
  Link2,
  ImagePlus,
  Trash2,
  Star,
  X,
  Plus,
  AlertCircle,
  Eye,
  Check,
  Sparkles,
} from "lucide-react";

interface ProductImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const PRESET_PRODUCE_IMAGES = [
  {
    name: "Yellow Maize",
    url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fresh Tomatoes",
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Yam & Tubers",
    url: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Red Peppers",
    url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cassava & Grains",
    url: "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=800&q=80",
  },
];

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  images,
  onChange,
  maxImages = 8,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to Base64
  const processFiles = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setUrlError("Only image files (JPG, PNG, WebP) are supported.");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUrlError("Each image must be under 5MB.");
        continue;
      }
      validFiles.push(file);
    }

    if (images.length + validFiles.length > maxImages) {
      setUrlError(`You can upload a maximum of ${maxImages} images.`);
    }

    const remainingSlots = Math.max(0, maxImages - images.length);
    const filesToRead = validFiles.slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const resultStr = reader.result;
          onChange([...images, resultStr]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    if (images.length >= maxImages) {
      setUrlError(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    onChange([...images, trimmed]);
    setUrlInput("");
    setUrlError(null);
  };

  const handleAddPreset = (url: string) => {
    if (images.includes(url)) return;
    if (images.length >= maxImages) {
      setUrlError(`Maximum limit of ${maxImages} images reached.`);
      return;
    }
    onChange([...images, url]);
    setUrlError(null);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([selected, ...rest]);
  };

  return (
    <div className="space-y-4">
      {/* Header and counter */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Product Images & Media <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Add high-resolution images of your farm produce. The first image is used as the cover.
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            images.length > 0
              ? "bg-emerald-50 text-[#2F7A3D] border-emerald-200"
              : "bg-gray-100 text-gray-500 border-gray-200"
          }`}
        >
          {images.length} / {maxImages} images
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-lg w-fit text-xs font-medium border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "upload"
              ? "bg-white text-[#2F7A3D] shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Upload size={13} />
          <span>Upload Files</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "url"
              ? "bg-white text-[#2F7A3D] shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Link2 size={13} />
          <span>Add by URL</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeTab === "presets"
              ? "bg-white text-[#2F7A3D] shadow-xs font-semibold"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Sparkles size={13} />
          <span>Produce Presets</span>
        </button>
      </div>

      {/* Upload Zone Tab */}
      {activeTab === "upload" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#2F7A3D] bg-emerald-50/50 scale-[1.005]"
              : "border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-[#2F7A3D]/60"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                processFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-[#2F7A3D] flex items-center justify-center mb-3">
              <Upload size={22} />
            </div>
            <p className="text-sm font-semibold text-gray-800">
              Click to browse or drag & drop files here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PNG, JPG, JPEG, and WebP up to 5MB each
            </p>
          </div>
        </div>
      )}

      {/* URL Input Tab */}
      {activeTab === "url" && (
        <form onSubmit={handleAddUrl} className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://example.com/image.jpg or Cloudinary / Unsplash link..."
                className="w-full h-10.5 pl-10 pr-4 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2F7A3D] focus:ring-2 focus:ring-[#2F7A3D]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim() || images.length >= maxImages}
              className="px-4 py-2 bg-[#2F7A3D] hover:bg-[#256331] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus size={14} />
              Add URL
            </button>
          </div>
        </form>
      )}

      {/* Presets Tab */}
      {activeTab === "presets" && (
        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            Quick-add standard high-quality produce sample photography:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_PRODUCE_IMAGES.map((preset) => {
              const isAdded = images.includes(preset.url);
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleAddPreset(preset.url)}
                  disabled={isAdded || images.length >= maxImages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? "bg-emerald-50 text-[#2F7A3D] border-emerald-300 opacity-60 cursor-not-allowed"
                      : "bg-white hover:bg-emerald-50/40 text-gray-700 border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {isAdded ? <Check size={12} /> : <Plus size={12} />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error alert */}
      {urlError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertCircle size={14} className="shrink-0 text-amber-600" />
          <span>{urlError}</span>
        </div>
      )}

      {/* Thumbnails Gallery */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, i) => {
            const isCover = i === 0;
            return (
              <div
                key={i}
                className={`group relative h-32 rounded-xl overflow-hidden border transition-all ${
                  isCover
                    ? "border-[#2F7A3D] ring-2 ring-[#2F7A3D]/20 shadow-xs"
                    : "border-gray-200 hover:border-gray-300"
                } bg-gray-100`}
              >
                <img
                  src={img}
                  alt={`Product view ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                {/* Cover badge */}
                {isCover ? (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#2F7A3D] text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                    <Star size={10} className="fill-white" />
                    Cover Photo
                  </div>
                ) : (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                    #{i + 1}
                  </span>
                )}

                {/* Action buttons overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(img);
                      }}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs cursor-pointer transition-colors"
                      title="Preview full image"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(i);
                      }}
                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {!isCover && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(i);
                      }}
                      className="w-full py-1 px-2 rounded-md bg-white/90 hover:bg-white text-gray-900 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      Set as Cover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
          <ImagePlus size={16} className="text-gray-300" />
          <span>No images uploaded yet. Upload at least 1 image for your product listing.</span>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer z-10 transition-colors"
            >
              <X size={16} />
            </button>
            <img
              src={previewImage}
              alt="Enlarged preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
