"use client";

import { useMemo, useState } from "react";
import { Download, Scan, Zap, Layers, BarChart3, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { analyzeImage } from "@/lib/api";
import { AnalyzeResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { MetricCard } from "@/components/metric-card";
import { UploadZone } from "@/components/upload-zone";
import { ResultStat } from "@/components/result-stat";
import { EmbeddingChartCard } from "@/components/embedding-chart-card";
import { StatusPill } from "@/components/status-pill";
import { RadarChartCard } from "@/components/radar-chart-card";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const radarData = useMemo(() => {
    if (!result) return [];
    return result.predictions.map(p => ({
      subject: p.label,
      A: p.confidence * 100,
      fullMark: 100
    }));
  }, [result]);

  async function runAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeImage(file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  const exportJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `geovision_analysis_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Mission Configuration"
        title="Standard Analyzer"
        description="Deploy lightweight inference kernels for rapid land-cover classification and feature extraction."
        actions={
          result && (
            <GlowButton variant="outline" onClick={exportJSON}>
              <Download size={16} /> Export Intelligence
            </GlowButton>
          )
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Panel: Input */}
        <div className="lg:col-span-5 space-y-6">
          <UploadZone 
            onFileSelect={(f) => setFile(f)} 
            label="Satellite Snapshot"
            description="Drag and drop JPG/PNG/TIF for rapid analysis"
          />
          
          <div className="flex items-center justify-between p-1 bg-white/5 rounded-2xl border border-white/5">
             <div className="px-4">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Selected Target</p>
                <p className="text-sm font-bold text-white truncate max-w-[200px]">{file ? file.name : "None"}</p>
             </div>
             <GlowButton 
               onClick={runAnalyze} 
               disabled={!file || loading}
               className="h-12 px-6"
             >
               {loading ? <Zap className="animate-spin" size={18} /> : <Scan size={18} />}
               {loading ? "Analyzing Layer..." : "Run Analysis"}
             </GlowButton>
          </div>

          <GlassCard className="border-white/5" hover={false}>
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              <Info size={18} />
              <h4 className="text-sm font-bold uppercase tracking-widest">Model Specs</h4>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Kernel Arch</span>
                  <span className="text-slate-300 font-mono">ResNet-50-Industrial</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Input Res</span>
                  <span className="text-slate-300 font-mono">224 x 224 (Normalized)</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Quantization</span>
                  <span className="text-slate-300 font-mono">INT8 Optimized</span>
               </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="idle"
                className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 p-8 text-center"
              >
                <Layers size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-bold text-slate-400">System Idle</p>
                <p className="text-sm max-w-xs mt-1">Upload a satellite snapshot to populate the intelligence dashboard.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="loading"
                className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-cyan-500/20" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-cyan-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white tracking-tight">Processing Imagery</p>
                  <p className="text-sm text-slate-500 uppercase tracking-widest">Extracting Embeddings...</p>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key="result"
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard 
                    label="Prediction Confidence" 
                    value={`${(result.predictions[0].confidence * 100).toFixed(1)}%`}
                    subValue={`Target: ${result.predictions[0].label}`}
                    icon={BarChart3}
                  />
                  <MetricCard 
                    label="Inference Latency" 
                    value={`${result.analysis_time_ms}ms`}
                    subValue="Production Edge Kernel"
                    icon={Zap}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <GlassCard className="border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Classification Results</h3>
                      <StatusPill label="Verified" status="online" />
                    </div>
                    <div className="space-y-5">
                      {result.predictions.map((pred, i) => (
                        <ResultStat 
                          key={pred.label}
                          label={pred.label}
                          value={`${(pred.confidence * 100).toFixed(2)}%`}
                          percentage={pred.confidence * 100}
                          color={i === 0 ? "bg-cyan-400" : "bg-white/10"}
                        />
                      ))}
                    </div>
                  </GlassCard>

                  <RadarChartCard 
                    title="Spectral Signature" 
                    description="Relative class confidence distribution across neural layers." 
                    data={radarData} 
                  />
                </div>

                <EmbeddingChartCard 
                  data={[result.embedding_summary.mean, result.embedding_summary.std]} 
                  title="Embedding Summary (Mean/Std Stats)"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
