"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Zap, 
  BrainCircuit, 
  Microscope, 
  Layers, 
  Fingerprint, 
  Database, 
  ShieldCheck,
  Cpu,
  Download,
  Terminal,
  FileCode
} from "lucide-react";

import { runPrithviEmbedding } from "@/lib/api";
import { PrithviResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { MetricCard } from "@/components/metric-card";
import { StatusPill } from "@/components/status-pill";
import { EmbeddingChartCard } from "@/components/embedding-chart-card";

export default function PrithviLabPage() {
  const [result, setResult] = useState<PrithviResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runDemo() {
    setLoading(true);
    setError(null);
    try {
      const res = await runPrithviEmbedding();
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prithvi request failed.");
    } finally {
      setLoading(false);
    }
  }

  const exportEmbedding = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.embedding_preview, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `prithvi_embedding_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Foundation Model Research"
        title="Prithvi EO 2.0 Lab"
        description="Deep-dive exploration of multispectral-temporal foundation model embeddings for research-grade geospatial intelligence."
        actions={
          result && (
            <GlowButton variant="outline" onClick={exportEmbedding}>
              <Download size={16} /> Export Embeddings
            </GlowButton>
          )
        }
      />

      {/* Model Stats Strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Model Backbone" value="ViT-Tiny" subValue="100M Params" icon={BrainCircuit} />
        <MetricCard label="Input Bands" value="6 Spectral" subValue="S2-L2A Optimized" icon={Layers} />
        <MetricCard label="Token Context" value="197 Tokens" subValue="14x14 Patches" icon={Fingerprint} />
        <MetricCard label="Embedding Dim" value="768-D" subValue="High-Fidelity Space" icon={Database} />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="border-cyan-500/20 bg-cyan-500/5" hover={false}>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-cyan-400">
                  <Microscope size={24} />
                  <h3 className="text-xl font-bold">Research Console</h3>
               </div>
               <p className="text-sm text-slate-400 leading-relaxed">
                 Trigger a full foundation model pass on a golden satellite sample to verify embedding drift and token alignment.
               </p>
               <GlowButton onClick={runDemo} className="w-full h-12" disabled={loading}>
                 {loading ? <Microscope className="animate-spin" size={18} /> : <Terminal size={18} />}
                 {loading ? "Executing Prithvi Inference..." : "Initialize Lab Run"}
               </GlowButton>
               
               <div className="pt-4 border-t border-white/5 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Metadata Providers</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill label="IBM-NASA" status="online" />
                    <StatusPill label="Multispectral" status="idle" />
                    <StatusPill label="Temporal" status="idle" />
                  </div>
               </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/5" hover={false}>
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Architecture Manifest</h4>
             <div className="space-y-4">
                {[
                  { label: "Patch Size", val: "16x16" },
                  { label: "Tubelet Size", val: "1" },
                  { label: "Encoder Layers", val: "12" },
                  { label: "Attention Heads", val: "12" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="text-xs font-mono text-cyan-400">{item.val}</span>
                  </div>
                ))}
             </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
             {!result && !loading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 text-center p-12"
               >
                 <Cpu size={64} className="mb-6 opacity-10" />
                 <h3 className="text-xl font-bold text-slate-400">Laboratory Offline</h3>
                 <p className="max-w-md mt-2">Initialize a run to stream multispectral-temporal embedding diagnostics directly from the Prithvi EO 2.0 Tiny backbone.</p>
               </motion.div>
             )}

             {loading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6"
               >
                 <div className="relative h-24 w-24">
                   <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10" />
                   <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin" />
                   <div className="absolute inset-4 rounded-full border-b-4 border-indigo-500/40 animate-[spin_2s_linear_infinite_reverse]" />
                 </div>
                 <div className="text-center space-y-2">
                   <p className="text-xl font-bold text-white">Prithvi 2.0 Inference Activation</p>
                   <p className="text-sm text-slate-500 uppercase tracking-[0.3em]">Synching with Orbital Nodes...</p>
                 </div>
               </motion.div>
             )}

             {result && !loading && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                 <div className="grid gap-4 sm:grid-cols-2">
                   <MetricCard 
                     label="Token Tensors" 
                     value={result.token_shape.join(" × ")} 
                     subValue="Patch-wise Embeddings" 
                     icon={Layers} 
                   />
                   <MetricCard 
                     label="Pooled Latent" 
                     value={result.embedding_shape.join(" × ")} 
                     subValue="Global Context Vector" 
                     icon={Fingerprint} 
                   />
                 </div>

                 <EmbeddingChartCard 
                    data={result.embedding_preview} 
                    title="Pooled Embedding Visualization (First 32 Indices)"
                 />

                 <GlassCard className="border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <FileCode size={20} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Raw Diagnostic Stream</h3>
                    </div>
                    <div className="rounded-xl bg-slate-950/80 p-4 font-mono text-[11px] text-cyan-500/80 max-h-48 overflow-y-auto border border-white/5">
                       <p className="text-slate-500">// Prithvi EO 2.0 Tiny Diagnostic Log</p>
                       <p className="mt-2">&gt; [MODEL_PHASE]: ENCODER_ACTIVATION</p>
                       <p>&gt; [TENSOR_STATUS]: ALIGNED</p>
                       <p>&gt; [TOKEN_COUNT]: {result.token_shape[1]}</p>
                       <p>&gt; [POOLED_DIM]: {result.embedding_shape[1]}</p>
                       <p className="mt-2 text-indigo-400">&gt; EMBEDDING_PREVIEW: [{result.embedding_preview.slice(0, 5).join(", ")} ...]</p>
                       <p className="mt-2 text-green-500">&gt; INF_SUCCESS_OK</p>
                    </div>
                 </GlassCard>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
