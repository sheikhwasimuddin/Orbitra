"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  BarChart2, 
  Layers, 
  Zap, 
  Settings,
  Menu,
  X,
  Boxes,
  Radar,
  BrainCircuit
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Standard Analyzer", href: "/analyze", icon: Boxes },
  { name: "Similarity Search", href: "/similarity", icon: Search },
  { name: "Snap Compare", href: "/compare", icon: Radar },
  { name: "Prithvi Lab", href: "/prithvi-lab", icon: BrainCircuit },
  { name: "Embeddings Lab", href: "/embeddings", icon: Zap },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/5 bg-slate-950/20 backdrop-blur-xl lg:block z-50">
        <div className="flex h-full flex-col p-6">
          <Link href="/" className="flex items-center gap-3 px-2 py-4 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500" />
            <span className="text-lg font-bold tracking-tight text-white">GeoVision FM</span>
          </Link>
          
          <nav className="mt-8 flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white/10 text-white shadow-inner" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-cyan-400" : ""} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
             <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent p-4 border border-white/5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Model Info</p>
                <p className="mt-1 text-xs text-slate-400">Prithvi EO 2.0 Tiny v1.2</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Header Mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/20 px-4 backdrop-blur-lg lg:hidden">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500" />
            <span className="font-bold text-white">GeoVision FM</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400">
            {isOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500" />
                  <span className="text-lg font-bold text-white">GeoVision FM</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400">
                  <X />
                </button>
              </div>
              <nav className="mt-12 space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 text-xl font-medium text-slate-300 hover:text-white"
                    >
                      <Icon size={24} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
