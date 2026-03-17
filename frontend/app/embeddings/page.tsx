"use client";

import { useState } from "react";
import { 
  Network, 
  Layers, 
  BarChart3, 
  ScatterChart as ScatterIcon, 
  Zap, 
  Download,
  Database,
  Box,
  Brain,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  Cell,
  BarChart,
  Bar
} from "recharts";

import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { MetricCard } from "@/components/metric-card";
import { BenchmarkCard } from "@/components/benchmark-card";
import { RadarChartCard } from "@/components/radar-chart-card";

const mockScatterData = Array.from({ length: 150 }, (_, i) => ({
  x: Math.random() * 10 - 5 + (i % 3 === 0 ? 4 : i % 3 === 1 ? -4 : 0),
  y: Math.random() * 10 - 5 + (i % 3 === 0 ? 4 : i % 3 === 1 ? -4 : 0),
  z: Math.random() * 10,
  label: i % 3 === 0 ? "Urban" : i % 3 === 1 ? "Vegetation" : "Water",
  color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#818cf8" : "#3b82f6"
}));

const mockBarData = Array.from({ length: 32 }, (_, i) => ({
  index: i,
  value: Math.random() * 2 - 1,
}));

const mockRadarData = [
  { subject: "Accuracy", A: 92, fullMark: 100 },
  { subject: "Latency", A: 85, fullMark: 100 },
  { subject: "Memory", A: 78, fullMark: 100 },
  { subject: "Dimensions", A: 95, fullMark: 100 },
  { subject: "Stability", A: 88, fullMark: 100 },
  { subject: "Entropy", A: 82, fullMark: 100 },
];

export default function EmbeddingsPage() {
  const [activeView, setActiveView] = useState<"2d" | "bars" | "benchmark" | "radar">("2d");

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Intelligence Laboratory"
        title="Embedding Visualization"
        description="High-dimensional neural feature analysis. Explore how the Prithvi backbone clusters geospatial semantic concepts."
        actions={
          <GlowButton variant="outline">
            <Download size={16} /> Export High-D Tensors
          </GlowButton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Latent Space" value="Vector-12" subValue="HNSW Partitioned" icon={Network} />
        <MetricCard label="Cluster Density" value="0.84" subValue="Silhouette Score" icon={Layers} />
        <MetricCard label="Semantic Depth" value="768" subValue="Dimensionality" icon={Brain} />
        <MetricCard label="Inference Node" value="A100-GV" subValue="Cloud Native" icon={Cpu} />
      </div>

      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
        {[
          { id: "2d", icon: ScatterIcon, label: "2D Projection" },
          { id: "bars", icon: BarChart3, label: "Feature Vectors" },
          { id: "benchmark", icon: Box, label: "Model Benchmarks" },
          { id: "radar", icon: Network, label: "Neural Topology" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeView === tab.id 
                ? "bg-cyan-500 text-white shadow-glow-cyan/20" 
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeView === "2d" && (
          <motion.div
            key="2d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="border-white/5 p-8">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-white uppercase tracking-[0.1em]">UMAP Dimension Reduction</h3>
                     <p className="text-sm text-slate-500 italic">Projecting 768-D space into 2D for human-interpretable clustering.</p>
                  </div>
                  <div className="flex gap-4">
                     {["Urban", "Vegetation", "Water"].map((l, i) => (
                        <div key={l} className="flex items-center gap-2">
                           <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-cyan-400" : i === 1 ? "bg-indigo-400" : "bg-blue-600"}`} />
                           <span className="text-[10px] uppercase font-bold text-slate-400">{l}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="h-[500px] w-full bg-slate-950/40 rounded-3xl border border-white/5 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <XAxis type="number" dataKey="x" hide />
                      <YAxis type="number" dataKey="y" hide />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Scatter name="Embeddings" data={mockScatterData}>
                         {mockScatterData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                         ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
          </motion.div>
        )}

        {activeView === "bars" && (
          <motion.div
            key="bars"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-8 lg:grid-cols-12"
          >
             <div className="lg:col-span-8">
                <GlassCard className="border-white/5 p-8 h-full">
                  <h3 className="text-xl font-bold text-white uppercase tracking-[0.1em] mb-8">Latent Activation Map</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockBarData}>
                        <XAxis dataKey="index" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {mockBarData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.value > 0 ? '#22d3ee' : '#6366f1'} 
                                fillOpacity={0.8}
                              />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
             </div>
             <div className="lg:col-span-4 space-y-6">
                <GlassCard className="border-white/5" hover={false}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Statistic Profile</h4>
                  <div className="space-y-4">
                     {[
                       { label: "Vector Sparsity", val: "12.4%" },
                       { label: "Mean Activation", val: "0.041" },
                       { label: "Std Deviation", val: "0.682" },
                       { label: "Entropy", val: "7.14 bits" },
                     ].map(item => (
                       <div key={item.label} className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-slate-500">{item.label}</span>
                          <span className="text-xs font-mono text-cyan-400">{item.val}</span>
                       </div>
                     ))}
                  </div>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20" hover={false}>
                   <div className="flex gap-3 text-indigo-400 mb-4">
                      <Zap size={20} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Research Note</h4>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Negative activations in indices 14-22 correlate strongly with high-frequency vegetation texture in sub-tropical regions.
                   </p>
                </GlassCard>
             </div>
          </motion.div>
        )}

        {activeView === "benchmark" && (
          <motion.div
            key="benchmark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <BenchmarkCard 
               name="Prithvi EO 2.0 Tiny"
               type="Foundation Model"
               dims={768}
               latency="450ms"
               memory="1.2GB"
               suitability="Multispectral-temporal feature extraction."
               highlight
            />
            <BenchmarkCard 
               name="ResNet-50-Standard"
               type="Baseline kernel"
               dims={2048}
               latency="120ms"
               memory="0.8GB"
               suitability="Structural land-cover classification."
            />
            <BenchmarkCard 
               name="ViT-Large-EO"
               type="Custom Transformer"
               dims={1024}
               latency="1.2s"
               memory="4.5GB"
               suitability="High-resolution localized change detection."
            />
          </motion.div>
        )}

        {activeView === "radar" && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-2xl">
              <RadarChartCard 
                title="Prithvi 2.0 Feature Topology" 
                description="Composite performance and architectural score across research dimensions."
                data={mockRadarData} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 text-slate-500">
           <Database size={18} />
           <p className="text-xs uppercase font-bold tracking-[0.2em]">Neural Database Sync: 1,280 Vectors Indexed</p>
        </div>
      </div>
    </div>
  );
}
