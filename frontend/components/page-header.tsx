import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  status?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, status, actions }: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        {status ? (
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
            {status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
