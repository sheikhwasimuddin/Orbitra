"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { StatusIndicator } from "@/components/status-indicator";

const links = [
  { href: "/analyze", label: "Analyze" },
  { href: "/similarity", label: "Similarity" },
  { href: "/compare", label: "Compare" },
  { href: "/prithvi-lab", label: "Prithvi Lab" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-200/10 bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-lg font-bold tracking-[0.08em] text-white">
            GeoVision FM
          </Link>
          <StatusIndicator />
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {links.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition duration-300 ${
                  active
                    ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.2)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:text-cyan-100 hover:shadow-[0_0_16px_rgba(34,211,238,0.14)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
