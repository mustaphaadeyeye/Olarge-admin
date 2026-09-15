import { TrendingUp, TrendingDown, Zap, CheckCircle2 } from "lucide-react";
import Wrapper from "../components/Wrapper";
import RevenueTrendChart from "./RevenueTrendChart";
import RecentOrders from "./RecentOrders";
import TopSellingProducts from "./TopSellingProducts";

interface SalesStat {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trendUp: boolean;
}

const stats: SalesStat[] = [
  { title: "Total Revenue", value: "$12,890", description: "Total earnings from all completed sales.", icon: TrendingUp, trendUp: true },
  { title: "Monthly Revenue", value: "$12,890", description: "Total earnings generated this month.", icon: CheckCircle2, trendUp: true },
  { title: "Weekly Revenue", value: "$12,890", description: "Total earnings generated this week.", icon: TrendingDown, trendUp: false },
  { title: "Completed Orders", value: "$12,890", description: "Successfully delivered orders.", icon: Zap, trendUp: true },
];

const Sales = () => {
  return (
    <Wrapper>
      <section className="w-full">
        <h1 className="text-xl font-semibold text-[#2B2B2B] mb-5">Sales</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-4 py-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[#707070]">{stat.title}</p>
                  <span className="w-6 h-6 rounded-full bg-[#DFFFFB] flex items-center justify-center shrink-0">
                    <Icon size={13} strokeWidth={2.5} className="text-[#2F7A3D]" />
                  </span>
                </div>
                <h2 className="text-[22px] font-bold text-[#333]">{stat.value}</h2>
                <p className="text-[10px] text-[#9A9A9A] mt-1.5">{stat.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-6">
          <RevenueTrendChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <RecentOrders />
          <TopSellingProducts />
        </div>
      </section>
    </Wrapper>
  );
};

export default Sales;