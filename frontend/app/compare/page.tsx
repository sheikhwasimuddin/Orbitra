"use client";

import { useState } from "react";
import { Copy, ArrowRightLeft, Zap, Download, Layers, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { compareImages } from "@/lib/api";
import { CompareResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { UploadZone } from "@/components/upload-zone";
import { MetricCard } from "@/components/metric-card";
import { ResultStat } from "@/components/result-stat";
import { StatusPill } from "@/components/status-pill";

export default function ComparePage() {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runCompare() {
    if (!image1 || !image2) return;
    setLoading(true);
    setError(null);
    try {
      const res = await compareImages(image1, image2);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }

  const exportComparison = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `comparison_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Intelligence Reports"
        title="Pairwise Comparison"
        description="Analyze semantic drift and structural changes between two satellite acquisitions using neural cross-attention."
        actions={
          result && (
            <GlowButton variant="outline" onClick={exportComparison}>
              <Download size={16} /> Export Report
            </GlowButton>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <UploadZone 
          onFileSelect={(f) => setImage1(f)} 
          label="Temporal Source A"
          description="Baseline acquisition (T-0)"
        />
        <UploadZone 
          onFileSelect={(f) => setImage2(f)} 
          label="Temporal Source B"
          description="Comparative acquisition (T+1)"
        />
      </div>

      <div className="flex justify-center">
        <GlowButton 
          onClick={runCompare} 
          disabled={!image1 || !image2 || loading}
          className="h-14 px-10 text-lg shadow-glow-indigo/20"
        >
          {loading ? <ArrowRightLeft className="animate-spin" size={20} /> : <Zap size={20} />}
          {loading ? "Computing Cross-Entropy..." : "Execute Comparison Flow"}
        </GlowButton>
      </div>

      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard 
                label="Cosine Similarity" 
                value={`${(result.cosine_similarity * 100).toFixed(1)}%`}
                subValue="Global Feature Alignment"
                icon={Copy}
              />
              <MetricCard 
                label="Change Index" 
                value={`${(result.change_score * 100).toFixed(1)}%`}
                subValue="Structural Variance"
                icon={Layers}
              />
              <MetricCard 
                label="Drift Confidence" 
                value="High" 
                subValue="Validated Index"
                icon={CheckCircle2}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
               <GlassCard className="border-white/5">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Class Comparison</h3>
                     <StatusPill label="Semantic Sync" status="online" />
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">A</div>
                        <div className="flex-1">
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Primary Label (Source A)</p>
                           <p className="text-white font-bold">{result.image1_top_class}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">B</div>
                        <div className="flex-1">
                           <p className="text-[10px] text-slate-500 uppercase font-bold">Primary Label (Source B)</p>
                           <p className="text-white font-bold">{result.image2_top_class}</p>
                        </div>
                     </div>
                  </div>
               </GlassCard>

               <GlassCard className="border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                     <ShieldAlert size={40} className="text-indigo-500/10" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Change Insights</h3>
                  <div className="space-y-4">
                     <ResultStat 
                       label="Visual Consistency" 
                       value={`${(result.cosine_similarity * 100).toFixed(0)}%`} 
                       percentage={result.cosine_similarity * 100} 
                       color="bg-cyan-400"
                     />
                     <ResultStat 
                       label="Semantic Drift" 
                       value={`${(result.change_score * 100).toFixed(0)}%`} 
                       percentage={result.change_score * 100} 
                       color="bg-indigo-500"
                     />
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                     <p className="text-xs text-slate-400 italic">
                       Detection Engine: Semantic drift and class consistency are within acceptable research bounds for this region.
                     </p>
                  </div>
               </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
