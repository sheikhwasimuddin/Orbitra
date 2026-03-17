"use client";

import { useEffect, useState } from "react";

import { healthCheck } from "@/lib/api";

type StatusState = "checking" | "online" | "offline";

const STATE_STYLES: Record<StatusState, string> = {
  checking: "border-amber-300/40 bg-amber-400/15 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.2)]",
  online: "border-emerald-300/40 bg-emerald-400/15 text-emerald-100 shadow-[0_0_22px_rgba(52,211,153,0.2)]",
  offline: "border-rose-300/40 bg-rose-400/15 text-rose-100 shadow-[0_0_22px_rgba(251,113,133,0.18)]",
};

export function StatusIndicator() {
  const [status, setStatus] = useState<StatusState>("checking");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await healthCheck();
        if (active) {
          setStatus("online");
        }
      } catch {
        if (active) {
          setStatus("offline");
        }
      }
    }

    void load();
    const timer = window.setInterval(load, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const label = status === "checking" ? "API checking" : status === "online" ? "API online" : "API offline";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${STATE_STYLES[status]}`}
      aria-live="polite"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
