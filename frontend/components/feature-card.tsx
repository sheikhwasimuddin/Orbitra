import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { GlassCard } from "@/components/glass-card";

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

export function FeatureCard({ title, description, href, icon: Icon, accent }: FeatureCardProps) {
  return (
    <Link href={href} className="block h-full">
      <GlassCard className="group relative h-full overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40">
        <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${accent}`} />
        <div className="relative z-10">
          <div className="inline-flex rounded-2xl border border-cyan-200/20 bg-cyan-400/10 p-3 text-cyan-100">
            <Icon size={20} />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          <span className="mt-4 inline-block text-sm font-medium text-cyan-200">Open Module -&gt;</span>
        </div>
      </GlassCard>
    </Link>
  );
}
