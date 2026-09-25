import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const periods = ["Today", "Weekly", "Monthly", "Yearly"] as const;
type Period = (typeof periods)[number];

const data = [
  { day: "MON", sales: 13500 },
  { day: "TUES", sales: 8200 },
  { day: "WED", sales: 12000 },
  { day: "THURS", sales: 7300 },
  { day: "FRI", sales: 12200 },
  { day: "SAT", sales: 2800 },
  { day: "SUN", sales: 10000 },
];

const SalesOverview = () => {
  const [active, setActive] = useState<Period>("Weekly");

  return (
    <div className="bg-white rounded-lg border border-[#EEEEEE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-3.5 sm:px-5 py-4 sm:py-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <h2 className="text-base font-semibold text-[#2B2B2B]">
          Sales Overview
        </h2>

        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-1 sm:pb-0">
          {periods.map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setActive(period)}
              className={`text-sm transition-colors cursor-pointer ${
                active === period
                  ? "text-[#2F7A3D] font-semibold underline underline-offset-4 decoration-2"
                  : "text-[#8A8A8A] hover:text-[#2F7A3D]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#9A9A9A", fontSize: 12 }}
              axisLine={{ stroke: "#EAEAEA" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9A9A9A", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v === 0 ? "$0.0K" : `$${(v / 1000).toFixed(1)}K`
              }
              ticks={[0, 2500, 5000, 10000, 15000, 18000]}
            />
            <Tooltip
              cursor={{ fill: "#F5FAF6" }}
              formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, "Sales"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #EEEEEE",
                fontSize: 12,
              }}
            />
            <Bar dataKey="sales" fill="#2F7A3D" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOverview;