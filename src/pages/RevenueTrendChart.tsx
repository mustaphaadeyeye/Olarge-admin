import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { ChevronDown, TrendingUp } from "lucide-react";

const data = [
  { month: "JAN", revenue: 6800 },
  { month: "FEB", revenue: 4500 },
  { month: "MAR", revenue: 7000 },
  { month: "APR", revenue: 3800 },
  { month: "MAY", revenue: 8500 },
  { month: "JUN", revenue: 10200 },
  { month: "JULY", revenue: 0 },
  { month: "AUG", revenue: 0 },
  { month: "SEPT", revenue: 0 },
  { month: "OCT", revenue: 0 },
  { month: "NOV", revenue: 0 },
  { month: "DEC", revenue: 0 },
];

const periods = ["Weekly", "Monthly", "Yearly"];

const RevenueTrendChart = () => {
  const [period, setPeriod] = useState("Monthly");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#F2FAF3] rounded-lg border border-[#E3F1E5] px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#2B2B2B]">Revenue Trend</h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 bg-white border border-[#D9E8DB] text-sm text-[#444] rounded-md px-3.5 py-1.5 cursor-pointer"
          >
            {period}
            <ChevronDown size={14} className={`text-[#999] transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-md border border-[#EEEEEE] shadow-[0_4px_16px_rgba(0,0,0,0.1)] py-1.5 z-20">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setOpen(false);
                  }}
                  className={`w-full text-left text-sm px-4 py-2 hover:bg-[#F7F9F8] cursor-pointer ${
                    period === p ? "text-[#2F7A3D] font-medium" : "text-[#444]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E3F1E5" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#FFA800", fontSize: 11 }}
              axisLine={{ stroke: "#E3F1E5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#9A9A9A", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v === 0 ? "0K" : `${v / 1000}K`)}
              ticks={[0, 2000, 4000, 6000, 8000, 10000]}
            />
            <Tooltip
              cursor={{ fill: "#E9F6EA" }}
              formatter={(value: any) => [`$${Number(value || 0).toLocaleString()}`, "Revenue"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #EEEEEE", fontSize: 12 }}
            />
            <Bar dataKey="revenue" fill="#5B5B5B" radius={[3, 3, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-1.5 mt-2 pl-1">
        <TrendingUp size={14} className="text-[#2F7A3D]" />
        <span className="text-xs text-[#2F7A3D] font-medium">+12% from last month</span>
      </div>
    </div>
  );
};

export default RevenueTrendChart;