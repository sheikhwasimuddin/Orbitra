import { ReactNode } from "react";

import { GlassCard } from "@/components/glass-card";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <GlassCard className="group p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
        {icon ? <div className="text-cyan-200">{icon}</div> : null}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-100">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-300">{hint}</p> : null}
    </GlassCard>
  );
}
