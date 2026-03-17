import { PrithviResponse } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PrithviOutputCardProps = {
  data: PrithviResponse;
};

export function PrithviOutputCard({ data }: PrithviOutputCardProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge>IBM-NASA Prithvi EO 2.0 Tiny</Badge>
          <Badge>Multispectral</Badge>
          <Badge>Temporal</Badge>
          <Badge>768-D Embeddings</Badge>
        </div>
        <h3 className="text-xl font-semibold text-white">{data.model}</h3>
        <p className="mt-2 text-sm text-slate-300">
          Advanced foundation-model output from encoder token pooling.
        </p>
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Shapes</h4>
        <p className="text-sm text-slate-200">Token Shape: [{data.token_shape.join(", ")}]</p>
        <p className="text-sm text-slate-200">Embedding Shape: [{data.embedding_shape.join(", ")}]</p>
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Embedding Statistics</h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
          <p>Mean: {data.embedding_stats.mean.toFixed(6)}</p>
          <p>Std: {data.embedding_stats.std.toFixed(6)}</p>
          <p>Min: {data.embedding_stats.min.toFixed(6)}</p>
          <p>Max: {data.embedding_stats.max.toFixed(6)}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Preview (first 16 values)</h4>
        <p className="rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs text-cyan-100">
          [{data.embedding_preview.map((v) => v.toFixed(6)).join(", ")}]
        </p>
      </Card>

      <Card className="p-6">
        <h4 className="mb-3 text-lg font-semibold text-white">Metadata</h4>
        <div className="space-y-1 text-sm text-slate-200">
          <p>Image size: {data.metadata.img_size}</p>
          <p>Input channels: {data.metadata.in_chans}</p>
          <p>Frames: {data.metadata.num_frames}</p>
          <p>Bands: {data.metadata.bands.join(", ")}</p>
        </div>
      </Card>
    </div>
  );
}
