import { Check } from "lucide-react";
import PaymentMethodRow from "./PaymentMethodRow";
import InvoicesTable from "./InvoicesTable";

const benefits = ["Unlimited Listings", "Priority Visibility", "Seller Analytics", "Order Management"];

const SubscriptionBillingTab = () => {
  return (
    <div className="space-y-5">
      {/* Current plan + benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        <div className="bg-[#F7F9F8] rounded-lg px-6 py-6">
          <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">Current Plan</h3>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FFF1D6] flex items-center justify-center shrink-0">
                <Check size={14} className="text-[#FFA800]" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#2B2B2B]">Premium Seller</p>
                <p className="text-xs text-[#9A9A9A]">Billed monthly</p>
              </div>
            </div>

            <span className="text-xs font-medium text-[#2F7A3D] bg-[#E3F5E6] rounded-full px-3 py-1">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-lg px-4 py-3.5">
              <p className="text-xs text-[#9A9A9A] mb-1">Amount</p>
              <p className="text-base font-semibold text-[#2B2B2B]">35k / Year</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-3.5">
              <p className="text-xs text-[#9A9A9A] mb-1">Expires</p>
              <p className="text-base font-semibold text-[#2B2B2B]">August 1st, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm font-medium text-[#2F7A3D] border border-[#2F7A3D] rounded-md px-4 py-2 hover:bg-[#EAF6EC] transition-colors cursor-pointer"
            >
              Renew Plan
            </button>
            <button
              type="button"
              className="text-sm font-medium text-white bg-[#2F7A3D] hover:bg-[#256331] rounded-md px-4 py-2 transition-colors cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        <div className="bg-[#F7F9F8] rounded-lg px-5 py-6">
          <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">Plan Benefits</h3>
          <div className="space-y-2.5">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check size={14} className="text-[#2F7A3D] shrink-0" />
                <span className="text-sm text-[#555]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-[#F7F9F8] rounded-lg px-5 py-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#2B2B2B]">Payment Method</h3>
          <button
            type="button"
            className="text-xs font-medium border border-[#D9D9D9] rounded-md px-3.5 py-1.5 text-[#444] hover:bg-white transition-colors cursor-pointer"
          >
            Add Payment Method
          </button>
        </div>
        <PaymentMethodRow brand="Verve" expiry="11/2026" isDefault />
      </div>

      {/* Billing history */}
      <div className="bg-[#F7F9F8] rounded-lg px-5 py-5">
        <InvoicesTable />
      </div>
    </div>
  );
};

export default SubscriptionBillingTab;