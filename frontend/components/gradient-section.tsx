import { HTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

export function GradientSection({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-cyan-200/15 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_90%_5%,rgba(99,102,241,0.16),transparent_40%),linear-gradient(170deg,rgba(7,20,36,0.95),rgba(3,9,18,0.98))] p-6 md:p-8",
        className,
      )}
      {...props}
    />
  );
}
