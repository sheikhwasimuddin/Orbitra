import { SimilarityItem } from "@/lib/types";

import { Card } from "@/components/ui/card";

type SimilarityGridProps = {
  items: SimilarityItem[];
};

export function SimilarityGrid({ items }: SimilarityGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <img src={item.thumbnail} alt={item.title} className="h-36 w-full object-cover" />
          <div className="p-4">
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-slate-300">ID: {item.id}</p>
            <p className="mt-2 inline-flex rounded-full border border-cyan-300/40 px-2 py-0.5 text-xs text-cyan-200">
              Similarity: {item.similarity.toFixed(2)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
