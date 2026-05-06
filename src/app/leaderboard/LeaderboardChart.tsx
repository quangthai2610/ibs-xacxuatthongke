"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function LeaderboardChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  // Rút gọn tên nhưng hiển thị TẤT CẢ người chơi
  const chartData = data.map((d) => ({
    name: d.name.length > 8 ? d.name.substring(0, 8) + "..." : d.name,
    total_debt: Number(d.total_debt),
  }));

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000) return `${(tickItem / 1000000).toFixed(1)}M`;
    if (tickItem >= 1000) return `${(tickItem / 1000).toFixed(0)}k`;
    return tickItem.toString();
  };

  // Tính width dựa trên số cột để không bị bóp méo khi quá đông
  const minChartWidth = Math.max(300, chartData.length * 75);

  return (
    <div className="w-full overflow-x-auto pb-4 -mx-1 px-1">
      <div className="h-[280px]" style={{ minWidth: `${minChartWidth}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: "#64748b", angle: -45, textAnchor: "end" }} 
              dy={15}
              dx={-5}
              interval={0} // Ép hiện tên tất cả cột
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "#94a3b8" }} 
              tickFormatter={formatYAxis}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => [`${Number(value || 0).toLocaleString("vi-VN")} đ`, "Tổng nợ"]}
            />
            <Bar dataKey="total_debt" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#ef4444" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
