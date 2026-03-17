"use client";

import { useMemo, useState } from "react";

import { analyzeImage } from "@/lib/api";
import { AnalyzeResponse } from "@/lib/types";
import { ChartCard } from "@/components/chart-card";
import { EmbeddingCard } from "@/components/embedding-card";
import { PageHeader } from "@/components/page-header";
import { PredictionList } from "@/components/prediction-list";
import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/upload-card";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(
    () =>
      (result?.predictions ?? []).map((pred) => ({
        label: pred.label,
        confidence: Number((pred.confidence * 100).toFixed(2)),
      })),
    [result],
  );

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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Core Workflow"
        title="Standard Analyzer"
        description="Upload one satellite frame and generate top land-cover classes with embedding summary statistics."
      />
      <UploadCard
        title="Upload Satellite Image"
        onFiles={(files) => setFile(files[0] ?? null)}
        description="Drop one JPG/PNG/TIF image to run lightweight analysis."
      />

      <div className="flex items-center gap-3">
        <Button onClick={runAnalyze} disabled={!file || loading}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </Button>
        <p className="text-sm text-slate-300">{file ? file.name : "No file selected"}</p>
      </div>

      {error && <p className="rounded-xl border border-rose-300/20 bg-rose-900/20 p-3 text-sm text-rose-200">{error}</p>}

      {result && (
        <div className="grid gap-4 lg:grid-cols-2">
          <PredictionList predictions={result.predictions} />
          <EmbeddingCard
            dimension={result.embedding_summary.dimension}
            mean={result.embedding_summary.mean}
            std={result.embedding_summary.std}
            analysisTimeMs={result.analysis_time_ms}
          />
          <div className="lg:col-span-2">
            <ChartCard data={chartData} />
          </div>
        </div>
      )}
    </section>
  );
}
