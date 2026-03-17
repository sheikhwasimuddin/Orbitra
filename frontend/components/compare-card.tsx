import { CompareResponse } from "@/lib/types";

import { Card } from "@/components/ui/card";

type CompareCardProps = {
  result: CompareResponse;
};

export function CompareCard({ result }: CompareCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Comparison Result</h3>
      <div className="grid gap-4 text-sm text-slate-200 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-slate-400">Image 1 Top Class</p>
          <p className="text-xl font-semibold text-cyan-200">{result.image1_top_class}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-slate-400">Image 2 Top Class</p>
          <p className="text-xl font-semibold text-cyan-200">{result.image2_top_class}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-slate-400">Cosine Similarity</p>
          <p className="text-xl font-semibold text-cyan-200">{result.cosine_similarity.toFixed(4)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-slate-400">Change Score</p>
          <p className="text-xl font-semibold text-cyan-200">{result.change_score.toFixed(4)}</p>
        </div>
      </div>
    </Card>
  );
}
