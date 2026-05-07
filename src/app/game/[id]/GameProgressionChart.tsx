"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Player {
  id: string;
  name: string;
}

interface Round {
  id: string;
  round_number: number;
  scores: Record<string, number>;
}

export default function GameProgressionChart({
  players,
  rounds,
}: {
  players: Player[];
  rounds: Round[];
}) {
  if (!rounds || rounds.length === 0) return null;

  // Sắp xếp rounds theo số thứ tự tăng dần để vẽ biểu đồ
  const sortedRounds = [...rounds].sort((a, b) => a.round_number - b.round_number);

  // Tính điểm tích lũy
  const cumulativeScores: Record<string, number> = {};
  players.forEach((p) => (cumulativeScores[p.id] = 0));

  const data = sortedRounds.map((round) => {
    const roundData: any = { name: `Ván ${round.round_number}` };
    players.forEach((p) => {
      cumulativeScores[p.id] += round.scores[p.id] || 0;
      roundData[p.name] = cumulativeScores[p.id];
    });
    return roundData;
  });

  // Thêm điểm 0 ở đầu
  const chartData = [
    {
      name: "Bắt đầu",
      ...Object.fromEntries(players.map((p) => [p.name, 0])),
    },
    ...data,
  ];

  const colors = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="w-full h-[220px] mt-2 px-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "#94a3b8" }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "#94a3b8" }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
          {players.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
