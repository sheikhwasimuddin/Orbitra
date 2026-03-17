"use client";

import { useState } from "react";
import { Search, Image as ImageIcon, Zap, Filter, Download, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { similaritySearch } from "@/lib/api";
import { SimilarityResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { GlowButton } from "@/components/glow-button";
import { UploadZone } from "@/components/upload-zone";
import { StatusPill } from "@/components/status-pill";

export default function SimilarityPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<SimilarityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSimilarity() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await similaritySearch(file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Similarity request failed.");
    } finally {
      setLoading(false);
    }
  }

  const exportResults = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.results, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `similarity_results_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Content Retrieval"
        title="Similarity Search"
        description="Search across massive geospatial tile catalogs using visual embeddings to find semantic matches."
        actions={
          result && (
            <GlowButton variant="outline" onClick={exportResults}>
              <Download size={16} /> Export Catalog
            </GlowButton>
          )
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Panel: Query */}
        <div className="lg:col-span-4 space-y-6">
          <UploadZone 
            onFileSelect={(f) => setFile(f)} 
            label="Query Tile"
            description="Find similar patterns in the index"
          />
          
          <GlassCard className="border-white/5" hover={false}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Search Params</span>
                <StatusPill label="HNSW Active" status="online" />
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">K-Neighbors</span>
                    <span className="text-white font-mono">Top 12</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Metric</span>
                    <span className="text-white font-mono">Cosine</span>
                 </div>
              </div>

              <GlowButton 
                onClick={runSimilarity} 
                className="w-full h-12" 
                disabled={!file || loading}
              >
                {loading ? <Zap className="animate-spin" size={18} /> : <Search size={18} />}
                {loading ? "Searching Index..." : "Initiate Search"}
              </GlowButton>
            </div>
          </GlassCard>
        </div>

        {/* Right Panel: Matches */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {!result && !loading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-slate-500 p-12 text-center"
               >
                 <ImageIcon size={64} className="mb-6 opacity-10" />
                 <h3 className="text-xl font-bold text-slate-400">Search Inactive</h3>
                 <p className="max-w-md mt-2">Upload a query tile to scan the geospatial index for perceptual and semantic matches.</p>
               </motion.div>
             )}

             {loading && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6"
               >
                 <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10" />
                    <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin" />
                    <Scan className="absolute inset-0 m-auto text-cyan-400/50 animate-pulse" size={32} />
                 </div>
                 <div className="text-center">
                    <p className="text-xl font-bold text-white tracking-tight">Perceptual Hashing</p>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">Traversing Vector Space...</p>
                 </div>
               </motion.div>
             )}

             {result && !loading && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                 <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Top Neural Matches</h3>
                    <div className="flex gap-2">
                       <span className="rounded bg-white/5 px-2 py-1 text-[10px] text-slate-400">Model: {result.query_model}</span>
                    </div>
                 </div>

                 <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                   {result.results.map((item, idx) => (
                     <motion.div
                       key={item.id}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: idx * 0.05 }}
                     >
                       <GlassCard className="p-0 border-white/5 group hover:border-cyan-500/30">
                         <div className="aspect-square w-full relative overflow-hidden">
                            <img 
                              src={item.thumbnail} 
                              alt={item.title} 
                              className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2">
                               <StatusPill label={`${(item.similarity * 100).toFixed(1)}%`} status="online" />
                            </div>
                         </div>
                         <div className="p-3">
                            <p className="text-xs font-bold text-white truncate">{item.title}</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">{item.id}</p>
                         </div>
                       </GlassCard>
                     </motion.div>
                   ))}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
