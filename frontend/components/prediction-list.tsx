import { PredictionItem } from "@/lib/types";

import { Card } from "@/components/ui/card";

type PredictionListProps = {
  predictions: PredictionItem[];
};

export function PredictionList({ predictions }: PredictionListProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Top Predictions</h3>
      <div className="space-y-4">
        {predictions.map((pred) => (
          <div key={pred.label}>
            <div className="mb-1 flex justify-between text-sm text-slate-200">
              <span>{pred.label}</span>
              <span>{(pred.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                style={{ width: `${Math.max(4, pred.confidence * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
