"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { GlassCard } from "./glass-card";

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarChartCardProps {
  data: RadarData[];
  title: string;
  description?: string;
}

export function RadarChartCard({ data, title, description }: RadarChartCardProps) {
  return (
    <GlassCard className="border-white/5 p-6 h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{title}</h3>
        {description && <p className="text-[10px] text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "rgba(148,163,184,0.5)", fontSize: 10, fontWeight: "bold" }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
            <Radar
              name="Metrics"
              dataKey="A"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.3}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
