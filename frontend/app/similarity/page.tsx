"use client";

import { useState } from "react";

import { similaritySearch } from "@/lib/api";
import { SimilarityResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { SimilarityGrid } from "@/components/similarity-grid";
import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/upload-card";

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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Retrieval"
        title="Similarity Search"
        description="Submit a query tile and retrieve nearest visual matches from the in-memory EO index."
      />
      <UploadCard
        title="Upload Query Image"
        description="Drop one JPG/PNG/TIF image to run similarity search."
        onFiles={(files) => setFile(files[0] ?? null)}
      />

      <div className="flex items-center gap-3">
        <Button onClick={runSimilarity} disabled={!file || loading}>
          {loading ? "Searching..." : "Run Similarity Search"}
        </Button>
        <p className="text-sm text-slate-300">{file ? file.name : "No file selected"}</p>
      </div>

      {error && <p className="rounded-xl border border-rose-300/20 bg-rose-900/20 p-3 text-sm text-rose-200">{error}</p>}

      {result && <SimilarityGrid items={result.results} />}
    </section>
  );
}
