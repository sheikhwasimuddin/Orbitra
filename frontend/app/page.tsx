import Link from "next/link";
import { ArrowRight, Boxes, BrainCircuit, Radar, ScanSearch } from "lucide-react";

import { GeoFigure } from "@/components/geo-figure";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Standard Analyzer",
    description: "Fast land-cover prediction and embedding summary from JPG/PNG imagery.",
    href: "/analyze",
    icon: Boxes,
  },
  {
    title: "Similarity Search",
    description: "Find nearest geospatial visual matches with a lightweight deployable index.",
    href: "/similarity",
    icon: ScanSearch,
  },
  {
    title: "Compare",
    description: "Measure semantic drift and change score between two satellite snapshots.",
    href: "/compare",
    icon: Radar,
  },
  {
    title: "Prithvi Lab",
    description: "Run advanced multispectral-temporal embeddings via Prithvi EO 2.0 Tiny TL.",
    href: "/prithvi-lab",
    icon: BrainCircuit,
  },
];

export default function HomePage() {
  return (
    <section className="space-y-8 md:space-y-10">
      <Card className="overflow-hidden border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
          <PageHeader
            eyebrow="Foundation Model Inspired EO Intelligence"
            title="GeoVision FM"
            description="A full-stack satellite intelligence platform blending deployable lightweight inference with foundation-model experimentation for rapid geospatial operations."
            actions={
              <>
                <Link
                  href="/prithvi-lab"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 py-2 font-semibold text-slate-950"
                >
                  Open Prithvi Lab <ArrowRight size={16} />
                </Link>
                <Link
                  href="/analyze"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-semibold text-white"
                >
                  Start Standard Analysis
                </Link>
              </>
            }
          />
          <div className="space-y-3">
            <GeoFigure />
            <div className="rounded-2xl border border-white/15 bg-slate-950/40 p-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Readiness</p>
              <ul className="mt-3 space-y-2">
                <li>Docker-ready backend and frontend services</li>
                <li>Golden image verification workflow</li>
                <li>Prithvi EO 2.0 embedding diagnostics</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} href={feature.href}>
              <Card className="group h-full p-6 transition hover:-translate-y-1 hover:border-cyan-300/40">
                <Icon className="mb-3 text-cyan-200" />
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                <span className="mt-4 inline-block text-sm text-cyan-200">Explore module -&gt;</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
