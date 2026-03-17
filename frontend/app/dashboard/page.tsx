"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { GeoFigure } from "@/components/geo-figure";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

const classData = [
  { name: "Urban", value: 36 },
  { name: "Vegetation", value: 28 },
  { name: "Water", value: 18 },
  { name: "Soil", value: 12 },
  { name: "Other", value: 6 },
];

const history = [
  { id: "req_1121", module: "Analyze", status: "Completed", latency: "124 ms" },
  { id: "req_1122", module: "Similarity", status: "Completed", latency: "89 ms" },
  { id: "req_1123", module: "Prithvi", status: "Completed", latency: "542 ms" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Dashboard"
        description="Operational snapshot for request throughput, module utilization, class distribution, and recent activity."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-slate-400">Total Requests (24h)</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-200">1,284</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-400">Prithvi Lab Runs</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-200">182</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-400">Avg Latency</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-200">137 ms</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Class Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={classData} dataKey="value" nameKey="name" outerRadius={90} fill="#15c4ff" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.id}</p>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-100">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2">Module: {item.module}</p>
                <p>Latency: {item.latency}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">3D Situational Figure</h3>
        <p className="mb-4 text-sm text-slate-300">
          Interactive Three.js view for presentation and operational briefing context.
        </p>
        <GeoFigure />
      </Card>
    </section>
  );
}
