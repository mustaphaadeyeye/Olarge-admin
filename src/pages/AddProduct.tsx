import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ImagePlus, X } from "lucide-react";
import Wrapper from "../components/Wrapper";
import ProductAddedModal from "../components/ProductAddedModal";

const CATEGORIES = ["Grains", "Vegetables", "Livestock", "Machinery"];
const STATUSES = ["In stock", "Low stock", "Out of stock"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageSelect = (index: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

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
          <span className="text-[#8A8A8A]">Add New Product</span>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-6 py-7">
          {/* Seller name */}
          <div className="mb-5">
            <label className="block text-sm text-[#444] mb-2">Seller name</label>
            <input
              type="text"
              required
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>

          {/* Product name */}
          <div className="mb-5">
            <label className="block text-sm text-[#444] mb-2">Product name</label>
            <input
              type="text"
              required
              className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm text-[#444] mb-2">Product category</label>
              <select
                required
                defaultValue=""
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
              >
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#444] mb-2">Price</label>
              <input
                type="text"
                required
                placeholder="#0.00"
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>
          </div>

          {/* Status + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm text-[#444] mb-2">Status Product</label>
              <select
                required
                defaultValue=""
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors bg-white cursor-pointer"
              >
                <option value="" disabled>Select status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#444] mb-2">Stock in units</label>
              <input
                type="number"
                required
                min={0}
                className="w-full h-11 px-4 rounded-md border border-[#D9D9D9] text-sm text-[#333] outline-none focus:border-[#2F7A3D] transition-colors"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="mb-7">
            <label className="block text-sm text-[#444] mb-1.5">Image Product</label>
            <p className="text-xs text-[#2F7A3D] mb-3">
              Note: Format photos SVG, PNG, JPG, or GIF (Max size 10mb)
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <input
                    ref={(el) => (fileInputRefs.current[i] = el)}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={(e) => handleImageSelect(i, e.target.files?.[0] ?? null)}
                  />

                  {img ? (
                    <div className="relative h-[92px] rounded-md overflow-hidden border border-[#D9D9D9]">
                      <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[i]?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleImageSelect(i, e.dataTransfer.files?.[0] ?? null);
                      }}
                      className="
                        w-full h-[92px]
                        flex flex-col items-center justify-center gap-1.5
                        rounded-md border border-dashed border-[#2F7A3D]/50
                        hover:border-[#2F7A3D] hover:bg-[#F7FBF8]
                        transition-colors
                        cursor-pointer
                        px-2
                      "
                    >
                      <ImagePlus size={18} className="text-[#2F7A3D]" />
                      <span className="text-[10px] text-[#2F7A3D] text-center leading-tight">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-[9px] text-[#9A9A9A] text-center leading-tight">
                        SVG, PNG, JPG, or GIF (Max size 10mb)
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center  gap-3">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="
                flex-1 sm:flex-none sm:w-32
                bg-[#EAEAEA] hover:bg-[#DEDEDE]
                text-[#555] text-sm font-medium
                rounded-md
                py-2.5
                transition-colors
                cursor-pointer
              "
            >
              Back
            </button>

            <button
              type="submit"
              className="
                flex-1 sm:flex-none sm:w-40
                bg-[#2F7A3D] hover:bg-[#256331]
                text-white text-sm font-medium
                rounded-md
                py-2.5
                transition-colors
                cursor-pointer
              "
            >
              Save Product
            </button>
          </div>
        </form>
      </section>

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