"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({ children, className, hover = true, glow = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "glass-panel rounded-2xl overflow-hidden transition-all duration-300 relative",
        glow && "hover:shadow-glow-cyan/20",
        className
      )}
      {...(props as any)}
    >
      <div className="relative z-10">{children}</div>
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
}
