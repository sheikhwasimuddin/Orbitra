"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { runPrithviEmbedding } from "@/lib/api";
import { PrithviResponse } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { PrithviOutputCard } from "@/components/prithvi-output-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Foundation Model Lab"
        title="Prithvi Lab"
        description="Execute IBM-NASA Prithvi EO 2.0 Tiny TL embedding flow and inspect token and pooled embedding diagnostics."
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="p-8">
          <p className="max-w-3xl text-slate-200">
            This module is wired for backend verification and is useful as a smoke test before deploying
            full EO model workflows.
          </p>
          <Button onClick={runDemo} className="mt-6" disabled={loading}>
            {loading ? "Running Prithvi Demo..." : "Run Prithvi Embedding Demo"}
          </Button>
        </Card>
      </motion.div>

      {error && <p className="rounded-xl border border-rose-300/20 bg-rose-900/20 p-3 text-sm text-rose-200">{error}</p>}
      {result && <PrithviOutputCard data={result} />}
    </section>
  );
}
