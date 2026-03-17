export function LoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5 md:col-span-2" />
    </div>
  );
}
