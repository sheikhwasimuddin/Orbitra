"use client";

import { cn } from "@/lib/utils";

interface StatusPillProps {
  label: string;
  status?: "online" | "offline" | "processing" | "idle";
  className?: string;
}

export function StatusPill({ label, status = "online", className }: StatusPillProps) {
  const colors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    processing: "bg-cyan-500 animate-pulse",
    idle: "bg-slate-500",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]", colors[status], status === "online" ? "text-green-400" : status === "processing" ? "text-cyan-400" : "text-slate-400")} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{label}</span>
    </div>
  );
}
