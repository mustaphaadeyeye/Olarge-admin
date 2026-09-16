import { PackageCheck, AlertTriangle, Clock } from "lucide-react";
import Wrapper from "../components/Wrapper";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
type DeliveryStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled" | "Delay";

interface Order {
  id: string;
  product: string;
  buyer: string;
  quantity: number;
  amount: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  date: string;
  time: string;
}

const orders: Order[] = [
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Paid", deliveryStatus: "Delivered", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Paid", deliveryStatus: "In Transit", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Pending", deliveryStatus: "Processing", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Failed", deliveryStatus: "Cancelled", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Refunded", deliveryStatus: "Delay", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Paid", deliveryStatus: "Delivered", date: "May 14, 2026", time: "10:30AM" },
  { id: "#ORD-001", product: "Rice", buyer: "Ray Ogunmola", quantity: 5, amount: "#50,000", paymentStatus: "Paid", deliveryStatus: "Delivered", date: "May 14, 2026", time: "10:30AM" },
];

const deliveryStyles: Record<DeliveryStatus, string> = {
  Delivered: "bg-[#2F7A3D] text-white",
  "In Transit": "bg-[#FFA800] text-white",
  Processing: "bg-[#DCEFFF] text-[#1E6FBF]",
  Cancelled: "bg-[#5A5A5A] text-white",
  Delay: "bg-[#E23434] text-white",
};

const OrderHistory = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <h1 className="text-xl font-semibold text-[#2B2B2B] mb-5">Order History</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#2F7A3D]/40 px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Total Orders</p>
              <span className="w-7 h-7 rounded-full bg-[#2F7A3D]/10 flex items-center justify-center">
                <PackageCheck size={14} className="text-[#2F7A3D]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">1,024</h2>
            <p className="text-xs text-[#8A8A8A] mt-1">All-time orders</p>
          </div>

          <div className="bg-white rounded-lg border border-[#E23434]/40 px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">Pending Payment</p>
              <span className="w-7 h-7 rounded-full bg-[#E23434]/10 flex items-center justify-center">
                <AlertTriangle size={14} className="text-[#E23434]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">60</h2>
            <p className="text-xs text-[#E23434] mt-1">Requires action</p>
          </div>

          <div className="bg-white rounded-lg border border-[#EEEEEE] px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#555]">In Progress</p>
              <span className="w-7 h-7 rounded-full bg-[#FFF1D6] flex items-center justify-center">
                <Clock size={14} className="text-[#FFA800]" />
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#2B2B2B]">15</h2>
            <p className="text-xs text-[#2F7A3D] mt-1">New Request</p>
          </div>
        </div>

        {/* Recent orders */}
        <h2 className="text-base font-semibold text-[#2B2B2B] mb-4">Recent Orders</h2>

        <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Order ID</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Product Name</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Buyer Name</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Quantity Ordered</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Total Amount</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Payment Status</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Delivery Status</th>
                <th className="text-left text-xs font-medium text-[#8A8A8A] px-5 py-3.5">Order Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-[#F5F5F5] last:border-b-0">
                  <td className="px-5 py-4 text-sm text-[#2B2B2B]">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{order.product}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{order.buyer}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{order.quantity}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{order.amount}</td>
                  <td className="px-5 py-4 text-sm text-[#555]">{order.paymentStatus}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${deliveryStyles[order.deliveryStatus]}`}
                    >
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#555]">
                    {order.date} <span className="text-[#9A9A9A]">{order.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Wrapper>
  );
};

export default OrderHistory;