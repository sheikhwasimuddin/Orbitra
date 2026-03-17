export function Footer() {
  return (
    <footer className="border-t border-cyan-200/10 bg-slate-950/55 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="space-y-2">
          <p className="font-semibold tracking-[0.08em] text-slate-200">GeoVision FM</p>
          <p>Premium geospatial AI workspace for deployable analysis and foundation-model research.</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-slate-300 transition hover:text-cyan-200">GitHub</a>
          <a href="#" className="text-slate-300 transition hover:text-cyan-200">Docs</a>
          <a href="#" className="text-slate-300 transition hover:text-cyan-200">API</a>
        </div>
      </div>
    </footer>
  );
}
