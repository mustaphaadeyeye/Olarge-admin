interface Order {
  id: string;
  product: string;
  buyer: string;
  amount: string;
  date: string;
  status: "Delivered" | "In Process" | "Delay";
}

const orders: Order[] = [
  { id: "#24459", product: "Rice", buyer: "Jacob", amount: "#5,000", date: "13 May, 2026", status: "Delivered" },
  { id: "#24459", product: "Rice", buyer: "Jacob", amount: "#5,000", date: "13 May, 2026", status: "In Process" },
  { id: "#24459", product: "Rice", buyer: "Jacob", amount: "#5,000", date: "13 May, 2026", status: "Delay" },
  { id: "#24459", product: "Rice", buyer: "Jacob", amount: "#5,000", date: "13 May, 2026", status: "Delivered" },
];

const statusStyles: Record<Order["status"], string> = {
  Delivered: "bg-[#2F7A3D] text-white",
  "In Process": "bg-[#FFA800] text-white",
  Delay: "bg-[#E23434] text-white",
};

const RecentOrders = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-5 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#2B2B2B]">Recent Orders</h2>

        <button
          type="button"
          className="text-xs font-medium text-[#FFA800] border border-[#FFA800]/40 rounded-full px-3 py-1 hover:bg-[#FFA800]/5 transition-colors cursor-pointer"
        >
          See all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr className="bg-[#F3F3F3]">
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5 rounded-l-md">
                Order ID
              </th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5">
                Product
              </th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5">
                Buyer
              </th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5">
                Amount
              </th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5">
                Order Date
              </th>
              <th className="text-left text-xs font-medium text-[#8A8A8A] px-3 py-2.5 rounded-r-md">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <tr
                key={`${order.id}-${i}`}
                className={i % 2 === 0 ? "bg-white" : "bg-[#FAFCFA]"}
              >
                <td className="text-sm text-[#2B2B2B] px-3 py-3.5 border-b border-[#F2F2F2]">
                  {order.id}
                </td>
                <td className="text-sm text-[#555] px-3 py-3.5 border-b border-[#F2F2F2]">
                  {order.product}
                </td>
                <td className="text-sm text-[#555] px-3 py-3.5 border-b border-[#F2F2F2]">
                  {order.buyer}
                </td>
                <td className="text-sm text-[#555] px-3 py-3.5 border-b border-[#F2F2F2]">
                  {order.amount}
                </td>
                <td className="text-sm text-[#555] px-3 py-3.5 border-b border-[#F2F2F2]">
                  {order.date}
                </td>
                <td className="px-3 py-3.5 border-b border-[#F2F2F2]">
                  <span
                    className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;