import {
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  Landmark,
  Users,
} from "lucide-react";
import Wrapper from "../components/Wrapper";
import SalesOverview from "./SalesOverview";
import Notifications from "./Notifications";
import RecentOrders from "./RecentOrders";
import TopSellingProducts from "./TopSellingProducts";

interface SummaryCard {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

const summaryCards: SummaryCard[] = [
  { title: "Total Products", value: "25", description: "Number of products currently listed", icon: ShoppingCart },
  { title: "Total Orders", value: "143", description: "All orders received", icon: ShoppingBag },
  { title: "Pending Orders", value: "12", description: "Orders awaiting processing", icon: ShoppingBag },
  { title: "Total Revenue", value: "#1,250,000", description: "Total earnings from sales", icon: BarChart3 },
  { title: "Available Balance", value: "#350,000", description: "Amount available for withdrawal", icon: Landmark },
  { title: "New Customers", value: "32", description: "New customers", icon: Users },
];

const Overview = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <h1 className="text-xl font-semibold text-[#2B2B2B] mb-5">
          Dashboard
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-4 min-h-[86px] flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[#707070] mb-1">{card.title}</p>
                  <h2 className="text-[24px] leading-7 font-bold text-[#666666]">{card.value}</h2>
                  <p className="text-[9px] text-[#777777] mt-1 truncate">{card.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#DFFFFB] flex items-center justify-center shrink-0 ml-3">
                  <Icon size={15} strokeWidth={2.5} className="text-[#FFAA00]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sales overview + Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 mb-6">
          <SalesOverview />
          <Notifications />
        </div>

        {/* Recent orders + Top selling products */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <RecentOrders />
          <TopSellingProducts />
        </div>
      </section>
    </Wrapper>
  );
};

export default Overview;