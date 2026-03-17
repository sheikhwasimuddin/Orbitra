"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function GlowButton({ children, variant = "primary", className, ...props }: GlowButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan/20",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "border border-white/20 text-white hover:bg-white/5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
