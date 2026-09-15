import { useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import PlanCard from "./PlanCard";
import PaymentMethodRow from "./PaymentMethodRow";
import InvoicesTable from "./InvoicesTable";

const Subscriptions = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <section className="w-full">
        <div className="flex items-center justify-end mb-5">
          <button
            type="button"
            className="bg-[#2F7A3D] hover:bg-[#256331] text-white text-sm font-medium rounded-md px-4 py-2.5 transition-colors cursor-pointer"
          >
            Renew subscription
          </button>
        </div>

        {/* Plans */}
        <h2 className="text-sm font-semibold text-[#2B2B2B] mb-3">Subscription Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <PlanCard name="Basic Plan" price="10k" cadence="per month" description="Basic Productivity" variant="selected" />
          <PlanCard name="Business Plan" price="35k" cadence="per year" description="Basic Productivity" variant="outlined" />
          <PlanCard name="Enterprise Plan" price="55k" cadence="per month" description="Basic Productivity" variant="filled" />
        </div>

        {/* Payment method */}
        <div className="bg-[#F7FBF8] rounded-lg px-5 py-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#2B2B2B]">Payment Method</h2>
            <button
              type="button"
              onClick={() => navigate("/subscriptions/current")}
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

export default Subscriptions;