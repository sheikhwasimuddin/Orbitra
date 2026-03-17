import { ButtonHTMLAttributes } from "react";

import { cn } from "@/components/ui/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "bg-gradient-to-r from-cyan-300 to-indigo-300 text-slate-950 shadow-[0_8px_26px_rgba(34,211,238,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(34,211,238,0.35)]"
          : "border border-white/20 bg-white/5 text-white hover:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}
