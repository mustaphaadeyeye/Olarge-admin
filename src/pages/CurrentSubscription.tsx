import Wrapper from "../components/Wrapper";
import PaymentMethodRow from "./PaymentMethodRow";
import InvoicesTable from "./InvoicesTable";
import { CreditCard } from "lucide-react";


const CurrentSubscription = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold text-[#2B2B2B]">Current Subscription</h1>
          <button
            type="button"
            className="bg-[#2F7A3D] hover:bg-[#256331] text-white text-sm font-medium rounded-md px-4 py-2.5 transition-colors cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Plan summary card */}
        <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-6 py-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#FFF1D6] flex items-center justify-center shrink-0">
                <CreditCard size={16} className="text-[#FFA800]" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#2B2B2B]">Business Plan</p>
                <p className="text-xs text-[#9A9A9A]">Billed monthly</p>
              </div>
            </div>

            <span className="text-xs font-medium text-[#2F7A3D] bg-[#E3F5E6] rounded-full px-3 py-1">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="bg-[#F2FAF3] rounded-lg px-4 py-3.5">
              <p className="text-xs text-[#8A8A8A] mb-1">Amount</p>
              <p className="text-lg font-semibold text-[#2B2B2B]">35k / Year</p>
            </div>
            <div className="bg-[#F2FAF3] rounded-lg px-4 py-3.5">
              <p className="text-xs text-[#8A8A8A] mb-1">Next billing date</p>
              <p className="text-lg font-semibold text-[#2B2B2B]">August 1st, 2026</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-sm font-medium text-[#2F7A3D] border border-[#2F7A3D] rounded-md px-4 py-2 hover:bg-[#F2FAF3] transition-colors cursor-pointer"
              >
                Change Plan
              </button>
              <button
                type="button"
                className="text-sm font-medium text-[#2F7A3D] border border-[#2F7A3D] rounded-md px-4 py-2 hover:bg-[#F2FAF3] transition-colors cursor-pointer"
              >
                Update Payment Method
              </button>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-[#E23434] border border-[#E23434] rounded-md px-4 py-2 hover:bg-[#FDEDED] transition-colors cursor-pointer"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-[#F7FBF8] rounded-lg px-5 py-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#2B2B2B]">Payment Method</h2>
            <button
              type="button"
              // TODO: wire this up to your add-payment-method flow/modal once designed
              className="text-xs font-medium border border-[#D9D9D9] rounded-md px-3.5 py-1.5 text-[#444] hover:bg-white transition-colors cursor-pointer"
            >
              Add Payment Method
            </button>
          </div>

          <PaymentMethodRow brand="Verve" expiry="11/2026" isDefault />
        </div>

        {/* Invoices */}
        <div className="bg-[#F7FBF8] rounded-lg px-5 py-5">
          <InvoicesTable />
        </div>
      </section>
    </Wrapper>
  );
};

export default CurrentSubscription;