"use client";

import { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, subValue, trend, className }: MetricCardProps) {
  return (
    <GlassCard className={cn("p-4", className)} hover={false}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className="mt-1 text-2xl font-bold text-white">{value}</h3>
          {subValue && (
            <p className="mt-1 text-xs text-slate-500">{subValue}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <Icon size={20} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
