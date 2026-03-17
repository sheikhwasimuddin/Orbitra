import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "@/app/globals.css";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbitra | Premium Satellite AI Platform",
  description: "Advanced industrial-ready satellite image analysis platform with foundation model intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(spaceGrotesk.className, "bg-bg text-text antialiased")}>
        <div className="star-field" aria-hidden="true" />
        <div className="app-noise" aria-hidden="true" />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
