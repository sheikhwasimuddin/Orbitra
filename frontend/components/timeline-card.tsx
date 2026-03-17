"use client";

import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "success" | "info" | "warning";
}

export function TimelineCard({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-6">
      {items.map((item, idx) => (
        <div key={item.id} className="relative flex gap-4">
          {idx !== items.length - 1 && (
            <div className="absolute left-[7px] top-6 h-[calc(100%-12px)] w-[2px] bg-white/5" />
          )}
          <div className={cn(
            "mt-1.5 h-4 w-4 rounded-full border-2 border-slate-900 z-10 flex items-center justify-center",
            item.type === "success" ? "bg-green-500" : item.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
          )} />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <span className="text-[10px] font-medium text-slate-500">{item.time}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
