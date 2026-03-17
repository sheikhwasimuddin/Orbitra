import Link from "next/link";
import { 
  ArrowRight, 
  Boxes, 
  BrainCircuit, 
  Radar, 
  ScanSearch, 
  Zap, 
  ShieldCheck, 
  Globe2,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { MetricCard } from "@/components/metric-card";

const features = [
  {
    title: "Standard Analyzer",
    description: "Industrial-grade land-cover prediction and visual embedding summaries.",
    href: "/analyze",
    icon: Boxes,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Similarity Search",
    description: "Find geospatial visual matches across vast tile indexes with low latency.",
    href: "/similarity",
    icon: ScanSearch,
    color: "from-indigo-400 to-violet-500",
  },
  {
    title: "Snap Compare",
    description: "Measure semantic drift and change scores between multi-temporal snapshots.",
    href: "/compare",
    icon: Radar,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Prithvi Research Lab",
    description: "Advanced multispectral-temporal embeddings via IBM-NASA Prithvi EO 2.0.",
    href: "/prithvi-lab",
    icon: BrainCircuit,
    color: "from-purple-400 to-pink-500",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400">
              <Zap size={14} className="animate-pulse" />
              <span>Version 2.0: Mission Control Active</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                The Future of <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Satellite Intelligence
                </span>
              </h1>
              <p className="max-w-xl text-lg text-slate-400 leading-relaxed">
                GeoVision FM bridges the gap between research foundation models and industrial operations. Analyze, search, and monitor the earth with unprecedented precision.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <GlowButton className="h-12 px-8">
                  Launch Mission Control <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <Link href="/prithvi-lab">
                <GlowButton variant="outline" className="h-12 px-8">
                  Prithvi Lab
                </GlowButton>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-2xl font-bold text-white">Prithvi 2.0</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Foundation Model</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">768-D</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Embeddings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">&lt;150ms</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Inference</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 blur-3xl opacity-30" />
            <GlassCard className="border-white/10 p-0 overflow-hidden" hover={false}>
              <div className="bg-slate-900/40 p-1 border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Orbital Link Active</span>
              </div>
              <div className="aspect-square w-full bg-slate-950 p-8 relative flex items-center justify-center">
                 {/* Decorative Orbital Rings */}
                 <div className="absolute h-[80%] w-[80%] rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />
                 <div className="absolute h-[60%] w-[60%] rounded-full border border-indigo-500/10 animate-[spin_15s_linear_infinite_reverse]" />
                 <div className="absolute h-[40%] w-[40%] rounded-full border border-blue-500/5" />
                 
                 <div className="z-10 text-center space-y-4">
                    <Globe2 size={120} className="mx-auto text-cyan-400/80 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Mission: Global Coverage</p>
                      <p className="text-[10px] text-slate-500">Coordinate: 34.0522° N, 118.2437° W</p>
                    </div>
                 </div>
              </div>
            </GlassCard>
            
            {/* Floating Metric */}
            <div className="absolute -bottom-6 -left-6">
              <GlassCard className="p-4 py-3 bg-slate-900/80 backdrop-blur-2xl border-cyan-500/20 shadow-glow-cyan/10">
                <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-400" size={18} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Edge Processing</p>
                    <p className="text-sm font-bold text-white">98.4% Efficiency</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Advanced Intelligence Modules</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">Deploy specialized models for specific geospatial use cases.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href}>
                <GlassCard className="h-full group hover:border-white/20 transition-all">
                  <div className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-2.5 text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                  <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-widest text-cyan-400/50 group-hover:text-cyan-400">
                    Access Module <ArrowRight size={12} className="ml-1" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="pt-10">
        <GlassCard className="bg-gradient-to-br from-slate-900/50 to-transparent border-white/5" hover={false}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Model Architecture</h2>
              <div className="space-y-4">
                 {[
                   { title: "Prithvi EO 2.0 Tiny", desc: "A 100M parameter ViT-based foundation model trained by IBM & NASA.", icon: ShieldCheck },
                   { title: "Standard Analyzer", desc: "Optimized ResNet-based classifier for rapid triage and production deployment.", icon: Boxes },
                   { title: "HNSW Similarity Index", desc: "Fast vector search for massive imagery datasets with sub-linear complexity.", icon: ScanSearch },
                 ].map((item) => (
                   <div key={item.title} className="flex gap-4">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                        <item.icon size={14} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white/90">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/50 p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Embedding Stats</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               </div>
               <div className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[76%] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[45%] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[89%] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                  &gt; STACK: NEXTJS 15 + FASTAPI + TORCH <br />
                  &gt; STATUS: ALL_ORBITAL_SYSTEMS_GO
               </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
