import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Pencil, Trash2, PackageCheck, AlertTriangle, PackageX } from "lucide-react";
import Wrapper from "../components/Wrapper";
import FilterDropdown from "../components/FilterDropdown";

type ProductStatus = "In stock" | "Low stock" | "Out of stock";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
  status: ProductStatus;
  imageUrl?: string;
}

const CATEGORIES = ["Grains", "Vegetables", "Livestock", "Machinery"];
const STATUSES: ProductStatus[] = ["In stock", "Low stock", "Out of stock"];

const products: Product[] = [
  { id: "1", name: "Rice", category: "Grains", price: "#10,000", quantity: "25 bags", description: "Fresh, clean, and carefully processed rice with excellent taste and texture", status: "In stock" },
  { id: "2", name: "Rice", category: "Grains", price: "#10,000", quantity: "25 bags", description: "Fresh, clean, and carefully processed rice with excellent taste and texture", status: "Out of stock" },
  { id: "3", name: "Rice", category: "Grains", price: "#10,000", quantity: "25 bags", description: "Fresh, clean, and carefully processed rice with excellent taste and texture", status: "In stock" },
  { id: "4", name: "Rice", category: "Grains", price: "#10,000", quantity: "25 bags", description: "Fresh, clean, and carefully processed rice with excellent taste and texture", status: "Low stock" },
  { id: "5", name: "Rice", category: "Grains", price: "#10,000", quantity: "25 bags", description: "Fresh, clean, and carefully processed rice with excellent taste and texture", status: "In stock" },
];

const statusColors: Record<ProductStatus, string> = {
  "In stock": "text-[#2F7A3D]",
  "Low stock": "text-[#D98A00]",
  "Out of stock": "text-[#E23434]",
};

const ProductList = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }, [category, status]);

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
              cursor-pointer
            "
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#2F7A3D]/40 px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Total Stock</p>
              <span className="w-7 h-7 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center">
                <PackageCheck size={14} className="text-[#2F7A3D]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">87 products</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">+15% from last month</p>
          </div>

          <div className="bg-white rounded-lg border border-[#E23434]/40 px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Low Stock</p>
              <span className="w-7 h-7 rounded-full bg-[#E23434]/10 flex items-center justify-center">
                <AlertTriangle size={14} className="text-[#E23434]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">10 products</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Requires immediate action</p>
          </div>

          <div className="bg-white rounded-lg border border-[#EEEEEE] px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Out of Stock</p>
              <span className="w-7 h-7 rounded-full bg-[#F3F3F3] flex items-center justify-center">
                <PackageX size={14} className="text-[#999]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">3 products</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">Currently unavailable for sale</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <FilterDropdown label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
          <FilterDropdown label="Status" options={STATUSES} value={status} onChange={setStatus} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Product Name</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Category</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Price</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Quantity Available</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Product Description</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Status</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-[#F5F5F5] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md overflow-hidden bg-[#E9E2D3] shrink-0">
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-sm text-[#2B2B2B]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#555]">{product.category}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{product.price}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{product.quantity}</td>
                  <td className="px-5 py-4 text-sm text-[#777] max-w-[220px]">{product.description}</td>
                  <td className={`px-5 py-4 text-sm font-medium ${statusColors[product.status]}`}>
                    {product.status}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/product/edit/${product.id}`)}
                        className="text-[#2F7A3D] hover:text-[#256331] transition-colors cursor-pointer"
                        aria-label="Edit product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="text-[#E23434] hover:text-[#C22525] transition-colors cursor-pointer"
                        aria-label="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-[#999]">
                    No products match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Wrapper>
  );
};

export default ProductList;