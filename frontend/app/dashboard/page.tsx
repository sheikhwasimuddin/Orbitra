"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Activity, Zap, Database, Globe, Layers, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import { GeoFigure } from "@/components/geo-figure";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { MetricCard } from "@/components/metric-card";
import { TimelineCard } from "@/components/timeline-card";
import { RadarChartCard } from "@/components/radar-chart-card";

const missionProfile = [
  { subject: "Coverage", A: 84, fullMark: 100 },
  { subject: "Accuracy", A: 92, fullMark: 100 },
  { subject: "Latency", A: 75, fullMark: 100 },
  { subject: "Reliability", A: 98, fullMark: 100 },
  { subject: "Throughput", A: 65, fullMark: 100 },
];

const classData = [
  { name: "Urban", value: 36, color: "#22d3ee" },
  { name: "Vegetation", value: 28, color: "#818cf8" },
  { name: "Water", value: 18, color: "#3b82f6" },
  { name: "Soil", value: 12, color: "#6366f1" },
  { name: "Other", value: 6, color: "#1e1b4b" },
];

const timelineData = [
  { id: "1", title: "Standard Analysis", description: "Batch extraction for Region-7 completed.", time: "2 min ago", type: "success" as const },
  { id: "2", title: "Prithvi Inference", description: "Backbone sync successful (197 tokens).", time: "15 min ago", type: "info" as const },
  { id: "3", title: "Similarity Search", description: "HNSW index traversed for 32 targets.", time: "1 hour ago", type: "info" as const },
  { id: "4", title: "Comparison Report", description: "Semantic drift detected in Sector B-3.", time: "2 hours ago", type: "warning" as const },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Mission Control"
        title="Operations Overview"
        description="Real-time telemetry and operational metrics for the GeoVision FM intelligence pipeline."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Intelligence" value="1,284" subValue="+12% from baseline" icon={Database} />
        <MetricCard label="Prithvi Activations" value="182" subValue="Foundation model hits" icon={Zap} />
        <MetricCard label="Avg Inference" value="137ms" subValue="Optimized edge kernels" icon={Activity} />
        <MetricCard label="Global Coverage" value="84.2%" subValue="Satellite index sync" icon={Globe} />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
           <GlassCard className="border-white/5 overflow-hidden group">
              <div className="absolute top-4 right-4 z-20">
                 <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live Engine</span>
                 </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Situational Figure</h3>
                <p className="text-xs text-slate-500 mb-6">Interactive 3D orbital projection of intelligence targets.</p>
                <div className="h-[400px] w-full bg-slate-950/50 rounded-2xl border border-white/5 relative overflow-hidden">
                   <GeoFigure />
                   <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none">
                      <div className="flex gap-4">
                        <div className="text-center">
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Orbit</p>
                           <p className="text-xs text-white">LEO-Sync</p>
                        </div>
                        <div className="text-center border-l border-white/10 pl-4">
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Station</p>
                           <p className="text-xs text-white">GV-Alpha</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
           </GlassCard>

           <div className="grid gap-6 md:grid-cols-2">
              <GlassCard className="border-white/5">
                 <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Class Distribution</h3>
                       <p className="text-[10px] text-slate-500">Global catalog distribution</p>
                    </div>
                    <BarChart3 size={20} className="text-cyan-400" />
                 </div>
                 <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={classData} 
                          dataKey="value" 
                          nameKey="name" 
                          innerRadius={60} 
                          outerRadius={80} 
                          paddingAngle={5}
                          stroke="none"
                        >
                          {classData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-2xl font-bold text-white">72%</span>
                       <span className="text-[8px] text-slate-500 uppercase font-bold">Conf Index</span>
                    </div>
                 </div>
              </GlassCard>

              <GlassCard className="border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                    <TrendingUp size={40} className="text-cyan-500/5" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Efficiency Pulse</h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] uppercase font-bold">
                          <span className="text-slate-500">Model Accuracy</span>
                          <span className="text-cyan-400">92.4%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "92.4%" }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-glow-cyan/20"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] uppercase font-bold">
                          <span className="text-slate-500">Processing Load</span>
                          <span className="text-indigo-400">42%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "42%" }}
                            className="h-full bg-gradient-to-r from-indigo-400 to-violet-500"
                          />
                       </div>
                    </div>
                 </div>
              </GlassCard>
           </div>

           <div className="mt-8">
              <RadarChartCard 
                title="Mission Operational Profile" 
                description="Composite efficiency score across five key performance pillars."
                data={missionProfile} 
              />
           </div>
        </div>

        <div className="lg:col-span-4">
           <GlassCard className="border-white/5 h-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Real-time Stream</h3>
              <TimelineCard items={timelineData} />
           </GlassCard>
           
           <GlassCard className="mt-6 border-white/5 bg-gradient-to-br from-white/5 to-transparent" hover={false}>
              <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Node Health</h4>
              <div className="space-y-3">
                 {[
                   { name: "Orbital-Link Alpha", ping: "12ms", load: "Low" },
                   { name: "Ground-Station-01", ping: "45ms", load: "Nominal" },
                   { name: "GV-Inference-B", ping: "15ms", load: "Active" },
                 ].map(node => (
                   <div key={node.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                         <p className="text-xs font-bold text-white">{node.name}</p>
                         <p className="text-[10px] text-slate-500">{node.ping}</p>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400/80 px-2 py-0.5 bg-cyan-400/10 rounded-full">{node.load}</span>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
