"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GlassCard } from "./glass-card";

interface EmbeddingChartCardProps {
  data: number[];
  title?: string;
  className?: string;
}

export function EmbeddingChartCard({ data, title = "Embedding Preview (First 32 Indices)", className }: EmbeddingChartCardProps) {
  // Take first 32 values as requested
  const chartData = data.slice(0, 32).map((val, idx) => ({
    name: idx,
    value: val,
  }));

  return (
    <GlassCard className={className} hover={false}>
      <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#22d3ee" }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? "#22d3ee" : "#6366f1"} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
