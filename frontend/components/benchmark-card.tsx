"use client";

import { GlassCard } from "./glass-card";
import { Check, X, Shield, Cpu, Zap, Activity } from "lucide-react";
import { StatusPill } from "./status-pill";

interface BenchmarkCardProps {
  name: string;
  type: string;
  dims: number;
  latency: string;
  memory: string;
  suitability: string;
  highlight?: boolean;
}

export function BenchmarkCard({ name, type, dims, latency, memory, suitability, highlight = false }: BenchmarkCardProps) {
  return (
    <GlassCard className={highlight ? "border-cyan-500/30 bg-cyan-500/5" : "border-white/5"} glow={highlight}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{type}</p>
        </div>
        {highlight && <StatusPill label="Recommended" status="online" />}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-400"><Cpu size={14} /> Dimension</span>
          <span className="font-mono text-white">{dims}-D</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-400"><Zap size={14} /> Avg. Latency</span>
          <span className="font-mono text-white">{latency}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-400"><Activity size={14} /> Memory</span>
          <span className="font-mono text-white">{memory}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Primary Use Case</p>
        <p className="text-sm text-slate-300 leading-relaxed">{suitability}</p>
      </div>
    </GlassCard>
  );
}
