"use client";

import { cn } from "@/lib/utils";

interface ResultStatProps {
  label: string;
  value: string | number;
  percentage?: number;
  color?: string;
  className?: string;
}

export function ResultStat({ label, value, percentage, color = "bg-cyan-500", className }: ResultStatProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-400">{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      {percentage !== undefined && (
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", color)} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
