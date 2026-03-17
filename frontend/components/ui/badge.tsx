import { HTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-400/15 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-cyan-100",
        className,
      )}
      {...props}
    />
  );
}
