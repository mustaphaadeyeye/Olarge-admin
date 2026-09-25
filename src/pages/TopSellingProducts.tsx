interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: string;
  imageUrl?: string;
}

const products: Product[] = [
  { id: "1", name: "Rice", sales: 10, revenue: "#50,000" },
  { id: "2", name: "Rice", sales: 10, revenue: "#50,000" },
  { id: "3", name: "Rice", sales: 10, revenue: "#50,000" },
  { id: "4", name: "Rice", sales: 10, revenue: "#50,000" },
];

const TopSellingProducts = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-3.5 sm:px-5 py-4 sm:py-5">
      <h2 className="text-base font-semibold text-[#2B2B2B] mb-4">
        Top Selling Products
      </h2>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_70px_90px] items-center bg-[#F3F3F3] rounded-md px-3 py-2.5 mb-1">
        <span className="text-xs font-medium text-[#8A8A8A]">Product Name</span>
        <span className="text-xs font-medium text-[#8A8A8A]">Sales</span>
        <span className="text-xs font-medium text-[#8A8A8A]">Revenue</span>
      </div>

      {/* Rows */}
      <div>
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-[1fr_70px_90px] items-center px-3 py-3 border-b border-[#F2F2F2] last:border-b-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#E9E2D3] shrink-0">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-sm text-[#2B2B2B] truncate">{product.name}</span>
            </div>

            <span className="text-sm text-[#555]">{product.sales}</span>
            <span className="text-sm text-[#555]">{product.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;