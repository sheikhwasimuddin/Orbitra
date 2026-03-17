export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
      <div className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-44 animate-pulse rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}
