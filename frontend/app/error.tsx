"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="m-0 min-h-screen bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-xl rounded-2xl border border-rose-300/20 bg-rose-900/20 p-6">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-300">
            The interface hit an unexpected error. Try refreshing the current page.
          </p>
          <Button onClick={reset} className="mt-4">
            Retry
          </Button>
        </div>
      </body>
    </html>
  );
}
