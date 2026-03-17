import { HTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-cyan-200/15 bg-gradient-to-b from-white/10 to-white/[0.03] shadow-[0_22px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
