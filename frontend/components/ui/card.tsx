import { HTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-200/15 bg-gradient-to-b from-white/12 to-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_rgba(3,9,24,0.42)]",
        className,
      )}
      {...props}
    />
  );
}
