"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";

type ChartCardProps = {
  data: Array<{ label: string; confidence: number }>;
};

export function ChartCard({ data }: ChartCardProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Confidence Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#9fb2d0" />
            <YAxis stroke="#9fb2d0" />
            <Tooltip />
            <Bar dataKey="confidence" fill="#15c4ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
