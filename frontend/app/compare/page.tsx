"use client";

import { useState } from "react";

import { compareImages } from "@/lib/api";
import { CompareResponse } from "@/lib/types";
import { CompareCard } from "@/components/compare-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { UploadCard } from "@/components/upload-card";

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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Change Intelligence"
        title="Compare"
        description="Run pairwise analysis on two timestamps to estimate similarity and potential semantic drift."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <UploadCard
          title="Upload Image 1"
          description="Select JPG/PNG/TIF image."
          onFiles={(files) => setImage1(files[0] ?? null)}
        />
        <UploadCard
          title="Upload Image 2"
          description="Select JPG/PNG/TIF image."
          onFiles={(files) => setImage2(files[0] ?? null)}
        />
      </div>

      <Button onClick={runCompare} disabled={!image1 || !image2 || loading}>
        {loading ? "Comparing..." : "Run Comparison"}
      </Button>

      {error && <p className="rounded-xl border border-rose-300/20 bg-rose-900/20 p-3 text-sm text-rose-200">{error}</p>}
      {result && <CompareCard result={result} />}
    </section>
  );
}
