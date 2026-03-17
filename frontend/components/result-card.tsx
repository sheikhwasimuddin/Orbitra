import { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type ResultCardProps = {
  title: string;
  children: ReactNode;
};

export function ResultCard({ title, children }: ResultCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      {children}
    </Card>
  );
}
