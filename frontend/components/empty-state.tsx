import { ReactNode } from "react";

import { GlassCard } from "@/components/glass-card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <GlassCard className="border-dashed p-8 text-center">
      {icon ? <div className="mx-auto mb-3 w-fit text-cyan-200">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{description}</p>
    </GlassCard>
  );
}
