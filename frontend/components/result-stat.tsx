type ResultStatProps = {
  label: string;
  value: string;
  tone?: "cyan" | "violet" | "emerald";
};

const TONE_CLASSES: Record<NonNullable<ResultStatProps["tone"]>, string> = {
  cyan: "text-cyan-200 border-cyan-300/20 bg-cyan-300/10",
  violet: "text-violet-200 border-violet-300/20 bg-violet-300/10",
  emerald: "text-emerald-200 border-emerald-300/20 bg-emerald-300/10",
};

export function ResultStat({ label, value, tone = "cyan" }: ResultStatProps) {
  return (
    <div className={`rounded-xl border p-3 ${TONE_CLASSES[tone]}`}>
      <p className="text-xs uppercase tracking-[0.12em] opacity-80">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
