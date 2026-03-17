import { Card } from "@/components/ui/card";

type EmbeddingCardProps = {
  dimension: number;
  mean: number;
  std: number;
  analysisTimeMs?: number;
};

export function EmbeddingCard({ dimension, mean, std, analysisTimeMs }: EmbeddingCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Embedding Summary</h3>
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
        <div>
          <p className="text-slate-400">Dimension</p>
          <p className="text-xl font-semibold text-cyan-200">{dimension}</p>
        </div>
        <div>
          <p className="text-slate-400">Mean</p>
          <p className="text-xl font-semibold text-cyan-200">{mean.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-slate-400">Std</p>
          <p className="text-xl font-semibold text-cyan-200">{std.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-slate-400">Latency</p>
          <p className="text-xl font-semibold text-cyan-200">{analysisTimeMs ?? 0} ms</p>
        </div>
      </div>
    </Card>
  );
}
